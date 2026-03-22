# Post PWA — Point of Sales Offline-First PWA

A modern, offline-first Point of Sales (POS) application built as a Progressive Web App (PWA) using the [T3 Stack](https://create.t3.gg/).

Process orders offline, sync automatically when back online, and manage your business from any device.

---

## 🚀 Key Features

- **Offline-First Cashier** — Process orders, manage cart, and complete transactions without internet
- **Background Sync** — Offline transactions queue in IndexedDB and auto-sync to Supabase
- **PWA Ready** — Installable on Desktop, iOS, and Android with full offline caching (Serwist)
- **Product Management** — CRUD with categories, image upload (Supabase Storage), and soft delete
- **Transaction Reports** — Filterable, sortable, paginated reports with CSV export
- **Dashboard Analytics** — Today's revenue, transaction count, top products chart
- **Store Settings** — Configurable store name, address, phone, and logo
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
- A Supabase project or local PostgreSQL instance

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd post-pwa

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env → set DATABASE_URL to your PostgreSQL connection string

# 4. Push database schema
npm run db:push

# 5. (Optional) Seed sample data
npm run db:seed:local

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
post-pwa/
├── src/
│   ├── app/                # Next.js App Router (routes & API)
│   ├── components/         # Shared UI (elements, form, fragments, icons, ui)
│   ├── features/           # Feature modules
│   │   ├── cashier/        #   POS cashier (cart, checkout, receipt)
│   │   ├── dashboard/      #   Analytics & charts
│   │   ├── product/        #   Product & category management
│   │   ├── report/         #   Transaction reports & export
│   │   └── storeSettings/  #   Store configuration
│   ├── hooks/              # Global custom hooks
│   ├── lib/                # Utilities (offline-db, formatting)
│   ├── server/             # Backend (tRPC routers, validations, services)
│   ├── styles/             # Global CSS
│   └── trpc/               # Client tRPC setup
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
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run typecheck` | TypeScript type checking |
| `npm run format:check` | Check Prettier formatting |
| `npm run format:write` | Auto-format with Prettier |
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
