import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Users } from 'src/db/schemas';
import { DrizzleService } from 'src/drizzle.service';

@Injectable()
export class UsersService {
  constructor(readonly drizzle: DrizzleService) {}

  async findOne(userId: string) {
    return this.drizzle.db.query.Users.findFirst({
      where: eq(Users.id, userId),
    });
  }

  async createOne(name: string, password: string) {
    return (
      await this.drizzle.db
        .insert(Users)
        .values({
          name,
          password,
        })
        .returning()
    )[0];
  }
}
