import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { minutes, seconds, SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Case 1: default limiter from the global throttler guard
  @Get('default-limit')
  defaultLimit(): string {
    return 'Default limiter route';
  }


  // Case 2: a single throttler
    @SkipThrottle({ default: true })
  @Throttle({
     short: { limit: 3, ttl: seconds(10) , blockDuration: minutes(1) } })
  @Get('single-throttler')
  singleThrottler(): string {
    return 'Single throttler route';
  }

  // Case 3: multiple throttlers on the same route
  @SkipThrottle({ default: true })
  @Throttle({
    short: { limit: 3, ttl: seconds(10), blockDuration: minutes(1) },
    medium: { limit: 20, ttl: seconds(20), blockDuration: minutes(1) },
    long: { limit: 20, ttl: seconds(60), blockDuration: minutes(1) },
  })
  @Get('multiple-throttler')
  multipleThrottler(): string {
    return 'Multiple throttler route';
  }

  // Case 4: free from all configured throttlers ( default, short, medium, long )
  @SkipThrottle({
    default: true,
    short: true,
    medium: true,
    long: true,
  })
  @Get('free-route')
  freeRoute(): string {
    return 'Free route: no throttling applied';
  }
}
