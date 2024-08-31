"use server"

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products"
import { db } from "@/db"
import { configurations, orders, SelectOrder } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { eq } from "drizzle-orm"

export async function createCheckoutSession({
  configId,
}: {
  configId: string
}) {
  const configuration = await db
    .selectDistinct()
    .from(configurations)
    .where(eq(configurations.id, configId))

  if (!configuration) {
    throw new Error("Configuration not found")
  }

  const { getUser } = await getKindeServerSession()
  const user = await getUser()

  if (!user) {
    throw new Error("You need to be logged in!")
  }

  const { finish, material } = configuration[0]

  const price =
    BASE_PRICE +
    PRODUCT_PRICES.material[material!] +
    PRODUCT_PRICES.finish[finish!]

  let order: SelectOrder | undefined = undefined

  const [existingOrder] = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))

  if (existingOrder) {
    order = existingOrder
  } else {
    let queryResult = await db
      .insert(orders)
      .values({
        amount: String(price / 100),
        configurationId: configId,
        userId: user.id,
      })
      .returning()

    order = queryResult[0]
  }

  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration[0].imageUrl],
    default_price_data: {
      currency: "SGD",
      unit_amount: price,
    },
  })

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "paynow"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configId}`,
    shipping_address_collection: {
      allowed_countries: ["SG"],
    },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [
      {
        price: product.default_price as string,
        quantity: 1,
      },
    ],
  })

  return {
    url: stripeSession.url,
  }
}
