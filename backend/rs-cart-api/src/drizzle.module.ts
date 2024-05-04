import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './db/schemas';

export const DRIZZLE = Symbol('DRIZZLE');

@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const connection = postgres(
          `postgres://${config.get('POSTGRES_USER')}:${config.get(
            'POSTGRES_PASSWORD',
          )}` +
            `@${config.get('POSTGRES_HOST')}:${config.get('POSTGRES_PORT')}` +
            `/${config.get('POSTGRES_DB')}`,
        );
        const client = drizzle(connection, { schema, logger: true });

        console.time('DB connection latency');
        await client.execute(sql`select 1`);
        console.timeEnd('DB connection latency');

        return client;
      },
    },
  ],
  imports: [ConfigModule],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
