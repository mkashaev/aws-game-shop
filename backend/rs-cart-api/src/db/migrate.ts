import { cwd, env } from 'node:process';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const nodeEnv = env.NODE_ENV || 'dev';
config({ path: `${cwd()}/configs/.env.${nodeEnv}` });

async function main() {
  const dbUrl =
    `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}` +
    `@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}` +
    `/${env.POSTGRES_DB}`;

  console.log('Env file: ', `${cwd()}/configs/.env.${nodeEnv}`);
  console.log('DB url: ', dbUrl);

  const client = postgres(dbUrl, { max: 1, ssl: false });

  await migrate(drizzle(client), { migrationsFolder: 'src/db/@drizzle' });
  await client.end();
}

main();
