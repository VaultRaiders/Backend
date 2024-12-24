ALTER TABLE "bots" ALTER COLUMN "pool_price" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "bots" ALTER COLUMN "pool_price" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "winning_amount" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "winning_amount" SET DEFAULT '0';