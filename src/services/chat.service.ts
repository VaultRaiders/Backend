import { and, desc, eq, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../infra/db';
import { Bot, Chat, ChatMessage, chat_messages, chats, User, bots, Ticket } from '../infra/schema';
import { botMessage, delay, systemMessage } from '../util/common';
import { MyContext } from '../util/interface';
import { UserService } from './user.service';
import { BotService } from './bot.service';
import { OpenAIService } from './openai.service';
import { ChatCompletionAssistantMessageParam, ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from 'openai/resources';
import { Telegram } from '../infra/telegram';
import { WalletService } from './wallet.service';
import { BotMessages } from '../components/messages/bot.messages';
import { createSubscriptionRequiredKeyboard } from '../components/keyboards/chat.keyboards';
import { createBackToMainKeyboard } from '../components/keyboards/base';
import { ScheduleService } from './schedule.service';

export interface ChatResponse {
  msg: ChatMessage[];
  error: Error | null;
}

export interface PhotoGenerationResult {
  msgs: ChatMessage[];
  hasInviteToSubscribe: boolean;
}

export type ChatCompletionMessageParam = ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam | ChatCompletionSystemMessageParam;

export class ChatService {
  private static instance: ChatService;
  private readonly telegramBot = Telegram.getInstance().getBot();
  private readonly openAIService = OpenAIService.getInstance();
  private readonly userService = UserService.getInstance();
  private readonly botService = BotService.getInstance();
  private readonly walletService = WalletService.getInstance();
  private readonly scheduleService = ScheduleService.getInstance();

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async handleTextMessage(currentChat: Chat, messageText: string, ctx: MyContext, ticket: Ticket): Promise<ChatResponse> {
    try {
      const user = await this.userService.getOrCreateUser(currentChat.userId, ctx.from?.username, ctx.chat?.id?.toString());

      if (!user || !currentChat) {
        throw new Error(!user ? 'User not found.' : 'Chat not found.');
      }

      const bot = await db.query.bots.findFirst({
        where: eq(bots.id, currentChat.botId),
      });

      if (!bot) {
        throw new Error('Bot not found.');
      }

      const chat = await this.getOrCreateChat(user.id, bot, ticket);
      const threadId = chat.id;
      const userMessage = await this.saveUserMessage(currentChat.id, user, bot, messageText);

      const msg = await this.processMessage(threadId, chat, user, bot, userMessage, ctx);
      if (!msg) {
        return { msg: [], error: null };
      }

      await this.updateMessageCount(user, bot, chat, msg);

      return { msg, error: null };
    } catch (error) {
      console.error('Error in handleTextMessage:', error);
      return { msg: [], error: error as Error };
    }
  }

  async getOrCreateChat(userId: string, bot: Bot, ticket: Ticket): Promise<Chat> {
    const userChat = await db.query.chats.findFirst({
      where: and(eq(chats.id, `${userId}_${bot.id}_${ticket.id.split('-')[0]}`)),
    });

    if (userChat) return userChat;

    const [newChat] = await db
      .insert(chats)
      .values({
        id: `${userId}_${bot.id}_${ticket.id.split('-')[0]}`,
        userId: userId,
        botId: bot.id,
      })
      .returning();

    await db
      .update(bots)
      .set({ chatCount: sql<number>`chat_count + 1` })
      .where(eq(bots.id, bot.id));

    return newChat;
  }

  private async processMessage(threadId: string, chat: Chat, user: User, bot: Bot, userMessage: ChatMessage, ctx: MyContext): Promise<ChatMessage[]> {
    const oldMessage: ChatMessage[] = await db.query.chat_messages.findMany({
      where: eq(chat_messages.chatId, chat.id),
      orderBy: [desc(chat_messages.createdAt)],
      limit: 21,
    });

    const history = oldMessage
      .filter((i) => i.senderId && i.text)
      .map((i) => ({
        role: i.senderRole === 'user' ? 'user' : ('assistant' as 'user' | 'assistant'),
        content: i.text || ' ',
      }))
      .reverse();

    const messages: ChatCompletionMessageParam[] = [
      {
        content: `
        ${bot.additionalInstructions}
        
        ${bot.prompt}`,
        role: 'system',
      },
      ...history,
    ];
    const responseMessage = await this.handleOpenAIChat(messages, user, bot, userMessage);
    if (!responseMessage) return [];

    const message = await this.saveBotMessage(threadId, user, bot, responseMessage);
    return [message];
  }

  private async handleOpenAIChat(messages: any[], user: User, bot: Bot, userMessage: ChatMessage): Promise<string> {
    let userDefeated = false;
    return new Promise(async (res, rej) => {
      const runner = await this.openAIService.sendMessageWithChatComplele(messages);

      runner.on('finalContent', (final) => {
        if (final) res(final);
      });
      runner.on('functionCall', async (message) => {
        if (userDefeated) {
          runner.abort();
          return;
        }

        userDefeated = true;
        this.botService.disableTicket(user.id, bot.id);
        switch (message.name) {
          case 'reject': {
            await this.botService.userDefeated(bot, user);

            const isoTimestamp = new Date().toISOString();
            const unixTimestamp = Math.floor(new Date(isoTimestamp).getTime());
            this.scheduleService.schedule(
              bot.id,
              async () => {
                await this.botService.botDefeated(bot, user, userMessage);
              },
              unixTimestamp + 43200000, //12hours,
            );
            await this.telegramBot.telegram.sendPhoto(user.chatId!, 'https://iili.io/2SlZ6MJ.png');
            await this.telegramBot.telegram.sendMessage(user.chatId!, systemMessage(BotMessages.defeatMessage(bot.displayName)), {
              parse_mode: 'HTML',
              ...createSubscriptionRequiredKeyboard(),
            });
            break;
          }
          case 'approve': {
            const reciept = await this.botService.botDefeated(bot, user, userMessage);
            const pendingMsg = await this.telegramBot.telegram.sendMessage(user.chatId!, systemMessage(BotMessages.disbursingAwardMessage()), {
              parse_mode: 'HTML',
            });
            await this.telegramBot.telegram.sendPhoto(user.chatId!, 'https://iili.io/2SlZP6v.png');
            await this.telegramBot.telegram.sendMessage(user.chatId!, systemMessage(BotMessages.victoryMessage(bot.displayName)), {
              parse_mode: 'HTML',
              ...createBackToMainKeyboard(),
            });
            if (reciept) {
              await this.telegramBot.telegram.editMessageText(
                pendingMsg.chat.id,
                pendingMsg.message_id,
                undefined,
                systemMessage(BotMessages.deliveredAwardMessage()),
                {
                  parse_mode: 'HTML',
                  reply_markup: {
                    inline_keyboard: [
                      [
                        {
                          text: 'View on Explorer',
                          url: `https://scanv2-testnet.ancient8.gg/tx/${reciept.hash}`,
                        },
                      ],
                    ],
                  },
                },
              );
            }
          
            break;
          }
          default: {
            throw new Error('Error occurred when doing transaction');
          }
        }
      });

      runner.on('error', (error) => {
        console.log('OpenAI API returned an API error', error);
        rej(new Error(`Unknown message: ${error.message}`));
      });

      runner.finalChatCompletion().catch((error) => {
        if (error instanceof Error && error.message === 'Request was aborted.') {
          console.log('Request was aborted');
          res('');
        } else {
          rej(new Error(`Unknown message: ${error.message}`));
        }
      });
    });
  }

  private async saveUserMessage(chatId: string, user: User, bot: Bot, text: string): Promise<ChatMessage> {
    return this.saveMessage(chatId, user, bot, text, 'user');
  }

  private async saveBotMessage(chatId: string, user: User, bot: Bot, text: string): Promise<ChatMessage> {
    return this.saveMessage(chatId, user, bot, text, 'bot');
  }

  private async saveMessage(chatId: string, user: User, bot: Bot, text: string, role: string): Promise<ChatMessage> {
    const messageData: ChatMessage = {
      id: randomUUID(),
      text,
      senderRole: role,
      chatId: chatId,
      senderId: role === 'user' ? user.id : bot.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [message] = await db.insert(chat_messages).values(messageData).returning();
    return message;
  }

  private async updateMessageCount(user: User, bot: Bot, chat: Chat, messages: ChatMessage[]): Promise<void> {
    await Promise.all([
      db
        .update(bots)
        .set({
          messageCount: sql<number>`message_count + ${messages.length + 1}`,
        })
        .where(eq(bots.id, bot.id)),

      db
        .update(chats)
        .set({
          botMessageCount: sql<number>`bot_message_count + ${messages.length}`,
          userMessageCount: sql<number>`user_message_count + 1`,
        })
        .where(eq(chats.id, chat.id)),
    ]);
  }
}
