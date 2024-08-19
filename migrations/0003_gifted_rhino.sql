ALTER TABLE "configurations" RENAME COLUMN "url" TO "image_url";--> statement-breakpoint
ALTER TABLE "configurations" DROP CONSTRAINT "configurations_url_unique";--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_image_url_unique" UNIQUE("image_url");