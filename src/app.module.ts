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
            ttl: 1000, // 1 sec
            blockDuration: 60,
          },
          {
            name: 'medium',
            limit: 20,
            ttl: 10000, // 10 sec
            blockDuration: 60,
          },
          {
            name: 'long',
            limit: 20,
            ttl: 60000, // 60 sec
            blockDuration: 60,
          },
        ],

        errorMessage: 'Too many requests, please try again later.',

        storage: new ThrottlerStorageRedisService(
          config.get<string>('REDIS_URL'),
        ),

        // WHO is making request
        getTracker: (req: Record<string, any>) => {
          const tenantId = req.headers?.['x-tenant-id'];
          return tenantId ? tenantId : req.ip;
        },

        // HOW key is stored 
        generateKey: (
          context: ExecutionContext,
          tracker: string,
          throttlerName: string,
        ): string => {
          return `${throttlerName}-${tracker}`;
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