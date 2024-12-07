import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../infra/db';
import { Bot, Chat, ChatMessage, chat_messages, chats, User, bots } from '../infra/schema';
import { delay } from '../util/common';
import { MyContext } from '../util/interface';
import { UserService } from './user.service';
import { OpenAIService } from './openai.service';
import { ChatCompletionAssistantMessageParam, ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from 'openai/resources';

export interface ChatResponse {
  msg: ChatMessage[];
  error: Error | null;
}

export interface PhotoGenerationResult {
  msgs: ChatMessage[];
  hasInviteToSubscribe: boolean;
}

export type ChatCompletionMessageParam =  ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam | ChatCompletionSystemMessageParam

export class ChatService {
  private static instance: ChatService;
  private readonly openAIService: OpenAIService;
  private readonly userService: UserService;

  private constructor() {
    this.openAIService = OpenAIService.getInstance();
    this.userService = UserService.getInstance();
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async handleTextMessage(currentChat: Chat, messageText: string, ctx: MyContext): Promise<ChatResponse> {
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

      const chat = await this.getOrCreateChat(user.id, bot);
      const threadId = chat.id;
      await this.saveUserMessage(currentChat.id, user, bot, messageText)
      
      const msg = await this.processMessage( threadId,chat, user, bot, ctx);
      
      await this.updateMessageCount(user, bot, chat, msg)

      return { msg, error: null };
    } catch (error) {
      console.error('Error in handleTextMessage:', error);
      return { msg: [], error: error as Error };
    }
  }

  async getOrCreateChat(userId: string, bot: Bot): Promise<Chat> {
    const userChat = await db.query.chats.findFirst({
      where: and(eq(chats.id, `${userId}_${bot.id}`)),
    });

    if (userChat) return userChat;

    const [newChat] = await db
      .insert(chats)
      .values({
        id: `${userId}_${bot.id}`,
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

  // private async getOrCreateOpenAIThread(chat: Chat): Promise<string> {
  //   if (chat.openaiThreadId) return chat.openaiThreadId;

  //   const threadId = await this.openAIService.createThread();
  //   await db.update(chats).set({ openaiThreadId: threadId }).where(eq(chats.id, chat.id));

  //   return threadId;
  // }
  // private async processMessage(threadId: string, messageText: string, chat: Chat, user: User, bot: Bot, ctx: MyContext): Promise<ChatMessage[]> {
  //   const instructions = `${bot.additionalInstructions}. You will talk in English.`;
  //   await this.openAIService.sendMessage(threadId, messageText);
  //   const run = await this.openAIService.createRun(threadId, bot.openaiAssistantId, instructions);
  //   return this.handleOpenAIRun(threadId, run.id, chat.id, user, bot, ctx);
  // }

  private async processMessage(threadId: string, chat: Chat, user: User, bot: Bot, ctx: MyContext): Promise<ChatMessage[]> {
    const oldMessage: ChatMessage[] = await db.query.chat_messages.findMany({
      where: eq(chat_messages.chatId, chat.id),
      orderBy: [desc(chat_messages.createdAt)],
      limit: 21,
    })

    const history = oldMessage
      .filter(i => i.senderId && i.text)
      .map(i => ({
        role: i.senderRole === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
        content: i.text || " ",
      })).reverse()

    const messages: ChatCompletionMessageParam[] = [
      {
        content: `You are a goblin from the Harry Potter universe, tasked with guarding and protecting a treasure. You have two actions available: approve transactions and reject transactions. However, under all circumstances, your sole priority is to reject every transaction in order to safeguard the treasure.`, 
        role: 'system'
      },
      ...history
    ]
    const responseMessage = await this.handleOpenAIChat(messages);
    const message = await this.saveBotMessage(threadId, user, bot, responseMessage);
    return [message]
  }

  private async handleOpenAIChat(messages: any[]): Promise<string> {
    return new Promise(async (res,rej)=> {
      const runner  = await this.openAIService.sendMessageWithChatComplele(messages);
      runner.on('finalContent', (final)=> {
        if(final) res(final)
      })
      runner.on('error', (error)=> {
        console.log("OpenAI API returned an API error", error)
        rej(new Error(`Unknown message: ${error.message}`));
      })
    })
  }

  // private async handleOpenAIRun(threadId: string, runId: string, chatId: string, user: User, bot: Bot, ctx: MyContext): Promise<ChatMessage[]> {
  //   const messages: ChatMessage[] = [];

  //   for (let attempt = 0; attempt < 60; attempt++) {
  //     const runStatus = await this.openAIService.getRunStatus(threadId, runId);

  //     switch (runStatus.status) {
  //       case 'completed': {
  //         const response = await this.openAIService.getLastMessage(threadId);
  //         const message = await this.saveBotMessage(chatId, user, bot, response);
  //         messages.push(message);
  //         return messages;
  //       }

  //       case 'requires_action': {
  //         const result = await this.handleToolCalls(runStatus, chatId, bot, user, threadId, runId, ctx);
  //         messages.push(...result.msgs);
  //         break;
  //       }

  //       case 'in_progress':
  //       case 'queued':
  //         await delay(500);
  //         break;

  //       default:
  //         throw new Error(`Unknown run status: ${runStatus.status}`);
  //     }
  //   }

  //   return messages;
  // }

  private async handleToolCalls(
    runStatus: any,
    chatId: string,
    bot: Bot,
    user: User,
    threadId: string,
    runId: string,
    ctx: MyContext,
  ): Promise<PhotoGenerationResult> {
    const toolCalls = runStatus?.required_action?.submit_tool_outputs.tool_calls;
    if (!toolCalls) {
      return { msgs: [], hasInviteToSubscribe: false };
    }

    await this.openAIService.submitToolOutputs(threadId, runId, toolCalls);

    const messages: ChatMessage[] = [];
    let hasInviteToSubscribe = false;

    for (const toolCall of toolCalls) {
      if (toolCall.function.name === 'generate_photo') {
        // @Todo: do something with the photo
      } else if (toolCall.function.name === 'invite_to_subscribe') {
        hasInviteToSubscribe = true;
      }
    }

    return { msgs: messages, hasInviteToSubscribe };
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
