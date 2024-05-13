import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './db/schemas';
import { DRIZZLE } from './drizzle.module';

@Injectable()
export class DrizzleService {
  constructor(
    @Inject(DRIZZLE) readonly db: PostgresJsDatabase<typeof schema>,
  ) {}
}
