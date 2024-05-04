import { cwd, env } from 'node:process';
import { config } from 'dotenv';

const nodeEnv = env.NODE_ENV || 'dev';

config({ path: `${cwd()}/configs/.env.${nodeEnv}` });

export default {
  schema: 'src/db/schemas/*.schema.ts',
  out: 'src/db/@drizzle',
  driver: 'pg',
  dbCredentials: {
    host: env.POSTGRES_HOST,
    port: Number.parseInt(env.POSTGRES_PORT, 10),
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  },
  verbose: true,
  strict: true,
};
