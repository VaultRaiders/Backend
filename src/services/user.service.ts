import { asc, eq, sql } from 'drizzle-orm';
import { REDIS_TTL } from '../constant';
import { db } from '../infra/db';
import { User, users } from '../infra/schema';
import { getRedisProfileKey } from '../util/redis';
import { RedisService } from './redis.service';
import { ApiError, NotFoundError } from '../types/errors';

export class UserService {
  private static instance: UserService;
  private readonly redisService: RedisService;

  private constructor() {
    this.redisService = RedisService.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getOrCreateUser(telegramId: string, username: string = 'unknown', chatId?: string): Promise<User> {
    try {
      const existingUser = await this.getUserById(telegramId);
      if (!existingUser.chatId && chatId) {
        await db.update(users).set({ chatId }).where(eq(users.id, telegramId));
        await this.redisService.del(getRedisProfileKey(telegramId));
      }

      return existingUser;
    } catch (error) {
      if (error instanceof ApiError) {
        const newUser = await this.createUser(telegramId, username, chatId);
        if (!newUser) {
          throw new Error('Failed to create user');
        }

        return newUser;
      } else {
        throw error;
      }
    }
  }

  async getUserById(telegramId: string): Promise<User> {
    const cacheKey = getRedisProfileKey(telegramId);

    // const cachedProfile = await this.redisService.get(cacheKey);
    // if (cachedProfile) {
    //   return JSON.parse(cachedProfile);
    // }

    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, telegramId),
    });

    if (!userProfile) {
      throw new NotFoundError('User not found');
    }

    await this.redisService.set(cacheKey, JSON.stringify(userProfile), REDIS_TTL.MEDIUM);
    return userProfile;
  }

  async updateCurrentBot(userId: string, botId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await db.update(users).set({ currentBotId: botId }).where(eq(users.id, userId));

    // Invalidate cache
    const cacheKey = getRedisProfileKey(userId);
    await this.redisService.del(cacheKey);
  }

  private async createUser(telegramId: string, username: string, chatId?: string): Promise<User> {
    try {
      const [newUser] = await db
        .insert(users)
        .values({
          id: telegramId,
          username,
          chatId,
        })
        .returning();

      if (!newUser) {
        throw new Error('Failed to create user');
      }

      return newUser;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  async getLeaderboard(k: number = 5) {
    if (!k) return [];
    const data = await db.query.users.findMany({
      orderBy: [asc(users.winingAmount)],
    });

    const metadata = data.reduce(
      (prev, curr) => {
        prev.totalParticipant += 1;
        if (curr?.winingAmount) {
          prev.totalPrizeEarned = `${+prev.totalPrizeEarned + curr?.winingAmount}`;
        }
        if (curr.playCount) {
          prev.totalPlays += curr.playCount;
        }
        if (curr.winCount) {
          prev.totalWin += curr.winCount;
        }
        return prev;
      },
      { totalParticipant: 0, totalPrizeEarned: '0', totalPlays: 0, totalWin: 0 } as {
        totalParticipant: number;
        totalPrizeEarned: string;
        totalPlays: number;
        totalWin: number;
      },
    );
    return {
      leaderboard: data,
      metadata,
    };
  }

  async updateStats(winingAmount: string) {
    return db.update(users).set({
      winCount: sql`${users.winCount} + 1`,
      playCount: sql`${users.playCount} + 1`,
      winingAmount: sql`${users.winingAmount} + ${winingAmount}`,
    });
  }

  async updatePlayCount() {
    return db.update(users).set({
      playCount: sql`${users.playCount} + 1`,
    });
  }
}
