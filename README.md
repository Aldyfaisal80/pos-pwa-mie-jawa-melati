# Post PWA — Point of Sales Offline-First PWA

A modern, offline-first Point of Sales (POS) application built as a Progressive Web App (PWA) using the [T3 Stack](https://create.t3.gg/).

Process orders offline, sync automatically when back online, and manage your business from any device.

---

## 🚀 Key Features

- **Authentication** — Supabase Auth with email/password login, server-side session via middleware, and client-side auth guard
- **Offline-First Cashier** — Process orders, manage cart with editable quantity input, and complete transactions without internet
- **Resilient Background Sync** — Offline transactions queue in IndexedDB; auto-sync via lifecycle-independent vanilla tRPC client
- **Bluetooth Receipt Printing** — Web Bluetooth API integration with auto-reconnect on page load; supports 58mm thermal printers
- **PWA Ready** — Installable on Desktop, iOS, and Android with full offline caching (Serwist)
- **Product Management** — CRUD with categories (inline edit/delete), image upload (Supabase Storage), and soft delete
- **Transaction Reports** — Filterable, sortable, paginated reports with CSV export
- **Dashboard Analytics** — Today's revenue, transaction count, top products chart
- **Store Settings** — Configurable store name, address, phone, logo + Account Profile (display name & email)
- **Responsive UI** — Mobile-first with bottom sheet drawers (Vaul) and dark mode support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| API & Type Safety | [tRPC 11](https://trpc.io) + [Zod 4](https://zod.dev) |
| Database ORM | [Prisma 7](https://prisma.io) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [Shadcn UI](https://ui.shadcn.com/) |
| PWA Engine | [Serwist](https://serwist.build/) |
| Data Fetching | [TanStack React Query 5](https://tanstack.com/query/latest) |
| Charts | [Recharts](https://recharts.org) |
| Mobile UX | [Vaul](https://vaul.emilkowal.ski/) (Drawer) |

---

## 📦 Getting Started

### Prerequisites

- Node.js v20+
- npm v11+
- A [Supabase](https://supabase.com/) project (for Auth + Database + Storage)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd post-pwa

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your Supabase URL, anon key, and database connection string

# 4. Push database schema
npm run db:push

# 5. (Optional) Seed sample data
npm run db:seed:local

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to **`/login`** — sign in with your Supabase credentials.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |

---

## 📁 Project Structure

```
post-pwa/
├── src/
│   ├── app/
│   │   ├── (app)/          # Protected route group — requires auth
│   │   │   ├── layout.tsx  #   Client-side auth guard + AppProvider
│   │   │   ├── page.tsx    #   Dashboard redirect
│   │   │   ├── pos/        #   POS Cashier
│   │   │   ├── products/   #   Product management
│   │   │   ├── reports/    #   Transaction reports
│   │   │   └── settings/   #   Store & account settings
│   │   ├── (auth)/         # Public route group (unauthenticated)
│   │   │   ├── layout.tsx
│   │   │   └── login/
│   │   └── api/trpc/       # tRPC HTTP handler
│   ├── components/         # Shared UI (elements, form, fragments, icons, ui)
│   ├── features/           # Feature modules
│   │   ├── auth/           #   Supabase auth (context, hooks, providers, schemas)
│   │   ├── cashier/        #   POS cashier (checkout/, receipt/)
│   │   ├── dashboard/      #   Analytics & charts
│   │   ├── product/        #   Product management (product/, category/)
│   │   ├── report/         #   Reports (analytics/, transaction/)
│   │   └── store-settings/ #   Store config + AccountProfileForm
│   ├── hooks/              # Global custom hooks (useOfflineSync)
│   ├── lib/                # Utilities (offline-db, supabase, timezone)
│   ├── server/             # Backend (tRPC routers, validations, services)
│   ├── styles/             # Global CSS
│   └── trpc/               # Client tRPC setup + vanilla-client.ts
├── prisma/                 # Database schema & migrations
├── tests/                  # Playwright E2E tests
└── docs/                   # Project documentation
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run preview` | Build + start combined |
| `npm run check` | Lint + typecheck combined |
| `npm run clean:cache` | Delete `.next/` build cache |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run typecheck` | TypeScript type checking |
| `npm run format:check` | Check Prettier formatting |
| `npm run format:write` | Auto-format with Prettier |
| `npm run safe-audit` | Run `npm audit` (read-only) |
| `npm run safe-audit:fix` | Safe: clear cache → audit fix → restart dev |
| `npm run test:blackbox` | Run Playwright E2E tests |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:push:local` | Push to local dev DB |
| `npm run db:push:prod` | Push to production DB |
| `npm run db:reset:local` | Reset + re-seed local DB |
| `npm run db:seed:local` | Seed local database |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## 📱 PWA Features Validation

To test the PWA capabilities and offline-first functionality:

### Step 1: Build for Production

PWA service workers only run in production mode:

```bash
npm run build
npm run start
```

### Step 2: Install the App

1. Open `http://localhost:3000` in Chrome/Edge
2. Click the **Install App** icon in the URL bar
3. Open the installed PWA from your desktop shortcut

### Step 3: Test Offline Mode

1. Open DevTools (F12) → **Application** → **Service Workers** → check **Offline**
2. Notice the UI adapts (offline indicator appears)
3. Add items to cart and process a transaction
4. The transaction saves to IndexedDB — pending sync counter goes up
5. Refresh the page — app loads normally from cache

### Step 4: Sync to Cloud

1. Uncheck **Offline** in DevTools (or restore Wi-Fi)
2. Watch automatic sync — pending queue synchronizes to Supabase
3. Check the **Report** page to see synced data

---

## 🪟 Windows Development Notes

> **Windows users only** — Linux/macOS do not have this limitation.

### ⚠️ EPERM Error When Updating Dependencies

Windows uses mandatory file locking. Running `npm install`, `npm audit fix`, or `npm update` **while the dev server is active** can cause:

```
Error: EPERM: operation not permitted, rename
.next\dev\server\*.tmp.xxx → .next\dev\server\*.js
```

**Safe way to update dependencies:**

```bash
# Option A: Use the built-in safe script (recommended)
npm run safe-audit:fix
# This: clears cache → runs audit fix → restarts dev server

# Option B: Manual steps
# 1. Stop dev server (Ctrl+C in the terminal running npm run dev)
# 2. Run your npm command
npm audit fix
# 3. Clear cache (if you see any errors)
npm run clean:cache
# 4. Restart
npm run dev
```

**If you already hit the EPERM error:**

```bash
# The server usually auto-restarts. If not:
npm run clean:cache && npm run dev
```

---

## 🧪 Blackbox Testing

This project includes a comprehensive manual blackbox testing suite — **104 test cases** covering all
7 functional modules, validated using Equivalence Partitioning and Boundary Value Analysis methods.

**Pass Rate: 100% (104/104 TC)** — See [`docs/PENGUJIAN-BLACKBOX.md`](./docs/PENGUJIAN-BLACKBOX.md) for full results.

### Running Automated Tests

```bash
npm run test:blackbox
```

### Manual Blackbox Test Coverage

| Module | Code | Test Cases | Pass Rate |
|--------|------|------------|-----------|
| Authentication | F-01 | 10 | 100% |
| Home Hub (Beranda) | F-02 | 9 | 100% |
| Analytics Dashboard | F-03 | 7 | 100% |
| Cashier — Cart | F-04a | 12 | 100% |
| Cashier — Checkout & Offline | F-04b | 14 | 100% |
| Product Management | F-05 | 17 | 100% |
| Reports | F-06 | 11 | 100% |
| Settings | F-07 | 24 | 100% |
| **Total** | — | **104** | **100%** |

### Playwright E2E Test Files

| File | Description |
|---|---|
| `tests/blackbox/pos-blackbox.spec.ts` | Core scenarios (cashier, products, reports, settings) |
| `tests/blackbox/pos-navigation.spec.ts` | Sidebar navigation flows |
| `tests/blackbox/pos-mobile.spec.ts` | Mobile viewport layout and interactions |
| `tests/blackbox/pos-admin.spec.ts` | Admin operations (store config, product master data) |
| `tests/blackbox/pos-edge-cases.spec.ts` | Edge cases: empty cart, long inputs, boundary values |
| `tests/blackbox/pos-a11y.spec.ts` | Automated accessibility scan (axe-core) |
| `tests/blackbox/pos-reports.spec.ts` | Filter, sort, export, and delete reports |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](./docs/ARCHITECTURE.md) | System overview, data flow, design decisions |
| [API Reference](./docs/API.md) | All tRPC procedures with input/output schemas |
| [Database Schema](./docs/DATABASE.md) | ER diagram, model reference, indexes |
| [UML Diagrams](./docs/UML.md) | Use Case, Class, Component, Activity diagrams |
| [Changelog](./CHANGELOG.md) | Version history (Keep a Changelog) |
| [Contributing](./CONTRIBUTING.md) | Development setup & contribution guide |

---

## 📝 License

This project is open-sourced under the MIT License.
