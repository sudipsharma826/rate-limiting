import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    defaultLimit(): string;
    singleThrottler(): string;
    multipleThrottler(): string;
    freeRoute(): string;
}
