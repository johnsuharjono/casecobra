import { db } from '@/db'
import { billingAddresses, orders, shippingAddresses } from '@/db/schema'
import { stripe } from '@/lib/stripe'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import OrderReceivedEmail from '@/components/emails/order-received-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      // 400 -> bad request
      return new Response('Invalid', { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )

    if (event.type === 'checkout.session.completed') {
      if (!event.data.object.customer_details?.email) {
        throw new Error('Missing user email')
      }

      const session = event.data.object as Stripe.Checkout.Session
      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      }

      if (!userId || !orderId) {
        throw new Error('Invalid request metadata')
      }

      const billingAddress = session.customer_details!.address
      const shippingAddress = session.customer_details!.address

      const [shippingAddressEntry] = await db
        .insert(shippingAddresses)
        .values({
          name: session.customer_details!.name!,
          city: shippingAddress?.city!,
          street: shippingAddress?.line1!,
          country: shippingAddress?.country!,
          postalCode: shippingAddress?.postal_code!,
          state: shippingAddress?.state!,
        })
        .returning()

      const [billingAddressEntry] = await db
        .insert(billingAddresses)
        .values({
          name: session.customer_details!.name!,
          city: billingAddress?.city!,
          street: billingAddress?.line1!,
          country: billingAddress?.country!,
          postalCode: billingAddress?.postal_code!,
          state: billingAddress?.state!,
        })
        .returning({ billingId: billingAddresses.id })

      const [updatedOrder] = await db
        .update(orders)
        .set({
          isPaid: true,
          billingAddressId: billingAddressEntry.billingId,
          shippingAddressId: shippingAddressEntry.id,
        })
        .where(eq(orders.id, orderId))
        .returning({ updatedAt: orders.updatedAt })

      await resend.emails.send({
        from: 'CaseCobra <john.suharjono10@gmail.com>',
        to: [event.data.object.customer_details.email],
        subject: 'Thanks for your order',
        react: OrderReceivedEmail({
          orderId,
          orderDate: updatedOrder.updatedAt.toLocaleDateString(),
          shippingAddress: shippingAddressEntry,
        }),
      })
    }

    return NextResponse.json({ result: event, ok: true })
  } catch (e) {
    console.error(e)

    return NextResponse.json(
      { message: 'Something went wrong', ok: false },
      { status: 500 },
    )
  }
}
