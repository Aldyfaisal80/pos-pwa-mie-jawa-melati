# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [0.4.0] - 2026-04-14

### Added
- **Supabase Authentication** — Email/password login via `@supabase/ssr`; server-side session validated in `middleware.ts` (first layer) + client-side auth guard in `(app)/layout.tsx` (second layer)
- **`src/features/auth/`** — Self-contained auth module: `context/`, `hooks/useAuth`, `providers/AuthProvider`, `schemas/`, `index.ts` re-export barrel
- **`src/app/(app)/` route group** — Protected layout wrapping all authenticated pages (`pos/`, `products/`, `reports/`, `settings/`)
- **`src/app/(auth)/` route group** — Public layout for unauthenticated routes (`login/`)
- **`src/trpc/vanilla-client.ts`** — Lifecycle-independent tRPC client for use outside React component trees (offline sync, background workers)
- **`AccountProfileForm`** — New Settings tab showing Supabase Auth user display name and email, editable via `useAccountProfile` hook
- **`src/features/store-settings/schemas/account.ts`** — Zod schema for account profile form
- **`src/components/ui/avatar-initials.tsx`** — Avatar component rendering user initials as fallback when no photo is set
- **`src/server/api/types.ts`** — Shared tRPC context and procedure type exports

### Changed
- **`middleware.ts`** — Rewritten to use `@supabase/ssr` `createServerClient`; validates session cookie, redirects unauthenticated users to `/login?redirect=<path>`, and prevents authenticated users from accessing `/login`
- **Route structure** — All app pages moved from `src/app/<page>/` into `src/app/(app)/<page>/` route group; login moved to `src/app/(auth)/login/`
- **`useOfflineSync` / `useSyncTransaction`** — Refactored to use `vanilla-client.ts` instead of `trpc.useUtils()` — sync no longer depends on React component lifecycle; more resilient to page refreshes mid-sync
- **`src/features/cashier/components/`** — Split into `checkout/` and `receipt/` sub-folders
- **`src/features/product/components/`** — Split into `product/` and `category/` sub-folders
- **`src/features/report/components/`** — Split into `analytics/` and `transaction/` sub-folders
- **`StoreSettingsForm`** — Refactored to multi-tab layout (Info Toko, Printer, Akun); Account tab delegates to `AccountProfileForm`
- **`AppSidebar`** — Updated to use auth user data (display name, email) from `useAuth` hook; avatar shows user initials
- **`AppProvider`** — Cleaned up; no longer contains legacy auth logic
- **`src/server/api/trpc.ts`** — Context updated to pass Supabase session; procedures can now access `ctx.session`
- **`transaction` router** — Improved error classification: FK violations → `BAD_REQUEST`; unknown errors → `INTERNAL_SERVER_ERROR`; cleaner response types

### Removed
- `src/components/layouts/providers/AuthProvider.tsx` — Replaced by `src/features/auth/providers/`
- `src/components/config/navigation.ts` — Navigation config inlined/relocated
- Legacy flat component files: `CheckoutCartSummary`, `CheckoutCashInput`, `CheckoutPaymentMethods`, `ReceiptPrintTemplate`, `CategoryFormModal`, `CategoryManagerModal`, `CategorySelectField`, `ProductFormModal`, `ProductImageField`, `ProductManager`, `ProductTable`, `ReportChart`, `ReportFilterBar`, `ReportPagination`, `ReportStatsCards`, `TransactionDetailModal`, `TransactionTable` — all replaced by sub-folder structure

---

## [0.3.0] - 2026-04-09

### Added
- **Blackbox Testing Suite** — 53 manual blackbox test scenarios covering 6 main modules (Dashboard, Cashier, Products, Reports, Store Settings, Navigation)
- `tests/blackbox/pos-edge-cases.spec.ts` — Playwright edge cases: empty cart checkout prevention, long order notes (1000 chars), huge store name safe handling
- `tests/blackbox/pos-a11y.spec.ts` — Automated accessibility scan with `@axe-core/playwright` for Dashboard, Cashier, and Store Settings
- `tests/blackbox/pos-navigation.spec.ts` — Automated sidebar navigation tests (5 flows: Dashboard → Cashier/Products/Reports/Settings and back)
- **TC-15** — Cash payment success scenario: amount exceeds total, change displayed, button active, transaction completes
- **TC-16** — Clear Cart scenario: removes all cart items at once via trash icon button; checkout button returns to disabled state
- **TC-48** — Connect Printer scenario: Bluetooth printer button available and returns visual feedback in Printer tab on Settings page
- **Thermal Printer Bluetooth (58mm)** — Full Web Bluetooth API integration via `react-thermal-printer`
- `src/hooks/use-bluetooth-printer.ts` — Custom hook for BLE GATT connection, generic ESC/POS UUIDs, auto-chunking for MTU sizes, and `localStorage` memory for printer name
- `src/features/cashier/components/ReceiptPrintTemplate.tsx` — Headless JSX-to-Buffer component; 32-column receipt layout, Base64 logo with Floyd-Steinberg dithering
- `src/features/cashier/components/PrinterActionButtons.tsx` — Reusable DRY component for uniform Bluetooth connect/print triggers across modules
- `src/features/store-settings/schemas/index.ts` — Co-located Zod schema with clean `.min(1)` error syntax
- `src/features/store-settings/types/index.ts` — Co-located `StoreSettingsFormValues` type inferred from schema
- `src/features/store-settings/components/StoreSettingsForm.tsx` — Smart container (data fetching + form state + skeleton + mutation)
- `src/features/product/schemas/index.ts` — Co-located Zod schema for product form (`productFormSchema`, `ProductFormValues`)
- `src/features/product/components/ProductManager.tsx` — Smart container extracted from `ProductPage` (state, modals, delete logic)
- `isForeignKeyError` and `isUnrecoverableError` helpers in `use-offline-sync.ts` to detect stale IndexedDB data
- `STORE_SETTINGS_FORM_ID` constant exported from `StoreSettingsFormInner` — single source of truth for HTML form `id`/`form` attribute
- `COLUMN_WIDTHS` constant in `ProductTable` — shared between header, skeleton, and data rows for layout stability

### Changed
- **TransactionDetailModal** — Can now reprint historical and offline-synced transactions using the unified Bluetooth template
- **ReceiptModal** — UI refactored into `PrinterActionButtons`; integrated to trigger raw ESC/POS binary generation right after checkout
- **ProductPage** — Now owns `Card` + `CardHeader` layout matching `StoreSettingsPage` pattern; `ProductManager` renders inner content only
- **ProductFormModal** — Migrated from `useState`/manual validation to React Hook Form + Zod; uses `PRODUCT_FORM_ID` constant; error messages via `<FormMessage />`
- **ProductTable** — Added `table-fixed` CSS layout; `COLUMN_WIDTHS` constant prevents layout shift across all screen sizes; `truncate` + `min-w-0` on name column for overflow safety
- **StoreSettingsPage** — Refactored to pure layout wrapper (~34 lines); delegates all logic to `StoreSettingsForm`
- **StoreSettingsFormInner** — Migrated to `useFormContext` pattern; `formId` prop removed in favor of `STORE_SETTINGS_FORM_ID` exported constant
- **CategoryManagerModal** — Delete error UX: `AlertDialog` now closes on both success and error (`onSettled`); extracted inline `onClick` to named `handleConfirmDelete`
- **Offline sync error handling** — FK violations now purge stuck transactions from IndexedDB queue instead of retrying indefinitely; user shown actionable warning toast
- **Sonner Toaster** — Type-specific left-border accent colors (emerald=success, destructive=error, amber=warning, blue=info)
- `COL` constant renamed to `COLUMN_WIDTHS` (SCREAMING_SNAKE_CASE per clean-code convention)

### Fixed
- **Dashboard Revenue Chart — Real-time Sync** — `useLiveStats` now also invalidates `getRevenueChart` cache on transaction sync
- **Revenue Chart — Day Matching** — `getRevenueChart` uses `TO_CHAR(DATE(...), 'YYYY-MM-DD')` string comparison to avoid node-postgres UTC-shift pitfalls
- **Transaction Date Timezone Bug** — `syncOfflineData` pre-shifts UTC date to WIB (+7h) before storing so `DATE(date AT TIME ZONE 'Asia/Jakarta')` always resolves the correct local calendar day
- `StoreSettingsForm.tsx` — TypeScript type error with zodResolver resolved by inferring type directly from Zod schema
- `AppProvider` now imports custom `Toaster` from `@/components/ui/sonner` instead of raw `Sonner` from `"sonner"` — all icon and style customizations now apply correctly
- Offline sync infinite retry loop: FK constraint errors caused by DB seed/reset no longer accumulate indefinitely in the pending queue
- `productFormSchema` — Removed invalid `invalid_type_error` option (not valid in Zod v4); simplified to clean `.min(1, "message")` chain
- `CategoryManagerModal` delete dialog — Was silently staying open on mutation error; now closes consistently (success or error) with toast providing error context
- Double-toast bug on product delete — unified to single success message

---

## [0.2.0] - 2026-03-23

### Changed
- **NoteModal** — Refactored from centered modal to responsive Drawer/Dialog pattern for better mobile UX
- **CheckoutModal** — Converted to bottom sheet (Vaul Drawer) on mobile with swipe-to-dismiss
- **ReportPage** — Split into smaller components (ReportFilterBar, ReportPagination) and custom hook (useReportFilters)
- **TransactionTable** — Fixed AlertDialog per-row rendering bug — now uses single shared dialog
- **Theme transitions** — Added smooth, fluid CSS transitions for theme switching across all components
- **deleteTransaction** — Changed from permanent delete to soft delete (`deletedAt` timestamp) to preserve data integrity
- **Date filtering** — All report/dashboard queries now use WIB (UTC+7) timezone-aware boundaries for accurate local time handling
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
