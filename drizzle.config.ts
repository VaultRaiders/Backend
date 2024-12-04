import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './src/config';
dotenv.config();

export default {
  schema: './src/infra/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],

  dbCredentials: {
    host: DB_HOST,
    port: parseInt(DB_PORT || '5432'),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: false,
  },
} satisfies Config;
