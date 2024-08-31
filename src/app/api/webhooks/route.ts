import { db } from "@/db"
import { billingAddresses, orders, shippingAddresses } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")

    if (!signature) {
      // 400 -> bad request
      return new Response("Invalid", { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email")
      }

      const session = event.data.object as Stripe.Checkout.Session
      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      }

      if (!userId || !orderId) {
        throw new Error("Invalid request metadata")
      }

      const billingAddress = session.customer_details!.address
      const shippingAddress = session.customer_details!.address

      await db.transaction(async (tx) => {
        const [shippingAddressEntry] = await tx
          .insert(shippingAddresses)
          .values({
            name: session.customer_details!.name!,
            city: shippingAddress?.city!,
            street: shippingAddress?.line1!,
            country: shippingAddress?.country!,
            postalCode: shippingAddress?.postal_code!,
            state: shippingAddress?.state!,
          })
          .returning({ shippingId: shippingAddresses.id })

        const [billingAddressEntry] = await tx
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

        await tx
          .update(orders)
          .set({
            isPaid: true,
            billingAddressId: billingAddressEntry.billingId,
            shippingAddressId: shippingAddressEntry.shippingId,
          })
          .where(eq(orders.id, orderId))
      })
    }

    return NextResponse.json({ result: event, ok: true })
  } catch (e) {
    console.error(e)

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 },
    )
  }
}
