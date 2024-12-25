import { Redis } from 'ioredis';
import Redlock from 'redlock';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../config';

export class RedisService {
  private static instance: RedisService;
  private redisClient: Redis;
  private redlock: Redlock;

  private constructor() {
    this.redisClient = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
    });

    this.redlock = new Redlock([this.redisClient], {
      driftFactor: 0.01, // Safety margin for clock drift
      retryCount: 10, // Max retry attempts
      retryDelay: 200, // Retry delay in ms
      retryJitter: 200, // Random jitter to avoid thundering herd
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async set(key: string, value: string, expire?: number): Promise<string> {
    try {
      if (expire) {
        return await this.redisClient.set(key, value, 'EX', expire);
      }
      return await this.redisClient.set(key, value);
    } catch (error) {
      console.error('Error in set:', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      console.error('Error in get:', error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redisClient.del(key);
    } catch (error) {
      console.error('Error in del:', error);
      throw error;
    }
  }

  async expire(key: string, expire: number): Promise<number> {
    try {
      return await this.redisClient.expire(key, expire);
    } catch (error) {
      console.error('Error in expire:', error);
      throw error;
    }
  }

  async exists(key: string): Promise<number> {
    try {
      return await this.redisClient.exists(key);
    } catch (error) {
      console.error('Error in exists:', error);
      throw error;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.redisClient.incr(key);
    } catch (error) {
      console.error('Error in incr:', error);
      throw error;
    }
  }

  async lockByValue<T>(key: string, duration: number, callback: () => Promise<T>): Promise<T> {
    try {
      const lock = await this.redlock.acquire([key], duration);
      try {
        return await callback();
      } finally {
        await lock.release();
      }
    } catch (error) {
      console.error('Error in lockByValue:', error);
      throw error;
    }
  }
  async getFirstInSortedSet (sortedSetKey: string){
    const results = await this.redisClient.zrange(
      sortedSetKey,
      0,
      new Date().getTime(),
      'BYSCORE',
      'LIMIT',
      0,
      1
    );
    return results?.length ? results[0] : null;
  }
  async addToSortedSet (sortedSetKey: string, member: string, score: string) {
    return this.redisClient.zadd(sortedSetKey, score, member);
  }
  async removeFromSortedSet (sortedSetKey: string, member: string) {
    return this.redisClient.zrem(sortedSetKey, member);
  }
}
