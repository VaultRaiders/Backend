import { and, eq, sql, isNull, cosineDistance } from 'drizzle-orm';
import { asc, desc, ilike, inArray } from 'drizzle-orm/expressions';
import { randomUUID } from 'node:crypto';
import OpenAI from 'openai';
import { config, FACTORY_ADDRESS, OPENAI_API_KEY } from '../config';
import { REDIS_TTL } from '../constant';
import { db } from '../infra/db';
import { Bot, bots, Chat, chats, tickets, User, users } from '../infra/schema';
import { botMessage, hintMessage } from '../util/common';
import { ICreateBotData, IProccessedBotData } from '../util/interface';
import { getRedisAllBotsKey, getRedisOneBotKey, getReidsMyBotsKey } from '../util/redis';
import { RedisService } from './redis.service';
import { WalletService } from './wallet.service';
import { GetListBotsResponse } from '../types/responses/bot.response';
import { ApiError, BadRequestError, NotFoundError } from '../types/errors';
import { Telegram } from '../infra/telegram';
import { BotMessages } from '../components/messages/bot.messages';
import { UserService } from './user.service';
import { ethers, formatEther, formatUnits, getBigInt, parseEther, ZeroAddress } from 'ethers';
import { QueryResult } from 'pg';
import FactoryAbi from '../types/abi/iFactory.json';
import BotAbi from '../types/abi/iBot.json';
import { IBot, IFactory } from '../types/typechain-types';
import { BotCreatedEvent } from '../types/typechain-types/contracts/IFactory';
import { promise } from 'zod';
import { IGetListBotsQuery } from '../types/validations/bot.validation';
import { format } from 'node:path';

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

  async getListBots({ isActive, search, orderBy, sort, limit, page }: IGetListBotsQuery): Promise<GetListBotsResponse> {
    const cacheKey = getRedisAllBotsKey(JSON.stringify({ isActive, search, orderBy, sort, limit, page }));
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

    const conditions = [
      ...(isActive !== undefined ? [eq(bots.isActive, isActive)] : []),
      ...(search ? [ilike(bots.displayName, `%${search}%`)] : []),
    ];

    const dbQuery = db
      .select()
      .from(bots)
      .where(and(...conditions));

    if (orderBy && !['balance', 'ticketPrice'].includes(orderBy)) {
      dbQuery.orderBy(sort === 'asc' ? asc(sql.identifier(orderBy)) : desc(sql.identifier(orderBy)));
    }

    const [data, [{ count }]] = await Promise.all([
      dbQuery
        .limit(limit)
        .offset((page - 1) * limit)
        .execute(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(bots)
        .where(and(...conditions))
        .execute(),
    ]);

    const enrichedData = await this.enrichBotsWithCreatorData(data);
    let enrichedOnchainData = await this.enrichBotWithOnchainData(enrichedData);

    if (orderBy && ['balance', 'ticketPrice'].includes(orderBy)) {
      enrichedOnchainData.sort((a, b) => {
        const aRawValue = a[orderBy as 'balance' | 'ticketPrice'] ?? '0.0';
        const bRawValue = b[orderBy as 'balance' | 'ticketPrice'] ?? '0.0';

        const aValue = aRawValue === '0.0' ? 0n : parseEther(aRawValue);
        const bValue = bRawValue === '0.0' ? 0n : parseEther(bRawValue);

        return sort === 'asc' ? Number(aValue - bValue) : Number(bValue - aValue);
      });
    }

    const response = { bots: enrichedOnchainData, total: Number(count) };
    await this.redisService.set(cacheKey, JSON.stringify(response), REDIS_TTL.MEDIUM);

    return response;
  }

  async getMyBots(userId: string): Promise<Bot[]> {
    const cacheKey = getReidsMyBotsKey(`my_bots_${userId}`);
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

    const myBots = await db.select().from(bots).where(eq(bots.createdBy, userId)).execute();
    const enrichedOnchainData = await this.enrichBotWithOnchainData(myBots);

    await this.redisService.set(cacheKey, JSON.stringify(enrichedOnchainData), REDIS_TTL.MEDIUM);
    return enrichedOnchainData;
  }

  async getRecentBots(userId: string): Promise<Bot[]> {
    const cacheKey = getRedisAllBotsKey(`recently_chatted_${userId}`);
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

    const recentChats = await db.query.chats.findMany({
      where: eq(chats.userId, userId),
      orderBy: [desc(chats.updatedAt)],
      limit: 100,
    });

    const uniqueBotIds = [...new Set(recentChats.map((chat) => chat.botId))];
    const recentBots = await db.query.bots.findMany({
      where: inArray(bots.id, uniqueBotIds),
    });

    const enrichedBots = recentChats
      .filter((chat, index, self) => index === self.findIndex((t) => t.botId === chat.botId))
      .map((chat) => {
        const bot = recentBots.find((b) => b.id === chat.botId);
        return bot ? { ...bot, conversation: chat } : null;
      })
      .filter((bot): bot is Bot & { conversation: Chat } => bot !== null);

    await this.redisService.set(cacheKey, JSON.stringify(enrichedBots), REDIS_TTL.SHORT);
    return enrichedBots;
  }

  async createBot(userId: string, botData: ICreateBotData, password: string): Promise<Bot> {
    const wallet = await this.walletService.getWallet(userId, password);
    const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FactoryAbi, wallet.provider) as unknown as IFactory;

    const [userBalance, botCreationFee] = await Promise.all([this.walletService.getBalance(wallet.address), factoryContract.botCreationFee()]);

    if (userBalance < Number(botCreationFee) * 1.05) {
      throw new BadRequestError('Insufficient balance for bot creation');
    }

    const botInDb = await this.createBotInDatabase(userId, botData);

    try {
      const tx = await factoryContract.connect(wallet).createBot(wallet.address, 0n, { value: botCreationFee });

      const receipt = await tx.wait();
      if (!receipt?.status) throw new Error('Bot creation failed');

      const botCreatedEvent = receipt.logs.map((log) => factoryContract.interface.parseLog(log)).find((log) => log?.name === 'BotCreated');
      if (!botCreatedEvent) throw new Error('Bot creation event not found');
      const botAddress = (botCreatedEvent as unknown as BotCreatedEvent.Log).args.botAddress.toLowerCase();

      await db.update(bots).set({ address: botAddress }).where(eq(bots.id, botInDb.id));

      return { ...botInDb, address: botAddress };
    } catch (error) {
      await db.delete(bots).where(eq(bots.id, botInDb.id));
      throw error;
    }
  }

  async getBot(botId: string): Promise<Bot> {
    const cacheKey = getRedisOneBotKey(botId);
    const cachedBot = await this.redisService.get(cacheKey);
    if (cachedBot) return JSON.parse(cachedBot);

    const bot = await db.query.bots.findFirst({
      where: eq(bots.id, botId),
    });

    if (!bot) throw new NotFoundError('Bot not found');

    const [enrichedBot] = await this.enrichBotWithOnchainData([bot]);
    await this.redisService.set(cacheKey, JSON.stringify(enrichedBot), REDIS_TTL.SHORT);

    return enrichedBot;
  }

  async getBotBalance(botAddress: string): Promise<bigint> {
    return this.walletService.getBalance(botAddress);
  }

  async disableTicket(userId: string, botId: string) {
    const ticket = await db.query.tickets.findFirst({
      where: and(eq(tickets.userId, userId), eq(tickets.botId, botId), eq(tickets.used, false)),
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    await db
      .update(tickets)
      .set({ used: true })
      .where(and(eq(tickets.userId, userId), eq(tickets.botId, botId)));
  }

  async disableBot(botId: string) {
    await db
      .update(bots)
      .set({ isActive: false })
      .where(and(eq(bots.id, botId)));
    await this.redisService.del(getRedisOneBotKey(botId));
  }

  async buyTicket(botId: string, userId: string, password: string) {
    try {
      const bot = await db.query.bots.findFirst({
        where: eq(bots.id, botId),
      });

      if (!bot?.address) {
        throw new NotFoundError('Bot not found');
      }

      const wallet = await this.walletService.getWallet(userId, password);
      const iBot = new ethers.Contract(bot.address, BotAbi, wallet.provider) as unknown as IBot;
      const ticketPrice = await this.getTicketPrice(bot.address);
      const userBalance = await this.walletService.getBalance(wallet.address);

      if (userBalance < ticketPrice) {
        throw new BadRequestError('Insufficient balance for ticket purchase');
      }

      const ticket = await db.query.tickets.findFirst({
        where: and(eq(tickets.userId, userId), eq(tickets.botId, botId), eq(tickets.used, false)),
      });
      if (ticket) {
        throw new BadRequestError('Ticket already purchased');
      }

      const tx = await iBot.connect(wallet).buyTicket({ value: ticketPrice });
      const receipt = await tx.wait();
      if (!receipt || receipt.status === 0) {
        throw new Error('Ticket purchase failed');
      }

      return await db.insert(tickets).values({
        id: randomUUID(),
        userId,
        botId,
        txHash: receipt.hash,
        price: formatEther(ticketPrice),
        used: false,
      });
    } catch (error) {
      console.error('Error buying ticket:', error);
      throw new Error('Failed to buy ticket');
    }
  }

  async getAvailableTicket(botId: string, userId: string) {
    try {
      return await db.query.tickets.findFirst({
        where: and(eq(tickets.userId, userId), eq(tickets.botId, botId), eq(tickets.used, false)),
      });
    } catch (error) {
      throw new Error('Failed to fetch ticket');
    }
  }

  async getTicketPrice(botAddress: string) {
    try {
      const bot = new ethers.Contract(botAddress, BotAbi, this.walletService.provider) as unknown as IBot;
      return await bot.getPrice();
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

    await this.telegramBot.telegram.sendMessage(user.chatId, hintMessage(BotMessages.showMenuHint), { parse_mode: 'HTML' });
  }

  private async enrichBotsWithCreatorData(data: Bot[]) {
    const createdByIdSet = new Set<string>();
    for (const bot of data) {
      if (bot.createdBy) createdByIdSet.add(bot.createdBy);
    }

    const userData = await db.query.users.findMany({
      where: inArray(users.id, Array.from(createdByIdSet)),
    });

    return data.map((bot) => ({
      ...bot,
      createdByUsername: userData.find((user) => user.id === bot.createdBy)?.username,
    }));
  }

  private async enrichBotWithOnchainData(data: Bot[]) {
    return await Promise.all(
      data.map(async (bot) => {
        return {
          ...bot,
          balance: bot.address ? formatEther(await this.getBotBalance(bot.address)) : undefined,
          ticketPrice: bot.address ? formatEther(await this.getTicketPrice(bot.address)) : undefined,
        };
      }),
    );
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

  private async createBotInDatabase(userId: string, botData: ICreateBotData): Promise<Bot> {
    const additionalInstructions = botData.prompt;
    const data = await db
      .insert(bots)
      .values({
        id: this.generateSlug(botData.displayName),
        openaiAssistantId: config.assistantId,
        displayName: botData.displayName,
        prompt: botData.prompt,
        createdBy: userId,
        additionalInstructions,
        photoUrl: botData.photoUrl,
      })
      .returning();

    return data[0];
  }

  async getValidBotsForUser(userId: string): Promise<Bot[]> {
    try {
      const activeSubscriptions = await db.query.tickets.findMany({
        where: and(eq(tickets.userId, userId), eq(tickets.used, false)),
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

  async approveBot(botAddress: string, winnerAddress: string) {
    try {
      const factory = new ethers.Contract(FACTORY_ADDRESS, FactoryAbi, this.walletService.provider) as unknown as IFactory;
      const tx = await factory.connect(await this.walletService.getOwnerWallet()).disbursement(botAddress, winnerAddress);
      const receipt = await tx.wait();
      if (!receipt || receipt.status === 0) {
        throw new Error('Bot approval failed');
      }

      return receipt;
    } catch (error) {
      console.error('Error approving bot:', error);
      throw new Error('Failed to approve bot');
    }
  }
}

export const botService = BotService.getInstance();
