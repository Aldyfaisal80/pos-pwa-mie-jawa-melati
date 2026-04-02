# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **Dashboard Revenue Chart — Real-time Sync** — Chart was not updating after a new transaction because `useLiveStats` invalidated `getDashboardStats` and `getTransactionReport` but forgot `getRevenueChart`. Added `getRevenueChart.invalidate()` to both BroadcastChannel and Supabase Realtime listeners.
- **Revenue Chart — Day Matching (TO_CHAR Refactor)** — `getRevenueChart` used `DATE(...) AS day` which returns a Postgres `DATE` type interpreted by node-postgres as a JS `Date` object with a timezone-shifted midnight. The JS `.getUTCDate()` comparison then mismatch by one day. Fixed by using `TO_CHAR(DATE(...), 'YYYY-MM-DD') AS day_str` to return a plain string and comparing directly with a `YYYY-MM-DD`-formatted WIB date string instead.
- **Transaction Date Timezone Bug (Root Cause Fix)** — The `date` column is `timestamp WITHOUT time zone`. Client stores UTC ISO strings (`new Date().toISOString()`), which Postgres stores as naive local time. Because the Postgres server is on `Asia/Jakarta` (UTC+7), `DATE(date AT TIME ZONE 'Asia/Jakarta')` subtracted 7h from the naive value — causing every transaction created between WIB midnight (00:00) and WIB 07:00 to be bucketed into the *previous* day. Fixed in `syncOfflineData` router by shifting the UTC date to WIB local time (`+7h`) before storing so the naive timestamp matches the user's actual local clock time.

---


### Added
- **Thermal Printer Bluetooth (58mm)** — Full Web Bluetooth API integration via `react-thermal-printer`.
- `src/hooks/use-bluetooth-printer.ts` — Custom hook for BLE GATT connection, handling generic ESC/POS UUIDs (`000018f0...`), auto-chunking for MTU sizes, and `localStorage` memory for printer name UI.
- `src/features/cashier/components/ReceiptPrintTemplate.tsx` — Headless JSX-to-Buffer component. Renders receipt layout exactly to 32 columns, handles Base64 logo rendering with Floyd-Steinberg dithering.
- `src/features/cashier/components/PrinterActionButtons.tsx` — Reusable, DRY UI component for uniform Bluetooth connect/print triggers across modules.
- `src/features/storeSettings/schemas/index.ts` — Co-located Zod schema with clean `.min(1, "pesan")` error syntax (L8-TRPC pattern)
- `src/features/storeSettings/types/index.ts` — Co-located `StoreSettingsFormValues` type inferred from schema
- `src/features/storeSettings/components/StoreSettingsForm.tsx` — Smart container component (data fetching + form state + skeleton + mutation)
- `src/features/product/schemas/index.ts` — Co-located Zod schema for product form (`productFormSchema`, `ProductFormValues`)
- `src/features/product/components/ProductManager.tsx` — New smart container extracted from `ProductPage` (state, modals, delete logic); renders `CardContent` + action toolbar within parent `Card`
- `isForeignKeyError` and `isUnrecoverableError` helpers in `use-offline-sync.ts` to detect stale IndexedDB data
- Sonner `closeButton`, `visibleToasts`, `duration`, `gap`, `offset` props configured per official docs
- `STORE_SETTINGS_FORM_ID` constant exported from `StoreSettingsFormInner` — single source of truth for HTML form `id`/`form` attribute link
- `COLUMN_WIDTHS` constant in `ProductTable` — shared between header, skeleton, and data rows for layout stability

### Changed
- **TransactionDetailModal** (Reports) — Can now reprint historical and offline-synced transactions using the unified Bluetooth template.
- **ReceiptModal** (Cashier) — UI refactored into `PrinterActionButtons`; integrated to trigger raw ESC/POS binary generation right after checkout.
- **ProductPage** — Now owns `Card` + `CardHeader` (icon, title, description) layout matching `StoreSettingsPage` pattern; `ProductManager` renders inner content only
- **ProductFormModal** — Migrated from `useState`/manual validation to React Hook Form + Zod; uses `PRODUCT_FORM_ID` constant; error messages via `<FormMessage />`
- **ProductTable** — Added `table-fixed` CSS layout; `COLUMN_WIDTHS` constant prevents layout shift across all screen sizes and data states; `truncate` + `min-w-0` on name column for overflow safety
- **StoreSettingsPage** — Refactored to pure layout wrapper (~34 lines); delegates all logic to `StoreSettingsForm`
- **StoreSettingsFormInner** — Migrated to `useFormContext` pattern; `formId` prop removed in favor of `STORE_SETTINGS_FORM_ID` exported constant; imports from co-located `types/`
- **StoreSettingsForm** — Migrated schema/type imports to co-located `schemas/` and `types/` folders; imports `STORE_SETTINGS_FORM_ID` from `StoreSettingsFormInner`
- **CategoryManagerModal** — Delete error UX: `AlertDialog` now closes on both success and error (`onSettled`); extracted inline `onClick` to named `handleConfirmDelete`
- **Offline sync error handling** — FK violations (e.g., stale `productId` after DB seed/reset) now purge stuck transactions from IndexedDB queue instead of retrying indefinitely; user shown actionable warning toast instead of silent infinite failure
- **Sonner Toaster** — Upgraded with type-specific left-border accent colors (emerald=success, destructive=error, amber=warning, blue=info); fixed critical bug where `AppProvider` was using raw `Sonner` directly, bypassing all custom styling
- `COL` constant renamed to `COLUMN_WIDTHS` (SCREAMING_SNAKE_CASE per clean-code convention)

### Fixed
- `AppProvider` was importing raw `Sonner` from `"sonner"` instead of the custom `Toaster` from `@/components/ui/sonner` — all icon and style customizations were previously ignored
- Offline sync infinite retry loop: FK constraint errors caused by DB seed/reset no longer accumulate indefinitely in the pending queue
- `StoreSettingsFormInner` comment about fallback icon removed (prettier formatted)
- `productFormSchema` — Removed invalid `invalid_type_error` option (not valid in Zod v4); simplified to clean `.min(1, "message")` chain
- `CategoryManagerModal` delete dialog — Was silently staying open on mutation error; now closes consistently (success or error) with toast providing error context
- Double-toast bug on product delete — `useProductMutations` and component no longer fire separate success toasts; unified to single "Produk dinonaktifkan" message

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
