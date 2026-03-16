# Planner AI — Frontend

> React frontend for the Event Organization Marketplace

[![React](https://img.shields.io/badge/React-v19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-v8-646cff?logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Environment Variables](#environment-variables)
- [Build & Deployment](#build--deployment)

---

## Overview

The frontend for **Planner AI** — an event organization marketplace in Uzbekistan. Built with React 19, TypeScript, and Vite, it provides a modern, type-safe UI for:

- Browsing and creating events
- Searching and booking venues
- Purchasing and managing tickets
- Hiring event services
- Processing payments
- Managing user profiles and applications

---

## Tech Stack

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
| [Axios](https://axios-http.com/) | v1 | HTTP client with interceptors |
| [shadcn/ui](https://ui.shadcn.com/) | — | UI component primitives |

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx                  # QueryClient + BrowserRouter root
│   │   ├── router/
│   │   │   ├── AppRouter.tsx        # Routes + Route definitions
│   │   │   ├── public.routes.tsx    # Public route configs
│   │   │   └── private.routes.tsx   # Protected route configs
│   │   └── provider/
│   │       └── Provider.tsx         # App-level providers
│   │
│   ├── pages/                       # Page compositions (route level)
│   │   ├── HomePage/
│   │   ├── EventsPage/
│   │   ├── VenuePage/
│   │   ├── ProfilePage/
│   │   └── ...
│   │
│   ├── widgets/                     # Composite UI blocks
│   │   ├── Header/
│   │   ├── PublicLayout/
│   │   ├── DashboardLayout/
│   │   ├── AuthLayout/
│   │   └── ...
│   │
│   ├── features/                    # User interactions & actions
│   │   ├── LoginForm/
│   │   ├── RegisterForm/
│   │   ├── PublishEventButton/
│   │   ├── PurchaseTicketForm/
│   │   └── ...
│   │
│   ├── entities/                    # Business domain entities
│   │   ├── event/
│   │   ├── user/
│   │   ├── venue/
│   │   ├── ticket/
│   │   ├── service/
│   │   ├── review/
│   │   ├── analytics/
│   │   └── volunteer/
│   │
│   ├── shared/                      # Reusable utilities
│   │   ├── api/
│   │   │   └── client.ts            # Axios instance with interceptors
│   │   ├── model/
│   │   │   └── auth.store.ts        # Zustand auth store (localStorage persist)
│   │   ├── types/                   # Global TypeScript types
│   │   ├── lib/
│   │   │   └── utils.ts             # cn() and shared utilities
│   │   └── ui/
│   │       ├── primitives/          # shadcn-generated components
│   │       │   ├── button.tsx
│   │       │   ├── input.tsx
│   │       │   ├── dialog.tsx
│   │       │   └── badge.tsx
│   │       ├── Button.tsx           # Project wrappers around primitives
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Badge.tsx
│   │       └── Select.tsx
│   │
│   ├── index.css                    # Global styles & TailwindCSS import
│   ├── main.tsx                     # React entry point
│   └── App.tsx                      # Root component
│
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── components.json                  # shadcn/ui config
└── eslint.config.js
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **Bun** (recommended) or npm

### Installation

```bash
# From the project root
cd frontend
bun install
```

### Environment Setup

```bash
# Create a .env file
echo "VITE_API_URL=http://localhost:3000" > .env
```

Make sure the [backend](../backend/README.md) is running on `http://localhost:3000`.

### Start Development Server

```bash
bun run dev
```

App available at: **http://localhost:5173**

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with Hot Module Replacement |
| `bun run build` | Production build (outputs to `dist/`) |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint |

---

## Architecture

This project follows **Feature-Sliced Design (FSD)** — a methodology for organizing large React applications into well-defined, isolated layers.

### Layer Overview

| Layer | Purpose | Can import from |
|-------|---------|-----------------|
| **app** | App init, routing, global providers | All layers |
| **pages** | Page-level compositions | widgets, features, entities, shared |
| **widgets** | Composite UI blocks | features, entities, shared |
| **features** | User actions & interactions | entities, shared |
| **entities** | Business domain models | shared |
| **shared** | Reusable utilities, UI, API | Nothing |

**Rule:** lower layers cannot import from higher layers.

### Path Aliases

| Alias | Resolves to |
|-------|-------------|
| `@/*` | `src/*` |
| `@shared/*` | `src/shared/*` |
| `@entities/*` | `src/entities/*` |
| `@features/*` | `src/features/*` |
| `@widgets/*` | `src/widgets/*` |
| `@pages/*` | `src/pages/*` |
| `@app/*` | `src/app/*` |

---

## State Management

The app uses a **dual state management** approach:

| Library | Use Case | Location |
|---------|----------|----------|
| **TanStack Query** | Server state (API data, caching, refetching) | `entities/*/api/` |
| **Zustand** | Client state (auth, UI state) | `shared/model/` |

### TanStack Query — Server State

```typescript
import { useQuery } from '@tanstack/react-query'
import { eventApi } from '@entities/event/api'

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventApi.getAll,
  })
}
```

### Zustand — Auth Store

The auth store is persisted to `localStorage` automatically.

```typescript
import { useAuthStore } from '@shared/model/auth.store'

const { user, isAuthenticated, login, logout } = useAuthStore()
```

---

## API Integration

### Axios Client

The HTTP client is configured in `shared/api/client.ts` with:
- Base URL from `VITE_API_URL`
- Request interceptor that attaches the JWT `Authorization` header
- Response interceptor for handling 401 errors and token refresh

```typescript
import { apiClient } from '@shared/api/client'

// All requests automatically include the Bearer token
const response = await apiClient.get('/events')
```

### Entity API Pattern

Each entity encapsulates its own API calls:

```
entities/event/
├── api/
│   └── event.api.ts     # API functions (getAll, getById, create...)
├── model/
│   ├── types.ts         # TypeScript types
│   └── event.queries.ts # TanStack Query hooks
└── ui/
    └── EventCard.tsx    # Entity UI components
```

---

## Styling

### TailwindCSS v4

This project uses TailwindCSS v4 via the `@tailwindcss/vite` plugin — no `tailwind.config.ts` needed.

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

### shadcn/ui

UI primitives are installed via shadcn and live in `src/shared/ui/primitives/`. Project-level wrappers with our API sit in `src/shared/ui/`.

```bash
# Add a new shadcn component
bunx shadcn@latest add <component>
```

The `cn()` utility is available at `@shared/lib/utils`:

```typescript
import { cn } from '@shared/lib/utils'

<div className={cn('base-class', condition && 'conditional-class')} />
```

---

## Environment Variables

```env
# Backend API base URL (required)
VITE_API_URL=http://localhost:3000
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Build & Deployment

### Production Build

```bash
bun run build
# Output: dist/
```

### Preview

```bash
bun run preview
# Runs at http://localhost:4173
```

### Deployment Options

| Platform | Method |
|----------|--------|
| **Vercel** | Automatic deploy from Git |
| **Netlify** | Git integration or drag & drop |
| **Nginx** | Serve the `dist/` folder as static files |
| **Docker** | Multi-stage Dockerfile (see below) |

### Docker

```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

<p align="center">
  Part of <a href="../README.md">Planner AI</a>
</p>
