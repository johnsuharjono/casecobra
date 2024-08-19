ALTER TABLE "configurations_table" RENAME TO "configurations";--> statement-breakpoint
ALTER TABLE "configurations" DROP CONSTRAINT "configurations_table_url_unique";--> statement-breakpoint
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_url_unique" UNIQUE("url");