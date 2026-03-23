# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [0.2.0] - 2026-03-23

### Changed
- **NoteModal** — Refactored from centered modal to responsive Drawer/Dialog pattern for better mobile UX
- **CheckoutModal** — Converted to bottom sheet (Vaul Drawer) on mobile with swipe-to-dismiss
- **ReportPage** — Split into smaller components (ReportFilterBar, ReportPagination) and custom hook (useReportFilters)
- **TransactionTable** — Fixed AlertDialog per-row rendering bug — now uses single shared dialog
- **Theme transitions** — Added smooth, fluid CSS transitions for theme switching across all components
- **deleteTransaction** — Changed from permanent delete to soft delete (`deletedAt` timestamp) to preserve data integrity
- **Date filtering** — All report/dashboard queries now use WIB (UTC+7) timezone-aware boundaries for accurate Indonesian time handling
- **Revenue chart** — Migrated from N+1 loop to single SQL `GROUP BY` query with `AT TIME ZONE 'Asia/Jakarta'`

### Added
- `useReportFilters` hook for report state management
- `ReportFilterBar` component for filter UI
- `ReportPagination` reusable component
- `parseLocalDate()` utility in report utils
- `src/lib/timezone.ts` — WIB timezone utilities (`toWIBStartOfDay`, `toWIBEndOfDay`, `todayWIBStart`)
- `src/server/services/error.service.ts` — Centralized `ErrorTRPCService` for consistent error throwing

### Fixed
- Dashboard stats now correctly filters by WIB "today" instead of UTC midnight
- Error messages no longer leak internal Prisma details to the client

---

## [0.1.0] - 2026-03-08

### Added
- **Offline-First POS System** — Full cashier workflow (cart, checkout, receipt) working offline
- **Background Sync** — Automatic transaction sync via IndexedDB queue when online
- **PWA Support** — Installable on Desktop/iOS/Android with Serwist service worker
- **Product Management** — CRUD operations with categories, images (Supabase Storage), and soft delete
- **Category Management** — Create/delete categories with safe product reassignment
- **Transaction Reports** — Paginated, filterable, sortable report with CSV export
- **Dashboard** — Today's revenue, transaction count, top 5 products chart
- **Revenue Chart** — Dynamic revenue visualization (7/30/90 day ranges)
- **Store Settings** — Configurable store name, address, phone, and logo
- **Receipt Modal** — Print-ready receipt display after checkout
- **Theme Support** — Light/dark mode via next-themes
- **Responsive Design** — Mobile-first UI with Tailwind CSS v4 and Shadcn UI
- **Playwright Tests** — Blackbox E2E test suite
