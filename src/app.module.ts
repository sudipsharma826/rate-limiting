import { ExecutionContext, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'short',
            limit: 3,
            ttl: 1000,
            blockDuration: 60,
          },
          {
            name: 'medium',
            limit: 20,
            ttl: 10000,
            blockDuration: 60,
          },
          {
            name: 'long',
            limit: 20,
            ttl: 60000,
            blockDuration: 60,
          },
        ],
        errorMessage: 'Too many requests, please try again later.',
        storage: new ThrottlerStorageRedisService(
          config.get<string>('REDIS_URL'),
        ),
        getTracker: (req: Record<string,any>,context : ExecutionContext) => {
          // return req.ip; it return the ip default
          return req.headers['x-tenant-id'] || req.ip; // it return the tenant id if exist in header otherwise return the ip
        },
      }),
    }),
  ],

  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}