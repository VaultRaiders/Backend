import { sql } from 'drizzle-orm';
import { bigint, boolean, decimal, index, integer, json, pgTable, serial, smallint, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 100 }).primaryKey().notNull(),
  chatId: text('chat_id'),
  username: varchar('username', { length: 100 }).notNull(),
  currentBotId: varchar('current_bot_id', { length: 255 }),
  winCount: integer('win_count').default(0),
  winingAmount: decimal('winning_amount').default("0"),
  playCount: integer('play_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const bots = pgTable(
  'bots',
  {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    address: varchar('address', { length: 255 }),
    openaiAssistantId: varchar('openai_assistant_id', {
      length: 255,
    }).notNull(),
    photoUrl: text('photo_url'),
    displayName: varchar('display_name', { length: 255 }).notNull(),
    greeting: text('greeting'),
    bio: text('bio'),
    prompt: text('prompt').notNull(),
    createdBy: varchar('created_by', { length: 255 }),
    chatCount: integer('chat_count').default(0),
    messageCount: integer('message_count').default(0),
    additionalInstructions: text('additional_instructions'),
    order: integer('order').default(1),
    ticketCount: decimal('ticket_count').default("0"),
    userCount: integer('user_count').default(0),
    winner: varchar('winner'),
    poolPrice: decimal('pool_price').default("0"),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
  },
  (table) => {
    return {
      orderIdx: index('order_idx').on(table.order),
    };
  },
);

export const configs = pgTable('configs', {
  key: varchar('key').notNull().primaryKey(),
  value: json('value').notNull().$type<Record<any, any>>(),
});

export const chats = pgTable('chats', {
  id: text('id').notNull().primaryKey(),
  openaiThreadId: text('openai_thread_id'),
  userMessageCount: integer('user_message_count'),
  botMessageCount: integer('bot_message_count').default(sql`0`),
  userId: text('user_id').notNull(),
  botId: text('bot_id').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
});

export const chat_messages = pgTable('chat_messages', {
  id: text('id').notNull().primaryKey(),
  text: text('text'),
  senderRole: text('sender_role'),
  senderId: text('sender_id'),
  chatId: text('chat_id'),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
});

export const wallets = pgTable('wallets', {
  userId: varchar('user_id').primaryKey(),
  address: text('address').notNull(),
  encryptedKey: text('encrypted_key').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
});

export const tickets = pgTable('tickets', {
  id: text('id').notNull().primaryKey(),
  userId: varchar('user_id').notNull(),
  botId: varchar('bot_id').notNull(),
  used: boolean('used').default(false),
  txHash: varchar('tx_hash', { length: 255 }).notNull(),
  price: decimal('price').notNull(),
  updatedAt: timestamp('updated_at').default(sql`now()`),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
});

export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;

export type Ticket = typeof tickets.$inferSelect;

export type UserConfig = typeof configs.$inferSelect;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Bot = typeof bots.$inferSelect;

export type Config = typeof configs.$inferSelect;

export type Chat = typeof chats.$inferSelect;

export type ChatMessage = typeof chat_messages.$inferSelect;
export type NewChatMessage = typeof chat_messages.$inferInsert;
