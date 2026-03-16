# Planner AI — Backend

> NestJS REST API for the Event Organization Marketplace

[![NestJS](https://img.shields.io/badge/NestJS-v11-ea2845?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-v7.5-2d3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169e1?logo=postgresql)](https://www.postgresql.org/)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Modules](#modules)
- [Database](#database)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Overview

The backend for **Planner AI** — an event organization marketplace in Uzbekistan. Built with NestJS 11, TypeScript, and Prisma, it provides a type-safe REST API for:

- User authentication and role-based authorization
- Event creation, management, and publishing
- Venue search, booking, and availability
- Service marketplace for vendors
- Ticket sales with QR code generation
- Payment processing (Click, Payme)
- Volunteer application management
- Reviews and ratings
- Analytics, reporting, and Excel export

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [NestJS](https://nestjs.com/) | v11 | Backend framework |
| [TypeScript](https://www.typescriptlang.org/) | v5.9 | Type-safe development |
| [Prisma](https://www.prisma.io/) | v7.5 | Database ORM |
| [PostgreSQL](https://www.postgresql.org/) | 14+ | Relational database |
| [Passport](http://www.passportjs.org/) | v0.7 | Authentication middleware |
| [JWT](https://jwt.io/) | — | Token-based auth |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | v6 | Password hashing |
| [Swagger](https://swagger.io/) | — | API documentation |
| [Nodemailer](https://nodemailer.com/) | v8 | Email delivery |
| [Multer](https://github.com/expressjs/multer) | v2 | File upload handling |
| [ExcelJS](https://github.com/exceljs/exceljs) | v4 | Excel report generation |
| [QRCode](https://github.com/soldair/node-qrcode) | v1.5 | QR code generation |
| [cache-manager](https://github.com/node-cache/node-cache) | v7 | Response caching |
| [class-validator](https://github.com/typestack/class-validator) | v0.15 | DTO validation |
| [class-transformer](https://github.com/typestack/class-transformer) | v0.5 | Object transformation |

---

## Project Structure

```
backend/
├── src/
│   ├── analytics/              # Analytics and reporting
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   ├── analytics.module.ts
│   │   └── dto/
│   │
│   ├── auth/                   # Authentication & authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/         # JWT strategies (access, refresh)
│   │   ├── guards/             # Auth guards
│   │   ├── decorators/         # @CurrentUser, @Public
│   │   └── dto/
│   │
│   ├── common/                 # Shared utilities
│   │   ├── filters/            # Global exception filter
│   │   ├── guards/             # RolesGuard, ThrottlerGuard
│   │   ├── interceptors/       # Logging, response transform
│   │   ├── decorators/         # @Roles
│   │   └── utils/
│   │
│   ├── config/                 # Configuration modules
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── mailer.config.ts
│   │
│   ├── events/                 # Event management
│   ├── payments/               # Payment processing (Click, Payme)
│   ├── prisma/                 # Prisma service & module
│   ├── reviews/                # Reviews and ratings
│   ├── services/               # Service marketplace
│   ├── tickets/                # Ticketing & QR codes
│   ├── users/                  # User management
│   ├── venues/                 # Venue listings & bookings
│   ├── volunteers/             # Volunteer applications
│   │
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Entry point
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration history
│   └── seed.ts                 # Database seeding
│
├── generated/                  # Generated Prisma client
├── test/                       # E2E tests
├── .env.example                # Environment template
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher
- **Bun** (recommended) or npm

### Installation

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env
# Edit .env with your values
```

### Database Setup

```bash
# Generate Prisma client
bun run prisma:generate

# Run migrations
bun run prisma:migrate

# (Optional) Seed with sample data
bun run prisma:seed

# Open Prisma Studio
bun run prisma:studio
```

### Running the Server

```bash
# Development with hot reload
bun run start:dev

# Debug mode
bun run start:debug

# Production
bun run build
bun run start
```

Server runs at: **http://localhost:3000**

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run start:dev` | Development server with hot reload |
| `bun run start:debug` | Development server in debug mode |
| `bun run build` | Compile TypeScript for production |
| `bun run start` | Start production server |
| `bun run prisma:generate` | Generate Prisma client from schema |
| `bun run prisma:migrate` | Run database migrations |
| `bun run prisma:studio` | Open Prisma Studio |
| `bun run prisma:seed` | Seed database with sample data |
| `bun run test` | Run unit tests with Jest |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:cov` | Run tests with coverage report |
| `bun run test:e2e` | Run E2E tests |
| `bun run lint` | Run ESLint with auto-fix |
| `bun run format` | Format code with Prettier |

---

## Architecture

### Module Pattern

Each feature module follows a consistent structure:

```
module/
├── module.controller.ts    # HTTP request handlers
├── module.service.ts       # Business logic
├── module.module.ts        # Module definition
└── dto/                    # Data Transfer Objects
    ├── create-*.dto.ts
    └── update-*.dto.ts
```

### Global Guards & Interceptors

| Name | Purpose |
|------|---------|
| **JwtAuthGuard** | Global JWT authentication (applied globally, opt-out with `@Public()`) |
| **RolesGuard** | Role-based authorization |
| **ThrottlerGuard** | Rate limiting |
| **LoggingInterceptor** | Request/response logging |
| **ResponseTransformInterceptor** | Unified `{ success, data, meta }` response format |
| **GlobalExceptionFilter** | Centralized error handling |

### Response Format

All API responses follow a unified structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
}
```

---

## Modules

| Module | Description |
|--------|-------------|
| **Auth** | JWT auth, refresh tokens, role-based access |
| **Users** | User CRUD, profile management |
| **Events** | Event creation, management, publishing, cancellation |
| **Venues** | Venue listings, search, availability, bookings |
| **Services** | Service marketplace, vendor management |
| **Tickets** | Ticket tiers, QR generation, purchase, validation |
| **Payments** | Click & Payme integration, payment history |
| **Volunteers** | Volunteer applications and status management |
| **Reviews** | Reviews and ratings for events, venues, services |
| **Analytics** | Event metrics, sales reports, Excel export |

---

## Database

### Main Entities

| Entity | Description |
|--------|-------------|
| **User** | Accounts with roles (Organizer, Participant, Admin, Vendor, Volunteer) |
| **Event** | Events with status, capacity, dates, locations |
| **Ticket / TicketTier** | QR-coded tickets with pricing tiers |
| **Venue** | Venues with amenities and availability |
| **Service** | Event services with categories |
| **Payment** | Payment records with provider and status |
| **VolunteerApplication** | Volunteer applications for events |
| **Review** | Reviews and ratings |
| **VenueBooking** | Venue reservations |
| **EventService** | Services linked to events |

### Prisma Commands

```bash
# Generate Prisma client
bun run prisma:generate

# Create a new migration
bun exec prisma migrate dev --name <migration-name>

# Reset database (WARNING: deletes all data)
bun exec prisma migrate reset

# Open Prisma Studio
bun run prisma:studio
```

---

## Authentication

### Token Strategy

| Token | Expiry | Storage |
|-------|--------|---------|
| Access Token | 15 minutes | Client memory / Authorization header |
| Refresh Token | 7 days | HTTP-only cookie |

### Auth Flow

```
1. POST /auth/register  →  creates user, returns tokens
2. POST /auth/login     →  returns accessToken + refreshToken (cookie)
3. Protected request    →  Authorization: Bearer <accessToken>
4. POST /auth/refresh   →  (with refreshToken cookie) returns new accessToken
```

### Role-Based Access

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ORGANIZER', 'ADMIN')
@Post()
createEvent(@Body() dto: CreateEventDto) {
  return this.eventsService.create(dto);
}
```

### Available Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access |
| **ORGANIZER** | Create/manage events, view analytics |
| **PARTICIPANT** | Browse events, purchase tickets, leave reviews |
| **VENDOR** | List services, manage bookings |
| **VOLUNTEER** | Apply to events, view applications |

---

## API Documentation

Interactive Swagger UI is available when the server is running:

```
http://localhost:3000/api/docs
```

### Endpoint Overview

| Category | Endpoints |
|----------|-----------|
| **Auth** | `POST /auth/register` • `POST /auth/login` • `POST /auth/refresh` |
| **Users** | `GET /users/profile` • `PATCH /users/profile` |
| **Events** | `GET /events` • `POST /events` • `GET /events/:id` • `PATCH /events/:id` • `DELETE /events/:id` |
| **Venues** | `GET /venues` • `GET /venues/:id` • `POST /venues/bookings` |
| **Services** | `GET /services` • `POST /events/:id/services` |
| **Tickets** | `GET /events/:id/tickets` • `POST /tickets/purchase` • `GET /tickets/:id/qr` |
| **Payments** | `POST /payments/click` • `POST /payments/payme` • `GET /payments/history` |
| **Volunteers** | `POST /events/:id/volunteers` • `GET /volunteers/applications` |
| **Reviews** | `POST /reviews` • `GET /reviews/:entityId` • `PATCH /reviews/:id` |
| **Analytics** | `GET /analytics/events/:id` • `GET /analytics/sales` • `GET /analytics/export` |

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/planner_ai

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Payment Providers
CLICK_SECRET=your-click-merchant-secret
PAYME_KEY=your-payme-merchant-key

# Email (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Testing

```bash
# Run all unit tests
bun run test

# Watch mode
bun run test:watch

# With coverage
bun run test:cov

# E2E tests
bun run test:e2e
```

Tests are located alongside their source files (`*.spec.ts`) and in `test/` for E2E.

---

## Deployment

### Production Build

```bash
bun run build
bun run start
```

### Docker

```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "run", "start"]
```

---

<p align="center">
  Part of <a href="../README.md">Planner AI</a>
</p>
