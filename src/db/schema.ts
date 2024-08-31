import { relations } from "drizzle-orm"
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  text,
  boolean,
  numeric,
} from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

const orderStatuses = ["fullfilled", "shipped", "awaiting_shipment"] as const
const phoneModels = [
  "iphonex",
  "iphone11",
  "iphone12",
  "iphone13",
  "iphone14",
  "iphone15",
] as const
const caseMaterials = ["silicone", "polycarbonate"] as const
const caseColors = ["black", "rose", "blue"] as const
const caseFinish = ["smooth", "textured"] as const

export type OrderStatus = (typeof orderStatuses)[number]
export const orderStatusEnum = pgEnum("orderStatus", orderStatuses)

export type PhoneModel = (typeof phoneModels)[number]
export const phoneModelEnum = pgEnum("phoneModel", phoneModels)

export type CaseMaterial = (typeof caseMaterials)[number]
export const caseMaterialEnum = pgEnum("caseMaterial", caseMaterials)

export type CaseColor = (typeof caseColors)[number]
export const caseColorEnum = pgEnum("caseColor", caseColors)

export type CaseFinish = (typeof caseFinish)[number]
export const caseFinishEnum = pgEnum("caseFinish", caseFinish)

export const configurations = pgTable("configurations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
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

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
})

export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}))

export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  configurationId: text("configuration_id").notNull(),
  userId: text("user_id").notNull(),
  amount: numeric("amount").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  status: orderStatusEnum("status").notNull().default("awaiting_shipment"),
  shippingAddressId: text("shipping_address_id").notNull(),
  billingAddressId: text("billing_address_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
})

export const orderRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  configurationId: one(configurations, {
    fields: [orders.configurationId],
    references: [configurations.id],
  }),
  shippingAddress: one(shippingAddresses, {
    fields: [orders.shippingAddressId],
    references: [shippingAddresses.id],
  }),
  billingAddreses: one(billingAddresses, {
    fields: [orders.billingAddressId],
    references: [billingAddresses.id],
  }),
}))

export const shippingAddresses = pgTable("shipping_addresses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  name: text("name").notNull(),
  street: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  state: text("state"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
})

export const shippingAddressRelations = relations(
  shippingAddresses,
  ({ many }) => ({
    orders: many(orders),
  }),
)

export const billingAddresses = pgTable("billing_addresses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  name: text("name").notNull(),
  street: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  state: text("state"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
})

export const billingAddressRelations = relations(
  billingAddresses,
  ({ many }) => ({
    many: many(orders),
  }),
)

export type InsertConfiguration = typeof configurations.$inferInsert
export type SelectConfiguration = typeof configurations.$inferSelect
export type SelectOrder = typeof orders.$inferSelect
