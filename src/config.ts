import { createHash } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN! || '';

export const DB_HOST = process.env.DB_HOST! || '';
export const DB_PORT = process.env.DB_PORT! || '5433';
export const DB_USER = process.env.DB_USER! || 'postgres';
export const DB_NAME = process.env.DB_NAME! || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD! || '';

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY! || '';
export const RPC_URL = process.env.RPC_URL! || '';

export const MINI_APP_URL = process.env.MINI_APP_URL! || '';
export const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000;

export const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS! || '';
export const POOL_PRIVATE_KEY = process.env.POOL_PRIVATE_KEY! || '';

export const REDIS_HOST = process.env.REDIS_HOST! || '';
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD! || '';
