import { REDIS_KEY_PREFIX } from '../constant';

export const getRedisProfileKey = (userId: string): string => {
  return `${REDIS_KEY_PREFIX.PROFILE}::${userId}`;
};

export const getRedisAllBotsKey = (data: string): string => {
  return `bot:list:${data}`;
};

export const getRedisOneBotKey = (botId: string): string => {
  return `bot:getone:${botId}`;
};

export const getReidsMyBotsKey = (userId: string): string => {
  return `bot:my:${userId}`;
};
