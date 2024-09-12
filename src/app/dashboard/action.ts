'use server'

import { db } from '@/db'
import { orders, OrderStatus } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function changeOrderStatus({
  id,
  newStatus,
}: {
  id: string
  newStatus: OrderStatus
}) {
  await db
    .update(orders)
    .set({
      status: newStatus,
    })
    .where(eq(orders.id, id))
}
