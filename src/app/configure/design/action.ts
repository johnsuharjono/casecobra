"use server"

import { db } from "@/db"
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  configurations,
  PhoneModel,
} from "@/db/schema"
import { COLORS } from "@/validators/option-validator"
import { eq } from "drizzle-orm"

export type SaveConfigArgs = {
  color: CaseColor
  finish: CaseFinish
  material: CaseMaterial
  model: PhoneModel
  configId: string
}

export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigArgs) {
  await db
    .update(configurations)
    .set({
      color,
      finish,
      material,
      model,
    })
    .where(eq(configurations.id, configId))
}
