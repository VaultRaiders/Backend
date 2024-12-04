import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '../config';

const pool = new Pool({
  host: DB_HOST,
  port: parseInt(DB_PORT || '5432'),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const db = drizzle(pool);

async function main() {
  console.log('Migration started...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migration completed');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
