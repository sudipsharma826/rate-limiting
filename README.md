# Rate Limiting Demo

A NestJS API that demonstrates global and route-level rate limiting with Redis-backed storage. This project shows how to configure multiple throttler rules, apply them per endpoint, and skip throttling where needed.

## Overview

This project is built with:

- NestJS
- `@nestjs/throttler`
- Redis-backed throttling storage
- Docker Compose for local Redis

The goal of the project is to demonstrate how API endpoints can behave differently under rate limiting rules:

- an endpoint using the default global limiter
- an endpoint using a single custom throttler
- an endpoint using multiple throttlers
- a free endpoint that skips all throttlers

## Project Design

The application uses a layered NestJS structure:

- `AppModule` configures the global throttler module, Redis storage, and request tracking
- `AppController` defines the API endpoints and applies route-level throttling decorators
- `AppService` returns simple response messages
- Redis stores throttling state so limits are shared and persistent across requests

The throttling key is generated from the request tracker and throttler name, which makes it easy to separate limits by tenant or client IP.

## Rate Limiting Configuration

The project uses a global `ThrottlerGuard` with multiple throttler definitions.

Typical behavior:

- `default` - used for the base global limiter
- `short` - quick burst control
- `medium` - medium window control
- `long` - longer window control

The tracker is based on:

- `x-tenant-id` header when present
- otherwise the client IP address

Redis connection is read from the `REDIS_URL` environment variable.

## API Endpoints To Test

Current routes exposed by the project:

- `GET /` - basic hello response
- `GET /default-limit` - route that uses the default global throttler
- `GET /single-throttler` - route that uses a single custom throttler
- `GET /multiple-throttler` - route that uses multiple custom throttlers
- `GET /free-route` - route that skips all throttlers

## Expected Behavior

- `default-limit` should be blocked only after the configured default threshold is exceeded
- `single-throttler` should follow only the `short` limiter attached to the route
- `multiple-throttler` should follow all throttlers applied to the route
- `free-route` should not be rate limited by any configured throttler

## Local Setup

### Prerequisites

- Node.js installed
- npm installed
- Docker Desktop installed and running

### Install Dependencies

```bash
npm install
```

### Start Redis With Docker

```bash
docker compose up -d
```

### Environment Variables

Create or update `.env` with:

```env
REDIS_URL=redis://localhost:6379
```

If you use a remote Redis instance, update the URL accordingly.

## Run the Application

### Development Mode

```bash
npm run start:dev
```

### Production Build

```bash
npm run build
npm run start:prod
```

## Testing

You can test the rate limiting behavior with repeated requests using curl, Postman, or a browser.

Example with curl:

```bash
curl http://localhost:3000/default-limit
curl http://localhost:3000/single-throttler
curl http://localhost:3000/multiple-throttler
curl http://localhost:3000/free-route
```

For a more accurate test, send multiple requests quickly to observe `429 Too Many Requests` responses on limited routes.

## Configuration Summary

- Global throttling is enabled through `APP_GUARD`
- Redis is used for storage through `ThrottlerStorageRedisService`
- Custom request tracking uses tenant ID or IP address
- Route-level decorators allow throttling overrides or skipping limits

## Build

The project builds with the NestJS CLI:

```bash
npm run build
```

The compiled output is generated in `dist/`.

## Support and Contact

If you need help, want to report an issue, or would like to discuss the project, contact:

- Email: sudeepsharma826@gmail.com
- Website: sudipsharma.com.np

## License

This project is released under the MIT License.
