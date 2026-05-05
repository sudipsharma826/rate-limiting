import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Rate Limiting is Working!';
  }

  getBye(): string {
    return 'Goodbye!';
  }
}
