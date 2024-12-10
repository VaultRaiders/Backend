ALTER TABLE "subscriptions" ADD COLUMN "expired_at" timestamp;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;