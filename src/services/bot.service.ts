import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js';
import { and, eq, sql, isNull, cosineDistance } from 'drizzle-orm';
import { asc, desc, inArray } from 'drizzle-orm/expressions';
import { randomUUID } from 'node:crypto';
import OpenAI from 'openai';
import { FACTORY_ADDRESS, OPENAI_API_KEY } from '../config';
import { MAX_SUPPLY, PRICE_DECIMALS, PRICE_DENOMINATOR, REDIS_TTL, SUBSCRIPTION_DURATION } from '../constant';
import { db } from '../infra/db';
import { Bot, bots, Chat, chats, subscriptions, User, users, Subscription } from '../infra/schema';
import { botMessage, hintMessage } from '../util/common';
import { ICreateBotData, IProccessedBotData } from '../util/interface';
import { getHolderPDA } from '../util/pda';
import { getRedisAllBotsKey, getRedisOneBotKey } from '../util/redis';
import { RedisService } from './redis.service';
import { WalletService } from './wallet.service';
import { GetListBotsResponse } from '../types/responses/bot.response';
import { ApiError, BadRequestError, NotFoundError } from '../types/errors';
import { Telegram } from '../infra/telegram';
import { BotMessages } from '../components/messages/bot.messages';
import { UserService } from './user.service';
import { ZeroAddress } from 'ethers';
import { QueryResult } from 'pg';

export class BotService {
  private static instance: BotService;

  private readonly telegramBot = Telegram.getInstance().getBot();
  private readonly walletService: WalletService;
  private readonly userService: UserService;
  private readonly redisService: RedisService;
  private readonly openai: OpenAI;

  private constructor() {
    this.userService = UserService.getInstance();
    this.walletService = WalletService.getInstance();
    this.redisService = RedisService.getInstance();
    this.userService = UserService.getInstance();
    this.openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  }

  static getInstance(): BotService {
    if (!BotService.instance) {
      BotService.instance = new BotService();
    }
    return BotService.instance;
  }

  async getListBots(limit: number, page: number): Promise<GetListBotsResponse> {
    const cacheKey = getRedisAllBotsKey(`${limit}_${page}`);

    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const data = await db
      .select()
      .from(bots)
      .orderBy(asc(bots.order))
      .limit(limit)
      .offset((page - 1) * limit)
      .execute();

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(bots)
      .execute();

    const enrichedData = await this.enrichBotsWithCreatorData(data);

    const res: GetListBotsResponse = { bots: enrichedData, total: Number(total[0].count) };
    await this.redisService.set(cacheKey, JSON.stringify(res), REDIS_TTL.MEDIUM);

    return res;
  }

  async getMyBots(userId: string): Promise<Bot[]> {
    const myBots = await db.select().from(bots).where(eq(bots.createdBy, userId)).execute();
    return myBots;
  }

  async getRecentBots(userId: string): Promise<Bot[]> {
    const cacheKey = getRedisAllBotsKey(`recently_chatted_${userId}`);

    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const recentChats = await db.query.chats.findMany({
      where: eq(chats.userId, userId),
      orderBy: [desc(chats.updatedAt)],
      limit: 100,
    });

    const recentChatsSet = new Set<string>();
    const deduplicatedChats: Chat[] = [];
    for (const chat of recentChats) {
      if (!recentChatsSet.has(chat.botId)) {
        recentChatsSet.add(chat.botId);
        deduplicatedChats.push(chat);
      }
    }

    const botIds = deduplicatedChats.map((chat) => chat.botId);
    const recentBots = await db.query.bots.findMany({
      where: inArray(bots.id, botIds),
    });

    const enrichedBots = deduplicatedChats
      .map((chat) => {
        const bot = recentBots.find((b) => b.id === chat.botId);
        return bot ? { ...bot, conversation: chat } : null;
      })
      .filter((bot): bot is Bot & { conversation: Chat } => bot !== null);

    this.redisService.set(cacheKey, JSON.stringify(enrichedBots), REDIS_TTL.SHORT);
    return enrichedBots;
  }

  async createBot(userId: string, botData: ICreateBotData, password: string): Promise<Bot> {
    const wallet = await this.walletService.getWallet(userId, password);
    // const factoryPublicKey = new PublicKey(FACTORY_ADDRESS);
    // const factoryState = await this.program.account.factoryState.fetch(factoryPublicKey);
    // const program = await this.getProgram(new Wallet(wallet));

    // const userBalance = await this.connection.getBalance(wallet.publicKey);
    // if (userBalance < Number(factoryState.botCreationFee) * 1.1) {
    //   throw new BadRequestError('Insufficient balance for bot creation');
    // }

    const config = (await db.query.configs.findFirst())!.value;
    const botInDb = await this.createBotInDatabase(userId, botData, config);

    try {
      // const [botPda] = PublicKey.findProgramAddressSync(
      //   [Buffer.from('bot'), factoryPublicKey.toBuffer(), factoryState.totalBots.toArrayLike(Buffer, 'le', 8)],
      //   program.programId,
      // );

      // const signature = await program.methods
      //   .createBot(new BN(LAMPORTS_PER_SOL), botData.initKeys)
      //   .accountsStrict({
      //     factory: factoryPublicKey,
      //     bot: botPda,
      //     owner: wallet.publicKey,
      //     systemProgram: SystemProgram.programId,
      //   })
      //   .signers([wallet])
      //   .rpc();

      // await this.walletService.confirmTransaction(signature);
      // await db.update(bots).set({ address: botPda.toString() }).where(eq(bots.id, botInDb.id));
      return {
        ...botInDb,
        address: ZeroAddress,
      };
    } catch (error) {
      await db.delete(bots).where(eq(bots.id, botInDb.id));
      throw error;
    }
  }

  async getBot(botId: string): Promise<Bot> {
    const cacheKey = getRedisOneBotKey(botId);

    const cachedBot = await this.redisService.get(cacheKey);
    if (cachedBot) {
      return JSON.parse(cachedBot);
    }

    const bot = await db.query.bots.findFirst({
      where: eq(bots.id, botId),
    });

    if (!bot) {
      throw new NotFoundError('Bot not found');
    }

    await this.redisService.set(cacheKey, JSON.stringify(bot), REDIS_TTL.LONG);
    return bot;
  }

  // async buyTicket(botId: string, userId: string, password: string): Promise<string> {
  //   try {
  //     const bot = await db.query.bots.findFirst({
  //       where: eq(bots.id, botId),
  //     });

  //     if (!bot?.address) {
  //       throw new Error('Bot not found');
  //     }

  //     const wallet = await this.walletService.getWallet(userId, password);
  //     // const signature = await this.executeBuyTicket(bot.address, wallet);

  //     await this.updateSubscription(userId, botId);

  //     return ZeroAddress;
  //   } catch (error) {
  //     console.error('Error buying ticket:', error);
  //     throw new Error('Failed to buy ticket');
  //   }
  // }

  // functions calling
  async disableSubscription(userId: string, botId: string) {
    await db
    .update(subscriptions)
    .set({expiredAt: new Date()})
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.botId, botId), isNull(subscriptions.expiredAt)));
  }

  async buyTicket(botId: string, userId: string, password: string): Promise<string> {
    try {
      const bot = await db.query.bots.findFirst({
        where: eq(bots.id, botId),
      });

      if (!bot?.address) {
        throw new Error('Bot not found');
      }

      // TODO: charge money
      const wallet = await this.walletService.getWallet(userId, password);
      // const signature = await this.executeBuyTicket(bot.address, wallet);

      const existingSubscription = await this.getValidSubscription(userId, botId)
      if(existingSubscription) {
        throw new Error('subscript was existed');
      }

      await this.createSubscription(userId, botId)
      return ZeroAddress;
    } catch (error) {
      console.error('Error buying ticket:', error);
      throw new Error('Failed to buy ticket');
    }
  }

  async getSubscription(botId: string, userId: string) {
    const bot = await this.getBot(botId);
    if (!bot.createdBy || bot.createdBy == userId) {
      return true;
    }

    try {
      return await db.query.subscriptions.findFirst({
        where: and(eq(subscriptions.userId, userId), eq(subscriptions.botId, botId)),
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw new Error('Failed to fetch subscription');
    }
  }

  async getTicketPrice(botAddress: string) {
    try {
      return 1n;
    } catch (error) {
      console.error('Error getting ticket price:', error);
      throw new Error('Failed to get ticket price');
    }
  }

  async sendBotGreeting(user: User, bot: Bot) {
    if (!user.chatId) return;
    await this.telegramBot.telegram.sendChatAction(user.chatId, 'upload_photo');
    if (bot.photoUrl) {
      await this.telegramBot.telegram.sendPhoto(user.chatId, bot.photoUrl);
    }

    if (bot.greeting) {
      await this.telegramBot.telegram.sendMessage(user.chatId, botMessage(bot.displayName, bot.greeting), { parse_mode: 'HTML' });
    }

    const suggestion = BotMessages.getRandomSuggestion();
    await this.telegramBot.telegram.sendMessage(user.chatId, hintMessage(suggestion), { parse_mode: 'HTML' });
    await this.telegramBot.telegram.sendMessage(user.chatId, hintMessage(BotMessages.showMenuHint), { parse_mode: 'HTML' });
  }

  private async updateSubscription(userId: string, botId: string): Promise<void> {
    try {
      const existingSubscription = await db.query.subscriptions.findFirst({
        where: and(eq(subscriptions.userId, userId), eq(subscriptions.botId, botId)),
      });

      const newExpiryDate = new Date(Math.max(Date.now(), existingSubscription?.expiresAt.getTime() ?? Date.now()) + SUBSCRIPTION_DURATION);

      if (existingSubscription) {
        await db
          .update(subscriptions)
          .set({ expiresAt: newExpiryDate })
          .where(and(eq(subscriptions.userId, userId), eq(subscriptions.botId, botId)));
      } else {
        await db.insert(subscriptions).values({
          userId,
          botId,
          expiresAt: newExpiryDate,
        });
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  async getValidSubscription (userId: string, botId: string): Promise<Subscription | void>  {
    try {
      return await db.query.subscriptions.findFirst({
        where: and(eq(subscriptions.userId, userId), eq(subscriptions.botId, botId), isNull(subscriptions.expiredAt)),
      });

    } catch (error) {
      console.error('Error get subscription:', error);
      throw new Error('Failed to get valid subscription');
    }
  }

  private async createSubscription(userId: string, botId: string): Promise<QueryResult<never>> {
    try {
      return await db.insert(subscriptions).values({
        userId,
        botId,
        expiresAt: new Date()
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  private async enrichBotsWithCreatorData(data: any[]) {
    const createdByIdSet = new Set<string>();
    for (const bot of data) {
      if (bot.created_by) createdByIdSet.add(bot.created_by);
    }

    const userData = await db.query.users.findMany({
      where: inArray(users.id, Array.from(createdByIdSet)),
    });

    return data.map((bot) => ({
      ...bot,
      created_by_username: userData.find((user) => user.id === bot.created_by)?.username,
    }));
  }

  private generateSlug(displayName: string): string {
    return `${displayName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-/, '')
      .replace(/-$/, '')}-${randomUUID().split('-')[0]}`;
  }

  private async createBotInDatabase(userId: string, botData: ICreateBotData, config: any): Promise<Bot> {
    const additionalInstructions = botData.prompt;
    const data = await db
      .insert(bots)
      .values({
        id: this.generateSlug(botData.displayName),
        openaiAssistantId: config.assistant_id,
        displayName: botData.displayName,
        prompt: botData.prompt,
        createdBy: userId,
        additionalInstructions,
      })
      .returning();

    return data[0];
  }

  private async executeBuyTicket(botAddress: string, wallet: Keypair): Promise<string> {
    // const program = await this.getProgram(new Wallet(wallet));
    // const botPDA = new PublicKey(botAddress);
    // const botAccount = await this.getBotAccount(botAddress);

    // const signature = await program.methods
    //   .buyTicket()
    //   .accountsStrict({
    //     factory: botAccount.factory,
    //     bot: botPDA,
    //     buyer: wallet.publicKey,
    //     systemProgram: SystemProgram.programId,
    //   })
    //   .signers([wallet])
    //   .rpc();

    // await this.walletService.confirmTransaction(signature);
    return ZeroAddress;
  }

  async getValidBotsForUser(userId: string): Promise<Bot[]> {
    try {
      const activeSubscriptions = await db.query.subscriptions.findMany({
        where: and(eq(subscriptions.userId, userId), sql`${subscriptions.expiresAt} > NOW()`),
      });

      if (!activeSubscriptions.length) return [];

      const botIds = activeSubscriptions.map((sub) => sub.botId);
      const validBots = await db.query.bots.findMany({
        where: inArray(bots.id, botIds),
      });

      return validBots;
    } catch (error) {
      console.error('Error fetching valid bots:', error);
      return [];
    }
  }

  async getCreatedBots(userId: string): Promise<Bot[]> {
    try {
      const createdBots = await db.query.bots.findMany({
        where: eq(bots.createdBy, userId),
        orderBy: [desc(bots.createdAt)],
      });

      return createdBots;
    } catch (error) {
      console.error('Error fetching created bots:', error);
      return [];
    }
  }

  async getActiveSubscribers(botId: string): Promise<number> {
    try {
      const activeSubscribers = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(subscriptions)
        .where(and(eq(subscriptions.botId, botId), sql`${subscriptions.expiresAt} > NOW()`));

      return activeSubscribers[0].count;
    } catch (error) {
      console.error('Error getting active subscriptions:', error);
      return 0;
    }
  }

}

export const botService = BotService.getInstance();
