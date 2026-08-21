import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { QueueModule } from './modules/queue/queue.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    // ----- Config -------------------------------------------
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig],
      envFilePath: ['.env', '../../.env'],
    }),

    // ----- Infrastructure -----------------------------------
    PrismaModule,
    RedisModule,
    QueueModule,

    // ----- Feature modules ----------------------------------
    HealthModule,
  ],
})
export class AppModule {}
