# Contributing to Post PWA

Thank you for considering contributing to Post PWA! This guide will help you get started.

---

## Prerequisites

- **Node.js** v20+ ([download](https://nodejs.org/))
- **npm** v11+ (included with Node.js)
- **PostgreSQL** — via [Supabase](https://supabase.com/) project or local instance

---

## Development Setup

1. **Clone & install:**
   ```bash
   git clone <your-repo-url>
   cd post-pwa
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Update `DATABASE_URL` with your PostgreSQL connection string.

3. **Setup database:**
   ```bash
   npm run db:push:local     # Push schema
   npm run db:seed:local     # Seed sample data
   ```

4. **Start dev server:**
   ```bash
   npm run dev               # Next.js + Turbopack
   ```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run preview` | Build + start (preview) |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run typecheck` | TypeScript type checking |
| `npm run check` | Lint + typecheck combined |
| `npm run format:check` | Prettier check |
| `npm run format:write` | Prettier auto-format |
| `npm run test:blackbox` | Run Playwright E2E tests |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:studio` | Open Prisma Studio |

---

## Code Style

- **TypeScript** — Strict mode, no `any` types
- **ESLint** — Configuration in `eslint.config.js`
- **Prettier** — Configuration in `prettier.config.js` (with Tailwind plugin)
- **Formatting:** Run `npm run format:write` before committing

---

## Project Structure

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the full directory structure and architecture overview.

**Key convention:** Feature code goes in `src/features/<feature>/`, shared code goes in `src/components/` or `src/hooks/`.

---

## Branch & Commit Conventions

- **Branches:** `feature/<description>`, `fix/<description>`, `refactor/<description>`
- **Commits:** Use conventional commits:
  - `feat: add product search filter`
  - `fix: offline sync retry logic`
  - `refactor: extract ReportFilterBar component`
  - `docs: update API reference`

---

## Testing

### E2E Tests (Playwright)

The project uses Playwright for blackbox testing:

```bash
# Run all E2E tests
npm run test:blackbox

# Run with UI mode
npx playwright test -c playwright.blackbox.config.ts --ui
```

Test files are in `tests/blackbox/`.

### Before Submitting

1. `npm run typecheck` — Zero TypeScript errors
2. `npm run lint` — Zero lint errors
3. `npm run test:blackbox` — All E2E tests pass

---

## Pull Request Process

1. Create a branch from `main`
2. Make your changes following the code style guidelines
3. Ensure all checks pass (typecheck, lint, tests)
4. Write a clear PR description explaining **what** and **why**
5. Request review

---

## Documentation

When making changes, update relevant docs:

- **New API procedure** → Update [docs/API.md](./docs/API.md)
- **Schema change** → Update [docs/DATABASE.md](./docs/DATABASE.md)
- **Architecture change** → Update [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **New feature** → Add to [CHANGELOG.md](./CHANGELOG.md) under `[Unreleased]`
