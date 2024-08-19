import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

const orderStatuses = ["fullfilled", "shipped", "awaiting_shipment"] as const
export type OrderStatus = (typeof orderStatuses)[number]
export const orderStatusEnum = pgEnum("orderStatus", orderStatuses)

const phoneModels = [
  "iphonex",
  "iphone11",
  "iphone12",
  "iphone13",
  "iphone14",
  "iphone15",
] as const
export type PhoneModel = (typeof phoneModels)[number]
export const phoneModelEnum = pgEnum("phoneModel", phoneModels)

const caseMaterials = ["silicone", "polycarbonate"] as const
export type CaseMaterial = (typeof caseMaterials)[number]
export const caseMaterialEnum = pgEnum("caseMaterial", caseMaterials)

const caseColors = ["black", "rose", "blue"] as const
export type CaseColor = (typeof caseColors)[number]
export const caseColorEnum = pgEnum("caseColor", caseColors)

const caseFinish = ["smooth", "textured"] as const
export type CaseFinish = (typeof caseFinish)[number]

export const caseFinishEnum = pgEnum("caseFinish", caseFinish)

export const configurations = pgTable("configurations", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  imageUrl: text("image_url").notNull().unique(),
  croppedImageUrl: text("cropped_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  color: caseColorEnum("color"),
  model: phoneModelEnum("model"),
  material: caseMaterialEnum("material"),
  finish: caseFinishEnum("finish"),
})

export type InsertConfiguration = typeof configurations.$inferInsert
export type SelectConfiguration = typeof configurations.$inferSelect
