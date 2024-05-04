import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { DrizzleModule } from 'src/drizzle.module';
import { DrizzleService } from 'src/drizzle.service';

@Module({
  imports: [DrizzleModule],
  providers: [UsersService, DrizzleService],
  exports: [UsersService],
})
export class UsersModule {}
