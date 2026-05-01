import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { days, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [ThrottlerModule.forRoot({
    throttlers:[
      {
        limit: 5, // max 5 requests
        // ttl: days(1), // per 1 day
        ttl: 60, // per 60 seconds
        blockDuration: 60, // to unblock
      }
    ],
    errorMessage: 'Too many requests, please try again later.', // custom error message
  })],
  controllers: [AppController],
  providers: [AppService,{
  provide: APP_GUARD, // apply throttler globally
  useClass: ThrottlerGuard
}],
})
export class AppModule {}
