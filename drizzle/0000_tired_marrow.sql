CREATE TABLE IF NOT EXISTS "bots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" varchar(255),
	"openai_assistant_id" varchar(255) NOT NULL,
	"photo_url" text,
	"display_name" varchar(255) NOT NULL,
	"greeting" text,
	"bio" text,
	"created_by" varchar(255),
	"chat_count" integer DEFAULT 0,
	"message_count" integer DEFAULT 0,
	"additional_instructions" text,
	"order" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text,
	"sender_role" text,
	"sender_id" text,
	"chat_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chats" (
	"id" text PRIMARY KEY NOT NULL,
	"openai_thread_id" text,
	"user_message_count" integer,
	"bot_message_count" integer DEFAULT 0,
	"user_id" text NOT NULL,
	"bot_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "configs" (
	"key" varchar PRIMARY KEY NOT NULL,
	"value" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"user_id" varchar NOT NULL,
	"bot_id" varchar NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"chat_id" text,
	"username" varchar(100) NOT NULL,
	"current_bot_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"encrypted_key" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_idx" ON "bots" USING btree ("order");