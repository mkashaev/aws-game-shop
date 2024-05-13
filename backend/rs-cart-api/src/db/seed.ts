import { cwd, env } from 'node:process';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { CartItems, Carts, Orders, Users } from './schemas';

const nodeEnv = env.NODE_ENV || 'dev';
config({ path: `${cwd()}/configs/.env.${nodeEnv}` });

async function main() {
  const dbUrl =
    `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}` +
    `@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}` +
    `/${env.POSTGRES_DB}`;

  console.log('Env file: ', `${cwd()}/configs/.env.${nodeEnv}`);
  console.log('DB url: ', dbUrl);

  const client = postgres(dbUrl, { max: 1 });

  const db = drizzle(client);

  const users = await db
    .insert(Users)
    .values({
      name: 'Jon',
      password: '12345',
    })
    .returning();

  const carts = await db
    .insert(Carts)
    .values({
      userId: users[0].id,
      status: 'OPEN',
    })
    .returning();

  await db.insert(CartItems).values({
    cartId: carts[0].id,
    count: 1,
  });

  await db.insert(Orders).values({
    userId: users[0].id,
    cartId: carts[0].id,
    payment: { title: 'Bank' },
    delivery: { address: 'Baker street' },
  });

  await client.end();
}

main();
