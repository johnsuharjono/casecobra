ALTER TABLE "orders" ADD COLUMN "shipping_address_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "billing_address_id" text;--> statement-breakpoint
ALTER TABLE "billing_addresses" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "shipping_addresses" DROP COLUMN IF EXISTS "user_id";