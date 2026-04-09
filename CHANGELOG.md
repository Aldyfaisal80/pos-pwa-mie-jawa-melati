# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [0.3.0] - 2026-04-09

### Added
- **Blackbox Testing Suite** — 53 skenario pengujian blackbox manual mencakup 6 modul utama (Dashboard, Kasir, Produk, Laporan, Pengaturan Toko, Navigasi)
- `generated/blackbox/blackbox-testcases.json` — JSON test suite terstruktur berisi 53 TC dengan field: skenario, langkah-langkah, hasil diharapkan, hasil diperoleh, dan status
- `generated/blackbox/blackbox-report.html` — HTML report interaktif dengan collapsible section per modul, badge BARU untuk skenario terbaru, dan summary statistics
- `tests/blackbox/pos-edge-cases.spec.ts` — Edge case Playwright: empty cart checkout prevention, long order notes (1000 char), huge store name safe handling
- `tests/blackbox/pos-a11y.spec.ts` — Automated accessibility scan dengan `@axe-core/playwright` untuk Dashboard, Cashier, dan Store Settings
- `tests/blackbox/pos-navigation.spec.ts` — Automated sidebar navigation tests (5 alur: Dashboard → Kasir/Produk/Laporan/Pengaturan dan kembali ke Dashboard)
- **TC-15** — Skenario tunai berhasil: nominal melebihi total, kembalian tampil, tombol aktif, transaksi selesai
- **TC-16** — Skenario Clear Cart: hapus seluruh item keranjang sekaligus via tombol ikon tempat sampah; tombol Bayar Sekarang kembali disabled
- **TC-48** — Skenario Hubungkan Printer: tombol Bluetooth printer tersedia dan memberikan respons visual di tab Printer pada halaman Pengaturan
- **Thermal Printer Bluetooth (58mm)** — Full Web Bluetooth API integration via `react-thermal-printer`
- `src/hooks/use-bluetooth-printer.ts` — Custom hook untuk BLE GATT connection, auto-chunking MTU, dan `localStorage` memory untuk nama printer
- `src/features/cashier/components/ReceiptPrintTemplate.tsx` — Headless JSX-to-Buffer component, 32-column layout, Base64 logo dengan Floyd-Steinberg dithering
- `src/features/cashier/components/PrinterActionButtons.tsx` — Reusable DRY component untuk Bluetooth connect/print trigger
- `src/features/store-settings/schemas/index.ts` — Co-located Zod schema dengan clean `.min(1)` error syntax
- `src/features/store-settings/types/index.ts` — Co-located `StoreSettingsFormValues` type inferred dari schema
- `src/features/store-settings/components/StoreSettingsForm.tsx` — Smart container (data fetching + form state + skeleton + mutation)
- `src/features/product/schemas/index.ts` — Co-located Zod schema untuk product form
- `src/features/product/components/ProductManager.tsx` — Smart container diekstrak dari `ProductPage` (state, modals, delete logic)
- `isForeignKeyError` dan `isUnrecoverableError` helpers di `use-offline-sync.ts`
- `STORE_SETTINGS_FORM_ID` constant — single source of truth untuk HTML form `id`/`form` attribute
- `COLUMN_WIDTHS` constant di `ProductTable` — shared antara header, skeleton, dan data rows

### Changed
- **TransactionDetailModal** — Dapat mencetak ulang transaksi historis dan offline-synced menggunakan unified Bluetooth template
- **ReceiptModal** — UI di-refactor ke `PrinterActionButtons`; integrasi ESC/POS binary generation langsung setelah checkout
- **ProductPage** — Sekarang memiliki `Card` + `CardHeader` layout; `ProductManager` hanya render konten inner
- **ProductFormModal** — Migrasi dari `useState`/manual validation ke React Hook Form + Zod dengan `PRODUCT_FORM_ID` constant
- **ProductTable** — Tambah `table-fixed` CSS layout; `COLUMN_WIDTHS` constant mencegah layout shift; `truncate` + `min-w-0` untuk overflow safety
- **StoreSettingsPage** — Refactor menjadi pure layout wrapper (~34 baris); delegate semua logic ke `StoreSettingsForm`
- **StoreSettingsFormInner** — Migrasi ke `useFormContext` pattern; `formId` prop dihapus
- **CategoryManagerModal** — Delete error UX: `AlertDialog` menutup pada success maupun error (`onSettled`)
- **Offline sync error handling** — FK violations sekarang membersihkan transaksi stuck dari antrian IndexedDB; user ditampilkan warning toast yang actionable
- **Sonner Toaster** — Type-specific left-border accent colors (emerald=success, destructive=error, amber=warning, blue=info)
- `COL` constant diubah nama menjadi `COLUMN_WIDTHS` (SCREAMING_SNAKE_CASE)

### Fixed
- **Dashboard Revenue Chart — Real-time Sync** — `useLiveStats` sekarang juga menginvalidasi `getRevenueChart` cache
- **Revenue Chart — Day Matching** — `getRevenueChart` menggunakan `TO_CHAR(DATE(...), 'YYYY-MM-DD')` untuk menghindari timezone mismatch node-postgres
- **Transaction Date Timezone Bug** — `syncOfflineData` menggeser UTC date ke WIB (+7h) sebelum disimpan agar `DATE(date AT TIME ZONE 'Asia/Jakarta')` selalu memberikan hari kalender yang tepat
- `StoreSettingsForm.tsx` — TypeScript type error zodResolver diselesaikan dengan infertype dari schema Zod
- `AppProvider` sekarang mengimpor custom `Toaster` dari `@/components/ui/sonner`, bukan raw `Sonner` dari `"sonner"`
- Offline sync infinite retry loop: FK constraint errors tidak lagi menumpuk di antrian pending
- `productFormSchema` — Hapus `invalid_type_error` yang tidak valid di Zod v4
- `CategoryManagerModal` — Dialog delete yang sebelumnya diam saat mutation error; kini menutup secara konsisten
- Double-toast bug pada product delete dihilangkan

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
