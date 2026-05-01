import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

// @SkipThrottle() // to skip throttling for this controller
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
//  @SkipThrottle({'custom'}) // to skip throttl name custom for this route
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
@Throttle({'custom': { limit: 5 ,blockDuration: 60}}) // to apply custom limiter for this route
  @Get()
  getBye(): string {
    return this.appService.getBye();
  }
}
