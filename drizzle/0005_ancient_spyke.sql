CREATE TABLE IF NOT EXISTS "tickets" (
	"user_id" varchar NOT NULL,
	"bot_id" varchar NOT NULL,
	"used" boolean DEFAULT false,
	"tx_hash" varchar(255) NOT NULL,
	"price" numeric NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "subscriptions" CASCADE;