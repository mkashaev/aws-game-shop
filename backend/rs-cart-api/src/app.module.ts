import { cwd, env } from 'node:process';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { DrizzleModule } from './drizzle.module';
import { DrizzleService } from './drizzle.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${cwd()}/configs/.env.${env.NODE_ENV || 'prod'}`,
    }),
    DrizzleModule,
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [DrizzleService],
})
export class AppModule {}
