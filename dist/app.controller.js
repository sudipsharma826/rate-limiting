"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const throttler_1 = require("@nestjs/throttler");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    defaultLimit() {
        return 'Default limiter route';
    }
    singleThrottler() {
        return 'Single throttler route';
    }
    multipleThrottler() {
        return 'Multiple throttler route';
    }
    freeRoute() {
        return 'Free route: no throttling applied';
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('default-limit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "defaultLimit", null);
__decorate([
    (0, throttler_1.SkipThrottle)({ default: true }),
    (0, throttler_1.Throttle)({
        short: { limit: 3, ttl: (0, throttler_1.seconds)(10), blockDuration: (0, throttler_1.minutes)(1) }
    }),
    (0, common_1.Get)('single-throttler'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "singleThrottler", null);
__decorate([
    (0, throttler_1.SkipThrottle)({ default: true }),
    (0, throttler_1.Throttle)({
        short: { limit: 3, ttl: (0, throttler_1.seconds)(10), blockDuration: (0, throttler_1.minutes)(1) },
        medium: { limit: 20, ttl: (0, throttler_1.seconds)(20), blockDuration: (0, throttler_1.minutes)(1) },
        long: { limit: 20, ttl: (0, throttler_1.seconds)(60), blockDuration: (0, throttler_1.minutes)(1) },
    }),
    (0, common_1.Get)('multiple-throttler'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "multipleThrottler", null);
__decorate([
    (0, throttler_1.SkipThrottle)({
        default: true,
        short: true,
        medium: true,
        long: true,
    }),
    (0, common_1.Get)('free-route'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "freeRoute", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map