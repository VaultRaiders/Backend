ALTER TABLE "tickets" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bots" ADD COLUMN "ticket_count" numeric;--> statement-breakpoint
ALTER TABLE "bots" ADD COLUMN "user_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "bots" ADD COLUMN "winner" varchar;--> statement-breakpoint
ALTER TABLE "bots" ADD COLUMN "pool_price" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "win_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "winning_amount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "play_count" integer DEFAULT 0;