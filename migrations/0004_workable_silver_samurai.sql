DO $$ BEGIN
 CREATE TYPE "public"."caseColor" AS ENUM('black', 'rose', 'blue');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."caseFinish" AS ENUM('smooth', 'textured');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."caseMaterial" AS ENUM('silicone', 'polycarbonate');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."orderStatus" AS ENUM('fullfilled', 'shipped', 'awaiting_shipment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."phoneModel" AS ENUM('iphonex', 'iphone11', 'iphone12', 'iphone13', 'iphone14', 'iphone15');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "color" "caseColor";--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "phone_model" "phoneModel";--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "material" "caseMaterial";--> statement-breakpoint
ALTER TABLE "configurations" ADD COLUMN "finish" "caseFinish";