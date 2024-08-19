DROP TABLE "posts_table";--> statement-breakpoint
DROP TABLE "users_table";--> statement-breakpoint
ALTER TABLE "configurations_table" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "configurations_table" ADD COLUMN "updated_at" timestamp NOT NULL;