"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const throttler_storage_redis_1 = require("@nest-lab/throttler-storage-redis");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    throttlers: [
                        {
                            limit: 1,
                            ttl: (0, throttler_1.seconds)(5),
                            blockDuration: (0, throttler_1.seconds)(1),
                        },
                        {
                            name: 'short',
                            limit: 3,
                            ttl: (0, throttler_1.seconds)(10),
                            blockDuration: (0, throttler_1.seconds)(1),
                        },
                        {
                            name: 'medium',
                            limit: 20,
                            ttl: (0, throttler_1.seconds)(20),
                            blockDuration: (0, throttler_1.seconds)(10),
                        },
                        {
                            name: 'long',
                            limit: 20,
                            ttl: (0, throttler_1.seconds)(60),
                            blockDuration: (0, throttler_1.minutes)(1),
                        },
                    ],
                    errorMessage: 'Too many requests, please try again later.',
                    storage: new throttler_storage_redis_1.ThrottlerStorageRedisService(config.get('REDIS_URL')),
                    getTracker: (req) => {
                        const tenantId = req.headers?.['x-tenant-id'];
                        return tenantId ? tenantId : req.ip;
                    },
                    generateKey: (context, tracker, throttlerName) => {
                        return `${throttlerName}-${tracker}`;
                    },
                }),
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map