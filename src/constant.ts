export const PRICE_DECIMALS = 1_000_000_000n;
export const PRICE_DENOMINATOR = 5_000n;
export const MAX_SUPPLY = 500n;
export const SUBSCRIPTION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms
export const IMAGE_FALLBACK_URL = 'https://iili.io/JVIBpgp.png';
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000;

export const REDIS_KEY_PREFIX = {
  PROFILE: 'profile',
  BOT: 'bot',
};

export const REDIS_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 3600,
};
