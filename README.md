# Post PWA (Point of Sales Offline-First PWA)

A modern, offline-first Point of Sales (POS) application built as a Progressive Web App (PWA) using the powerful [T3 Stack](https://create.t3.gg/).

This application is designed to function seamlessly even without an internet connection, automatically queuing transactions in the browser's IndexedDB and syncing them to the backend server (Supabase) once the connection is restored.

## 🚀 Key Features

- **Offline-First Cashier System**: Process orders and add products to the cart even when completely offline.
- **Background Syncing**: Transactions made offline are automatically synchronized to the server when the device comes back online.
- **PWA Ready**: Installable on Desktop, iOS, and Android. Works like a native application with icon and offline caching support (via Serwist).
- **Responsive UI/UX**: Beautifully designed utilizing Tailwind CSS and Shadcn UI.
- **Data Persistence**: Uses IndexedDB for local caching and PostgreSQL (via Supabase) for remote database storage.

## 🛠️ Tech Stack

This project is built using modern, type-safe web technologies:

- **Framework**: [Next.js (App Router)](https://nextjs.org) (v15+)
- **API & Type Safety**: [tRPC](https://trpc.io) & [Zod](https://zod.dev)
- **Database ORM**: [Prisma](https://prisma.io)
- **Database Provider**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) & [Shadcn UI](https://ui.shadcn.com/)
- **PWA Engine**: [Serwist](https://serwist.build/) (Service Worker Toolkit)
- **State Management & Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)

## 📦 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or pnpm
- A Supabase project (or local PostgreSQL instance)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd post-pwa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env` and fill in your Supabase connection strings:
   ```bash
   cp .env.example .env
   ```
   *Note: Update `DATABASE_URL` and `DIRECT_URL` (if using Supabase) in your `.env` file.*

4. Setup Database Schema:
   ```bash
   npm run db:push
   ```
   *(Optional)* Run the seed script to populate initial dummy data:
   ```bash
   npm run prisma:seed
   ```

5. Run the Development Server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 PWA Features Validation Tutorial

To personally test the PWA capabilities and see the offline-first functionality in action, follow these steps:

### Step 1: Prep the Production Build
PWA service workers only run optimally in production mode.
```bash
npm run build
npm run start
```

### Step 2: Open and Install
1. Open your browser (Chrome/Edge) and go to `http://localhost:3000`.
2. Look at the right side of the URL address bar and click the **Install App** icon to install it as a standalone Desktop PWA.
3. Open the installed PWA from your desktop shortcut (optional but recommended for the full native experience).

### Step 3: Test the Offline Flow
1. In the PWA, open the Developer Tools (F12) -> go to the **Application** tab -> **Service Workers** -> check the **Offline** box. (Alternatively, just turn off your computer's Wi-Fi).
2. Notice how the UI immediately adapts (e.g., showing an offline indicator).
3. Perform a transaction: Add 2 items to the cart and process a payment. 
4. Because you are offline, the transaction is completely saved locally to IndexedDB, and the pending sync counter will go up (e.g., "1 Pending Sync").
5. Refresh the page to prove that the application still loads normally without internet (served from cache).

### Step 4: Sync to Cloud
1. Uncheck the **Offline** box in Developer Tools (or turn your Wi-Fi back on).
2. Watch the system automatically detect the connection. The pending queue will synchronize your local transactions directly to the Supabase database.
3. Check your `Report` page to see the synced data!

## 📝 License

This project is open-sourced under the MIT License.
