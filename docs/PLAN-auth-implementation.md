# Auth Implementation Plan — POS PWA

> **Plan Slug:** `auth-implementation`
> **Project Type:** WEB (Next.js 16 + tRPC + Supabase + Prisma)
> **Created:** 2026-04-09
> **Status:** 🟡 PLANNING

---

## Overview

Mengimplementasikan sistem autentikasi pada POS PWA menggunakan **Supabase Auth** (sudah terpasang sebagai dependency). App saat ini tidak memiliki proteksi route — semua halaman accessible tanpa login. Tujuan plan ini adalah:

1. Menambahkan **Login Page** (email + password via Supabase Auth)
2. Membuat **Next.js Middleware** untuk proteksi route
3. Menyambungkan **Supabase Session** ke `tRPC context` (`ctx.user`)
4. Mengaktifkan `protectedProcedure` yang sudah ada tapi belum tersambung
5. Menambahkan **Auth Context / Provider** di sisi client
6. Menambahkan UI **Logout** di AppSidebar

---

## 🎯 Success Criteria

| Kriteria | Verifikasi |
|----------|-----------|
| User yang belum login redirect ke `/login` | Playwright E2E test |
| Login berhasil → redirect ke `/` | Manual test |
| Logout berhasil → hapus session → redirect `/login` | Manual test |
| `protectedProcedure` throw `UNAUTHORIZED` tanpa session | Unit test |
| `ctx.user` berisi data Supabase user di semua protected routes | tRPC router test |
| Session persist `onAuthStateChange` (refresh page tidak logout) | Manual test |

---

## 🧱 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Auth Provider | **Supabase Auth** | Sudah di-install (`@supabase/supabase-js ^2.98.0`), ada env `NEXT_PUBLIC_SUPABASE_*` |
| Route Protection | **Next.js Middleware** (`middleware.ts` di root) | SSR-level protection, tidak perlu client-side redirect |
| Session Sharing | Supabase `getSession()` + tRPC context headers | Menyambungkan session ke `ctx.user` |
| State Client | React Context (`AuthContext`) | Global user state, memicu re-render saat login/logout |
| UI | Shadcn/ui (sudah ada) | Konsisten dengan design system existing |

---

## 📁 File Structure (Baru & Modifikasi)

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx                    [NEW] Login page route
│   └── layout.tsx                      [MODIFY] Wrap with AuthProvider
│
├── features/
│   └── auth/                           [NEW] Auth feature module
│       ├── components/
│       │   └── LoginForm.tsx           [NEW] Email/password form
│       ├── hooks/
│       │   └── useAuth.ts              [NEW] useAuth hook (consume context)
│       └── pages/
│           └── LoginPage.tsx           [NEW] Login page component
│
├── components/
│   └── layouts/
│       └── providers/
│           └── AuthProvider.tsx        [NEW] Auth context + Supabase listener
│       └── Providers.tsx               [MODIFY] Include AuthProvider
│       └── AppSidebar.tsx              [MODIFY] Tambah logout button
│
├── lib/
│   └── supabase-client.ts              [MODIFY] Export typed client (sudah ada)
│
├── server/
│   └── api/
│       └── trpc.ts                     [MODIFY] Wire Supabase session ke ctx.user
│
└── middleware.ts                       [NEW] Next.js route protection
```

---

## 📋 Task Breakdown

### PHASE 1 — Foundation (P0)

#### TASK-AUTH-01: Buat `AuthProvider` Client
- **Agent:** `frontend-specialist`
- **Skill:** `react-best-practices`
- **Priority:** P0 (blocker semua task lain)
- **Dependencies:** -
- **Duration:** ~15 menit

**INPUT:** Supabase client di `src/lib/supabase-client.ts`
**OUTPUT:** `src/components/layouts/providers/AuthProvider.tsx`
```ts
// Isi:
// - createContext<AuthContextType>
// - supabase.auth.getSession() di useEffect
// - supabase.auth.onAuthStateChange() listener
// - Expose: { user, session, loading, signOut }
```
**VERIFY:** Context dapat di-consume oleh child components tanpa error

---

#### TASK-AUTH-02: Wire Session ke tRPC Context
- **Agent:** `backend-specialist`
- **Skill:** `api-patterns`
- **Priority:** P0
- **Dependencies:** TASK-AUTH-01
- **Duration:** ~10 menit

**INPUT:** `src/server/api/trpc.ts` (sudah ada `TRPCUser` type & `protectedProcedure`)
**OUTPUT:** `src/server/api/trpc.ts` (modifikasi `createTRPCContext`)
```ts
// Modifikasi:
// createTRPCContext mengambil Authorization header
// → validasi dengan supabase.auth.getUser(token)
// → populate ctx.user dari hasil validasi
```
**VERIFY:** `protectedProcedure` berhasil mengakses `ctx.user.id`

---

#### TASK-AUTH-03: Buat Next.js Middleware
- **Agent:** `security-auditor`
- **Skill:** `vulnerability-scanner`
- **Priority:** P0
- **Dependencies:** -
- **Duration:** ~10 menit

**INPUT:** Daftar routes yang harus diproteksi (`/`, `/cashier`, `/product`, `/report`, `/store-settings`)
**OUTPUT:** `src/middleware.ts` (di project root sejajar `src/`)
```ts
// Logic:
// 1. Check Supabase session dari cookies
// 2. Jika tidak ada session → redirect ke /login
// 3. Jika ada session dan akses /login → redirect ke /
// 4. Public routes: /login, /_next/*, /api/*, /manifest.json
```
**VERIFY:** Akses `http://localhost:3000/` tanpa session → redirect `/login`

---

### PHASE 2 — Core UI (P1)

#### TASK-AUTH-04: Buat LoginForm Component
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P1
- **Dependencies:** TASK-AUTH-01
- **Duration:** ~20 menit

**INPUT:** Design system existing (Shadcn/ui, Tailwind, react-hook-form + zod)
**OUTPUT:** `src/features/auth/components/LoginForm.tsx`
```ts
// Fields: email (z.string().email()), password (z.string().min(8))
// Calls: supabase.auth.signInWithPassword()
// States: loading (disabled button), error message
// UX: Toast error via sonner, auto-redirect on success
```
**VERIFY:** Form validation bekerja, error Supabase ditampilkan ke user

---

#### TASK-AUTH-05: Buat LoginPage
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P1
- **Dependencies:** TASK-AUTH-04
- **Duration:** ~15 menit

**INPUT:** `src/features/auth/components/LoginForm.tsx`
**OUTPUT:**
- `src/features/auth/pages/LoginPage.tsx` — page component
- `src/app/login/page.tsx` — Next.js route export

```ts
// Design:
// - Full-page centered layout (tidak menggunakan AppProvider/sidebar)
// - Logo / nama app di atas
// - Clean card design, konsisten dengan design system
// - No sidebar, no bottom tab bar
```
**VERIFY:** Route `/login` dapat diakses tanpa sidebar

---

### PHASE 3 — Integration (P2)

#### TASK-AUTH-06: Update `AppProvider` + Layout
- **Agent:** `frontend-specialist`
- **Skill:** `react-best-practices`
- **Priority:** P2
- **Dependencies:** TASK-AUTH-01, TASK-AUTH-05
- **Duration:** ~10 menit

**INPUT:** `src/components/layouts/providers/Providers.tsx`, `src/app/layout.tsx`
**OUTPUT:** 
- `Providers.tsx` wrap dengan `<AuthProvider>`
- `AppProvider.tsx` kondisional render (hide sidebar if on `/login`)

**VERIFY:** `useAuth()` hook bekerja di dalam sidebar dan fitur lain

---

#### TASK-AUTH-07: Tambah Logout di AppSidebar
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Dependencies:** TASK-AUTH-01, TASK-AUTH-06
- **Duration:** ~10 menit

**INPUT:** `src/components/fragments/AppSidebar.tsx`
**OUTPUT:** Tombol Logout di bagian bawah sidebar + top bar mobile

```ts
// Calls: signOut() dari useAuth()
// UX: Konfirmasi dialog sebelum logout (optional)
// After logout: router.push('/login')
```
**VERIFY:** Klik logout → session terhapus → redirect `/login`

---

#### TASK-AUTH-08: Update tRPC Client — Kirim Auth Token
- **Agent:** `backend-specialist`
- **Skill:** `api-patterns`
- **Priority:** P2
- **Dependencies:** TASK-AUTH-02, TASK-AUTH-06
- **Duration:** ~10 menit

**INPUT:** `src/trpc/react.tsx` (tRPC client setup)
**OUTPUT:** tRPC client menambahkan `Authorization: Bearer <token>` header

```ts
// Modifikasi TRPCReactProvider:
// → Dapatkan session token dari Supabase client
// → Inject ke headers di setiap request
```
**VERIFY:** `protectedProcedure` di server berhasil mendapatkan `ctx.user`

---

### PHASE X — Verification

| Langkah | Command | Pass Criteria |
|---------|---------|---------------|
| Lint | `npm run check` | Zero errors |
| Security scan | `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` | No critical |
| Build | `npm run build` | Success |
| E2E Manual | `npm run dev` → test login/logout flow | All scenarios pass |
| Blackbox tests | `npm run test:blackbox` | All pass |

---

## ⚠️ Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|---------|
| Middleware tidak terbaca Next.js | Route tidak terproteksi | Pastikan `middleware.ts` ada di root, bukan dalam `src/` |
| Token expiry tidak di-handle | User stuck dengan expired session | Tambahkan `onAuthStateChange` listener untuk auto-refresh |
| `protectedProcedure` break existing routers | API error 401 | Phase setelah auth: audit semua router, switch ke `publicProcedure` yang perlu (misal: read-only) |
| Login page ikut pakai AppProvider (sidebar muncul) | UX buruk | Route `/login` harus di luar `AppProvider` — gunakan route group `(auth)` |

---

## 🔄 Dependency Graph

```
TASK-AUTH-01 (AuthProvider)
    ├── TASK-AUTH-04 (LoginForm)
    │       └── TASK-AUTH-05 (LoginPage)
    ├── TASK-AUTH-06 (Update AppProvider)
    │       └── TASK-AUTH-07 (Logout Button)
    └── TASK-AUTH-08 (tRPC Client Headers)

TASK-AUTH-02 (tRPC Context)       ← dapat parallel dengan AUTH-01
TASK-AUTH-03 (Middleware)         ← dapat parallel dengan AUTH-01
```

**Implementasi urutan yang aman:**
1. AUTH-01 + AUTH-02 + AUTH-03 (parallel)
2. AUTH-04 (setelah AUTH-01)
3. AUTH-05, AUTH-06 (setelah AUTH-04)
4. AUTH-07, AUTH-08 (parallel, setelah AUTH-05 + AUTH-06)
5. PHASE X (setelah semua selesai)

---

## 🔐 Security Checklist

- [ ] Token tidak disimpan di `localStorage` (gunakan Supabase cookie/memory)
- [ ] Route `/login` tidak accessible jika sudah login (redirect ke `/`)
- [ ] Supabase RLS (Row Level Security) aktif di Supabase dashboard
- [ ] `anon key` tidak digunakan untuk operasi privileged
- [ ] Error messages tidak expose internal details (hanya "Email atau password salah")

---

## 📌 Catatan Penting

> **Middleware location:** Di Next.js, `middleware.ts` **harus** berada di root project (sejajar dengan `src/`), bukan di dalam `src/`.  
> Path: `c:\Users\aldyf\Downloads\CODE\antigravity\post-pwa\middleware.ts`

> **Login route isolation:** Gunakan Next.js Route Groups — buat `src/app/(auth)/login/page.tsx` agar login page tidak menggunakan layout root yang menyertakan `AppProvider` (sidebar & bottom nav).

> **Existing `protectedProcedure`:** Sudah ada di `trpc.ts` (line 125-133) tapi belum ada routers yang menggunakannya. Setelah auth aktif, routers yang sensitif (mutations) wajib di-switch ke `protectedProcedure`.
