"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { eq } from "drizzle-orm"

export async function getAuthStatus() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user?.email) {
    throw new Error("Invalid user data")
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))

  if (!existingUser) {
    await db.insert(users).values({
      id: user.id,
      email: user.email,
    })
  }

  return {
    success: true,
  }
}
