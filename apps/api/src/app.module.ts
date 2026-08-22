import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Config
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import jwtConfig from './config/jwt.config';
import throttlerConfig from './config/throttler.config';

// Infrastructure
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { QueueModule } from './modules/queue/queue.module';

// Phase 2 — Auth & Security
import { UsersModule } from './modules/users/users.module';
import { OtpModule } from './modules/otp/otp.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminAuthModule } from './modules/admin-auth/admin-auth.module';

// Feature
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // ----- Config -------------------------------------------
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, jwtConfig, throttlerConfig],
      envFilePath: ['.env', '../../.env'],
    }),

    // ----- Rate limiting (global) ---------------------------
    ThrottlerModule.forRoot([
      {
        ttl: 60000,  // 60 s window (in ms for v6)
        limit: 100,
      },
    ]),

    // ----- Infrastructure -----------------------------------
    PrismaModule,
    RedisModule,
    QueueModule,

    // ----- Phase 2 — Auth & Security -----------------------
    UsersModule,
    OtpModule,
    AuditModule,
    AuthModule,
    AdminAuthModule,

    // ----- Feature modules ----------------------------------
    HealthModule,
  ],
  providers: [
    // Apply ThrottlerGuard globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
