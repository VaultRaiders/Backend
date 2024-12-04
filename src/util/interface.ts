import type { Context, NarrowedContext } from 'telegraf';
import type { Message, Update } from 'telegraf/types';

export interface MyContext<U extends Update = Update> extends Context<U> {
  session: {
    lastActivity?: number;
    awaitingImportPrivateKey?: {
      messageId: number;
      privateKey: string;
    };
    awaitingBuyKeys?: {
      messageId: number;
      botAddress: string;
      amount: number;
    };
    awaitingSellKeys?: {
      messageId: number;
      botAddress: string;
      keyIndex: number;
    };
    awaitingWithdraw?: {
      messageId: number;
      botAddress: string;
    };
    awaitingPassword?: {
      action: 'create_wallet' | 'import_wallet' | 'create_bot' | 'buy_key' | 'sell_key' | 'withdraw_revenue' | 'buy_ticket';
      data?: any;
      messageId?: number;
    };
    pendingKeyTrade?: {
      action: 'buy' | 'sell';
      amount: number;
      price: string;
      botId: string;
      keyIndex?: number;
    };
    awaitingDeleteConfirmation?: boolean;
  };
}

export type ctxType = NarrowedContext<
  MyContext<Update>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }
>;

export interface ICreateBotData {
  displayName: string;
  bio: string;
  greeting: string;
  prompt: string;
  initKeys: number;
}

export interface IProccessedBotData extends ICreateBotData {
  id: string;
}
