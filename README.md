# Planner AI

**Event Organization Marketplace for Uzbekistan**

A full-stack platform connecting event organizers with venues, service providers, and participants. Covers the full event lifecycle — from planning and ticketing to payment processing and analytics.

![NestJS](https://img.shields.io/badge/NestJS-v11-ea2845?logo=nestjs)
![React](https://img.shields.io/badge/React-v19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178c6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-v7.8-2d3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17+-4169e1?logo=postgresql)

---

## What it does

| Area | Capabilities |
|------|-------------|
| **Events** | Create, publish, edit, cancel · Category-based classification · VIP / Standard / Free ticket tiers · Capacity tracking · Analytics |
| **Venues** | Search by category and characteristics · Real-time availability · Bookings · Boost promotions · Quality badges |
| **Services** | Vendor marketplace · Category-based · Service badges · Boost promotions |
| **Tickets** | QR code generation · Mobile validation · Tiered pricing · Purchase history |
| **Payments** | Click integration · Payme integration · Payment history |
| **Users** | Roles: Organizer, Participant, Admin, Vendor, Volunteer · JWT auth · Profile management |
| **Reviews** | Rate events, venues, services · Verified participant reviews · Pre-aggregated rating stats |
| **Analytics** | Ticket sales · Revenue tracking · Excel export |
| **Boosts** | Paid promotion for venues and services |
| **Badges** | Quality and achievement badges for venues and services |

---

## Tech Stack

### Backend
- **NestJS v11** — framework
- **Prisma v7.8** — ORM
- **PostgreSQL 17+** — database
- **Passport + JWT + Google OAuth 2.0** — authentication
- **Click / Payme** — payment providers
- **Swagger** — API docs

### Frontend
- **React v19** + **TypeScript v5.9**
- **Vite v8** — build tool
- **TailwindCSS v4** — styling
- **TanStack Query v5** — server state
- **Zustand v5** — client state
- **React Router v7** — routing
- **React Hook Form v7** — forms
- **Axios v1** — HTTP client
- **Lucide React** — icons
- **Recharts v3.8** — data visualization
- **shadcn/ui** — UI primitives

---

## Project Structure

```
planner-ai/
├── backend/          # NestJS API → see backend/README.md
│   ├── src/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── events/
│   │   ├── payments/
│   │   ├── reviews/
│   │   ├── services/
│   │   ├── tickets/
│   │   ├── users/
│   │   ├── venues/
│   │   └── volunteers/
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
│
└── frontend/         # React SPA → see frontend/README.md
    └── src/
        ├── app/
        ├── pages/
        ├── widgets/
        ├── features/
        ├── entities/
        └── shared/
```

---

## Quick Start

### Prerequisites

- Node.js v18+
- PostgreSQL v17+
- Bun (recommended) or npm

### Setup

```bash
# 1. Clone
git clone <repository-url>
cd planner-ai

# 2. Backend
cd backend
bun install
cp .env.example .env   # fill in your values
bun run prisma:generate
bun run prisma:migrate
bun run prisma:seed    # optional

# 3. Frontend
cd ../frontend
bun install
cp .env.example .env   # fill in VITE_API_URL, VITE_IMGBB_UPLOAD_URL, VITE_IMGBB_API_KEY
```

### Run

```bash
# Terminal 1 — API
cd backend && bun run start:dev

# Terminal 2 — UI
cd frontend && bun run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Swagger | http://localhost:3000/api/docs |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/planner_ai` |
| `JWT_SECRET` | Access token secret (32+ chars) | — |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | — |
| `JWT_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `CLICK_SECRET` | Click payment secret | — |
| `PAYME_KEY` | Payme payment key | — |
| `MAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USER` | Sender email | — |
| `MAIL_PASSWORD` | Email app password | — |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL |
| `VITE_IMGBB_UPLOAD_URL` | imgbb upload endpoint (`https://api.imgbb.com/1/upload`) |
| `VITE_IMGBB_API_KEY` | imgbb API key for image uploads |

---

## Docker Deployment (VPS)

### Architecture

```
VPS port :80  (nginx inside frontend container)
  /           →  React SPA (static files)
  /api/*      →  NestJS backend (internal Docker network, not exposed)
  /api/docs   →  Swagger UI

Docker internal network:
  frontend:80   ←  only port exposed to host
  backend:3000  ←  internal only
  db:5432       ←  internal only, persistent volume
```

### Prerequisites

- Docker v24+
- Docker Compose v2+ (`docker compose` not `docker-compose`)

### Setup

```bash
# 1. Copy the env template and fill in your secrets
cp .env.docker.example .env.docker
# Edit .env.docker — at minimum set:
#   POSTGRES_PASSWORD, JWT_SECRET, JWT_REFRESH_SECRET,
#   CORS_URL (your domain), VITE_IMGBB_API_KEY

# 2. Build images and start all services
docker compose --env-file .env.docker up -d --build

# 3. Check everything is running
docker compose ps
docker compose logs backend -f
```

App is available at `http://your-server-ip` or your domain.

### Services

| Service | Internal port | Exposed to host |
|---------|--------------|-----------------|
| Frontend (nginx) | 80 | :80 |
| Backend (NestJS) | 3000 | — |
| Database (PostgreSQL) | 5432 | — |
| Swagger UI | — | `/api/docs` |

### Common Commands

```bash
# Rebuild & restart after code changes
docker compose --env-file .env.docker up -d --build

# View logs
docker compose logs backend -f
docker compose logs frontend -f

# Shell into a container
docker compose exec backend sh

# Stop everything
docker compose --env-file .env.docker down

# Stop and delete DB data (full reset)
docker compose --env-file .env.docker down -v
```

### HTTPS / SSL

To enable HTTPS, install Nginx and Certbot on the **host** machine and reverse-proxy to `localhost:80`. Alternatively, put the server behind Cloudflare (free SSL proxy).

---

## Role-Based Access

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, all analytics |
| **Organizer** | Create/manage events, view analytics |
| **Participant** | Browse, purchase tickets, leave reviews |
| **Vendor** | List services, manage bookings |
| **Volunteer** | Apply to events, track status |

---

<p align="center">
  <a href="backend/README.md">Backend</a> ·
  <a href="frontend/README.md">Frontend</a>
</p>
