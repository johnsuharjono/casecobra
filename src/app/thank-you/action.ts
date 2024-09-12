'use server'

import { db } from '@/db'
import { orders } from '@/db/schema'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { and, eq } from 'drizzle-orm'

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('You need to be logged in to view this page.')
  }

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.userId, user.id)),
    with: {
      billingAddress: true,
      shippingAddress: true,
      configuration: true,
      user: true,
    },
  })
  if (!order) throw new Error('This order does not exist.')

  if (order.isPaid) {
    return order
  } else {
    return false
  }
}
