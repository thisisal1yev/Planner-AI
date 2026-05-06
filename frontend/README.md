# Planner AI — Frontend

React SPA for the Event Organization Marketplace.

[![React](https://img.shields.io/badge/React-v19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-v8-646cff?logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | v19 | UI library |
| TypeScript | v5.9 | Type safety |
| Vite | v8 | Build tool & dev server |
| TailwindCSS | v4 | Styling |
| TanStack Query | v5 | Server state (cache, refetch) |
| Zustand | v5 | Client state (auth) |
| React Router | v7 | Client-side routing |
| React Hook Form | v7 | Form handling |
| Axios | v1 | HTTP client with interceptors |
| shadcn/ui | — | UI component primitives |

---

## Project Structure

```
frontend/
└── src/
    ├── app/
    │   ├── App.tsx                  # Root: QueryClient + BrowserRouter
    │   ├── router/
    │   │   ├── AppRouter.tsx
    │   │   ├── public.routes.tsx
    │   │   └── private.routes.tsx
    │   └── provider/
    │       └── Provider.tsx
    │
    ├── pages/                       # Route-level compositions
    │   ├── home/ events-list/ event-detail/ create-event/ edit-event/
    │   ├── venues-list/ venue-detail/ create-venue/ edit-venue/
    │   ├── services-list/ service-detail/ create-service/ edit-service/
    │   ├── my-events/ my-tickets/ my-venues/ my-services/
    │   ├── organizer-dashboard/ admin-dashboard/ admin-events/ admin-users/ admin-venues/
    │   ├── ticket-detail/ event-participants/ event-services/ event-volunteers/
    │   └── auth/ login/ register/ profile/ about/ blog/ privacy/ terms/
    ├── widgets/                     # Composite UI blocks
    │   └── header/ footer/ app-layout/ auth-layout/ public-layout/ user-layout/
    ├── features/                    # User interactions & forms
    │   └── auth-by-credentials/ auth-register/ event-publish/ review-create/ ticket-purchase/ volunteer-apply/
    │
    ├── entities/                    # Business domain entities
    │   ├── analytics/
    │   ├── event/
    │   ├── review/
    │   ├── service/
    │   ├── ticket/
    │   ├── user/
    │   ├── venue/
    │   └── volunteer/
    │
    └── shared/
        ├── api/
        │   └── client.ts            # Axios instance with interceptors
        ├── model/
        │   └── auth.store.ts        # Zustand auth store (persisted)
        ├── types/
        ├── lib/
        │   └── utils.ts             # cn() utility
        └── ui/
            ├── primitives/          # shadcn-generated components
            └── *.tsx                # Project wrappers
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Bun (recommended)

### Setup

```bash
bun install
echo "VITE_API_URL=http://localhost:3000" > .env
```

Make sure the [backend](../backend/README.md) is running on `http://localhost:3000`.

### Run

```bash
bun run dev
```

App: **http://localhost:5173**

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Dev server with HMR |
| `bun run build` | Production build → `dist/` |
| `bun run preview` | Preview production build (port 4173) |
| `bun run lint` | ESLint |

---

## Architecture (Feature-Sliced Design)

| Layer | Purpose | Can import from |
|-------|---------|-----------------|
| **app** | Init, routing, providers | All layers |
| **pages** | Route-level compositions | widgets, features, entities, shared |
| **widgets** | Composite UI blocks | features, entities, shared |
| **features** | User actions & forms | entities, shared |
| **entities** | Business domain models | shared |
| **shared** | Utilities, API, UI | Nothing |

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

| Library | Use case |
|---------|----------|
| **TanStack Query** | Server state — API data, caching, background refetch |
| **Zustand** | Client state — auth, UI flags |

```typescript
// Server state — TanStack Query v5 (single object arg, isPending not isLoading)
const { isPending, isError, data, error } = useQuery({
  queryKey: ['events'],
  queryFn: eventsApi.list,
  staleTime: 5 * 60 * 1000, // fresh for 5 min
  gcTime: 10 * 60 * 1000,   // cache kept for 10 min (was cacheTime in v4)
})

const mutation = useMutation({
  mutationFn: eventsApi.create,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
})
```

```typescript
// Client state — Zustand v5 with persist middleware
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',                        // localStorage key
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

// Usage in components
const { user, isAuthenticated, login, logout } = useAuthStore()
```

---

## API Integration

`shared/api/client.ts` — Axios instance with:
- Base URL from `VITE_API_URL`
- Request interceptor → attaches `Authorization: Bearer <token>`
- Response interceptor → handles 401 + token refresh

```typescript
import { apiClient } from '@shared/api/client'

const { data } = await apiClient.get('/events')
```

Each entity owns its API calls and types:

```
entities/event/
├── api/eventsApi.ts   # typed CRUD methods (list, get, create, update…)
├── model/types.ts     # Event, TicketTier interfaces
├── model/constants.ts # EVENT_STATUS_COLOR, EVENT_STATUS_LABEL
├── ui/EventCard.tsx   # presentational cards
└── index.ts           # public barrel exports
```

React Router v7 — imports from `"react-router"` (not `"react-router-dom"`):

```typescript
import { createBrowserRouter, Link, useNavigate, useParams } from 'react-router'

const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/events/:id', Component: EventDetailPage },
])
```

---

## Styling

**TailwindCSS v4** via `@tailwindcss/vite` plugin — no `tailwind.config.ts` needed.

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })
```

**shadcn/ui** — primitives in `src/shared/ui/primitives/`, project wrappers in `src/shared/ui/`.

```bash
# Add a new shadcn component
bunx shadcn@latest add <component>
```

```typescript
import { cn } from '@shared/lib/utils'
<div className={cn('base', condition && 'extra')} />
```

**tsconfig.json** — required Vite + React settings:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "strict": true,
    "noEmit": true
  }
}
```

---

## Environment Variables

```env
VITE_API_URL=http://localhost:3000
VITE_IMGBB_UPLOAD_URL=https://api.imgbb.com/1/upload
VITE_IMGBB_API_KEY=your-imgbb-api-key
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL |
| `VITE_IMGBB_UPLOAD_URL` | imgbb upload endpoint |
| `VITE_IMGBB_API_KEY` | imgbb API key — get one free at [imgbb.com](https://api.imgbb.com/) |

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Deployment

### Production Build

```bash
bun run build    # output: dist/
bun run preview  # preview at http://localhost:4173
```

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
