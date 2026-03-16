# Planner AI

> **Event Organization Marketplace for Uzbekistan**

A full-stack platform for organizing events, booking venues, hiring services, managing tickets, and processing payments.

![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)
![NestJS](https://img.shields.io/badge/NestJS-v11-ea2845?logo=nestjs)
![React](https://img.shields.io/badge/React-v19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178c6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-v7.5-2d3748?logo=prisma)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)

---

## Overview

**Planner AI** is a marketplace that connects event organizers with venues, service providers, and participants in Uzbekistan. The platform covers the entire event lifecycle — from planning and booking to ticketing and payment processing.

**Key capabilities:**
- Create and manage events with multiple ticket tiers
- Search and book venues with advanced filtering
- Hire event services (catering, decoration, photography, etc.)
- Generate QR-coded digital tickets
- Process payments via Click and Payme
- Manage volunteer applications
- Collect reviews and ratings
- Access detailed analytics and reports

---

## Features

| Category | Features |
|----------|----------|
| **Events** | Create, publish, edit, cancel • VIP / Standard / Free ticket tiers • Capacity management • Event analytics |
| **Venues** | Filter search (indoor/outdoor, Wi-Fi, parking, stage) • Real-time availability • Booking management |
| **Services** | Vendor marketplace • Categories (catering, decoration, sound, photography, security) • Vendor ratings |
| **Tickets** | QR code generation • Mobile ticket validation • Tiered pricing • Purchase history |
| **Payments** | Click integration • Payme integration • Payment history and receipts |
| **Users** | Role-based access (Organizer, Participant, Admin, Vendor, Volunteer) • Profile management • JWT auth |
| **Reviews** | Rate events, venues, and services • Verified participant reviews |
| **Volunteers** | Apply for positions • Track application status |
| **Analytics** | Performance metrics • Ticket sales reports • Revenue tracking • Excel export |

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| [NestJS](https://nestjs.com/) | v11 | Backend framework |
| [TypeScript](https://www.typescriptlang.org/) | v5.9 | Type-safe development |
| [Prisma](https://www.prisma.io/) | v7.5 | Database ORM |
| [PostgreSQL](https://www.postgresql.org/) | 14+ | Relational database |
| [Passport + JWT](https://www.passportjs.org/) | — | Authentication |
| [Swagger](https://swagger.io/) | — | API documentation |
| [Nodemailer](https://nodemailer.com/) | v8 | Email delivery |
| [Multer](https://github.com/expressjs/multer) | v2 | File upload |
| [ExcelJS](https://github.com/exceljs/exceljs) | v4 | Excel report generation |
| [QRCode](https://github.com/soldair/node-qrcode) | v1.5 | QR code generation |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | v6 | Password hashing |
| [cache-manager](https://github.com/node-cache/node-cache) | v7 | Response caching |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | v19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | v5.9 | Type safety |
| [Vite](https://vite.dev/) | v8 | Build tool & dev server |
| [TailwindCSS](https://tailwindcss.com/) | v4 | Utility-first CSS |
| [TanStack Query](https://tanstack.com/query) | v5 | Server state management |
| [Zustand](https://zustand-demo.pmnd.rs/) | v5 | Client state management |
| [React Router](https://reactrouter.com/) | v7 | Client-side routing |
| [React Hook Form](https://react-hook-form.com/) | v7 | Form handling |
| [Axios](https://axios-http.com/) | v1 | HTTP client |
| [shadcn/ui](https://ui.shadcn.com/) | — | UI component primitives |

---

## Project Structure

```
planner-ai/
├── backend/
│   ├── src/
│   │   ├── analytics/          # Analytics and reporting
│   │   ├── auth/               # JWT authentication & guards
│   │   ├── common/             # Shared utilities, filters, interceptors
│   │   ├── config/             # Environment configuration
│   │   ├── events/             # Event CRUD & management
│   │   ├── payments/           # Click & Payme integrations
│   │   ├── prisma/             # Prisma service
│   │   ├── reviews/            # Review & rating system
│   │   ├── services/           # Service marketplace
│   │   ├── tickets/            # Ticketing & QR codes
│   │   ├── users/              # User management
│   │   ├── venues/             # Venue listings & bookings
│   │   ├── volunteers/         # Volunteer applications
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── generated/              # Generated Prisma client
│   ├── test/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                # App init, routing, providers
│   │   ├── pages/              # Page components (route level)
│   │   ├── widgets/            # Composite blocks (Header, Layouts)
│   │   ├── features/           # User-facing interactions & forms
│   │   ├── entities/           # Business entities (event, user, venue...)
│   │   └── shared/             # Shared UI, API client, types, utilities
│   ├── public/
│   ├── index.html
│   └── vite.config.ts
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher
- **Bun** (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd planner-ai
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   bun install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   bun install
   ```

### Environment Setup

```bash
# Backend — copy the template and fill in your values
cd backend
cp .env.example .env

# Frontend — set the API base URL
cd ../frontend
echo "VITE_API_URL=http://localhost:3000" > .env
```

### Database Setup

```bash
cd backend

# Generate Prisma client
bun run prisma:generate

# Run migrations
bun run prisma:migrate

# (Optional) Seed with sample data
bun run prisma:seed
```

### Running the App

Start both servers in separate terminals:

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd backend
bun run start:dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
bun run dev
```

**Access points:**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)
- Swagger docs: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/planner_ai` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) | `your-refresh-secret` |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `CLICK_SECRET` | Click payment API secret | `your-click-secret` |
| `PAYME_KEY` | Payme payment API key | `your-payme-key` |
| `MAIL_HOST` | SMTP server host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USER` | Sender email address | `your@gmail.com` |
| `MAIL_PASSWORD` | Email app password | `your-app-password` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Runtime environment | `development` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

---

## Available Scripts

### Backend

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

### Frontend

| Command | Description |
|---------|-------------|
| `bun run dev` | Development server with HMR |
| `bun run build` | Production build |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint |

---

## Database

### Main Entities

| Entity | Description |
|--------|-------------|
| **User** | Accounts with roles (Organizer, Participant, Admin, Vendor, Volunteer) |
| **Event** | Events with status, capacity, dates, and locations |
| **Ticket / TicketTier** | QR-coded tickets with pricing tiers (VIP, Standard, Free) |
| **Venue** | Venues with amenities (Wi-Fi, parking, sound, stage, indoor/outdoor) |
| **Service** | Event services (catering, decoration, sound, photography, security) |
| **Payment** | Payment records with provider (Click / Payme) and status |
| **VolunteerApplication** | Volunteer applications linked to events |
| **Review** | Reviews and ratings for events, venues, and services |
| **VenueBooking** | Venue reservations linked to events |
| **EventService** | Services associated with events |

### Useful Prisma Commands

```bash
cd backend

# Create a new migration
bun exec prisma migrate dev --name <migration-name>

# Reset database (WARNING: deletes all data)
bun exec prisma migrate reset

# Open visual database browser
bun run prisma:studio
```

---

## API Documentation

Start the backend server and open the interactive Swagger UI at:

```
http://localhost:3000/api/docs
```

### Endpoint Overview

| Category | Endpoints |
|----------|-----------|
| **Auth** | `POST /auth/register` • `POST /auth/login` • `POST /auth/refresh` |
| **Users** | `GET /users/profile` • `PATCH /users/profile` • `GET /users/events` |
| **Events** | `GET /events` • `POST /events` • `GET /events/:id` • `PATCH /events/:id` • `DELETE /events/:id` |
| **Venues** | `GET /venues` • `GET /venues/:id` • `POST /venues/bookings` |
| **Services** | `GET /services` • `GET /services/:id` • `POST /events/:id/services` |
| **Tickets** | `GET /events/:id/tickets` • `POST /tickets/purchase` • `GET /tickets/:id/qr` |
| **Payments** | `POST /payments/click` • `POST /payments/payme` • `GET /payments/history` |
| **Volunteers** | `POST /events/:id/volunteers` • `GET /volunteers/applications` |
| **Reviews** | `POST /reviews` • `GET /reviews/:entityId` • `PATCH /reviews/:id` |
| **Analytics** | `GET /analytics/events/:id` • `GET /analytics/sales` • `GET /analytics/export` |

---

## Architecture

### Backend

```
Client Requests
      │
      ▼
Global Middleware Layer
(JwtAuthGuard, RolesGuard, ThrottlerGuard,
 LoggingInterceptor, ResponseTransformInterceptor,
 GlobalExceptionFilter)
      │
      ▼
Feature Modules
(Auth, Events, Venues, Services, Tickets,
 Payments, Users, Reviews, Volunteers, Analytics)
      │
      ▼
  Prisma ORM
      │
      ▼
PostgreSQL Database
```

### Frontend (Feature-Sliced Design)

```
src/
├── app/       — App initialization, routing, providers
├── pages/     — Page compositions (route level)
├── widgets/   — Composite UI blocks (Header, Layouts)
├── features/  — User interactions (forms, actions)
├── entities/  — Business domain entities
└── shared/    — Reusable UI, API client, types, utilities
```

**Rule:** lower layers cannot import from higher layers.

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, all analytics |
| **Organizer** | Create/manage events, view analytics, manage tickets |
| **Participant** | Browse events, purchase tickets, leave reviews |
| **Vendor** | List services, manage bookings |
| **Volunteer** | Apply to events, track application status |

---

<p align="center">
  Built with
  <a href="https://nestjs.com/">NestJS</a> ·
  <a href="https://prisma.io/">Prisma</a> ·
  <a href="https://react.dev/">React</a> ·
  <a href="https://vite.dev/">Vite</a>
</p>
