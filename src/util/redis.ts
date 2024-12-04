import { REDIS_KEY_PREFIX } from '../constant';

export const getRedisProfileKey = (userId: string): string => {
  return `${REDIS_KEY_PREFIX.PROFILE}::${userId}`;
};

export const getRedisAllBotsKey = (data: string): string => {
  return `${REDIS_KEY_PREFIX.BOT}::${data}`;
};

export const getRedisOneBotKey = (botId: string): string => {
  return `${REDIS_KEY_PREFIX.BOT}::${botId}`;
};
