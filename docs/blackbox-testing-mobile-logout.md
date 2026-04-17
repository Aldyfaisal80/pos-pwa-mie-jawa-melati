# Blackbox Testing — Mobile Layer & Desktop Profile
> **Fitur:** Shadcn Drawer (Mobile) & DropdownMenu (Desktop) untuk Pengaturan Akun
> **Versi:** v0.5.0  
> **Tanggal Uji:** 2026-04-15  
> **Tester:** Aldyfaisal
> **Lingkungan:** `http://localhost:3000` | Browser: Chrome/Edge

---

## Persiapan

| Step | Aksi |
|------|------|
| 1 | Login dengan akun valid (`admin@example.com`) |
| 2 | Persiapkan dua viewport: Mobile (375x812px) dan Desktop (≥1024px) |

---

## Test Cases Mobile (Viewport ≤ 1024px)

### TC-01 — Tab "Akun" Muncul (Mobile)
| Field | Detail |
|-------|--------|
| **Kategori** | UI / Layout |
| **Expected Result** | Ada 5 item di navigasi bawah. Tab ke-5 bertulisan "Akun" (bukan "Pengaturan"). |
| **Status** | ✅ Pass |

### TC-02 — Tap "Akun" Membuka Shadcn Drawer
| Field | Detail |
|-------|--------|
| **Kategori** | Fungsional |
| **Langkah** | Tap tab "Akun" |
| **Expected Result** | Muncul Shadcn Drawer dari bawah. Ada indikator *drag handle*. Menampilkan inisial, email, role, serta item "Edit Profil", "Pengaturan Toko", dan "Keluar". |
| **Status** | ✅ Pass |

### TC-03 — "Edit Profil" Muncul Internally (Mobile)
| Field | Detail |
|-------|--------|
| **Kategori** | Navigasi / State |
| **Langkah** | Saat Drawer aktif, tap "Edit Profil" |
| **Expected Result** | Drawer TIDAK menutup dan TIDAK pindah halaman (`/settings`). Isi drawer langsung berganti memuat `<AccountProfileForm />`. |
| **Status** | ✅ Pass |

### TC-04 — Logout Berhasil dari Drawer
| Field | Detail |
|-------|--------|
| **Kategori** | Security / Auth |
| **Langkah** | Tap "Keluar dari Aplikasi" (warna merah) di Drawer |
| **Expected Result** | Drawer menutup statis, session dibersihkan (`signOut()`), redirect ke `/login` tanpa refresh bouncer. |
| **Status** | ✅ Pass |

---

## Test Cases Desktop (Viewport ≥ 1024px)

### TC-05 — Tab "Akun" Dihapus dari Halaman `/settings`
| Field | Detail |
|-------|--------|
| **Kategori** | UI / Layout |
| **Langkah** | Kunjungi halaman `/settings` di Desktop |
| **Expected Result** | Di sidebar navigasi halaman Pengaturan, **hanya ada** "Info Toko" dan "Printer". Tab "Akun" sudah tidak ada. |
| **Status** | ✅ Pass |

### TC-06 — Dropdown Profil di Sidebar
| Field | Detail |
|-------|--------|
| **Kategori** | Fungsional / Navigation |
| **Langkah** | Di `AppSidebar` utama kiri bawah, Klik area Avatar Pengguna |
| **Expected Result** | Muncul `DropdownMenu` Shadcn tepat di atas/samping kursor. Terdapat opsi "Edit Profil" dan "Keluar". |
| **Status** | ✅ Pass |

### TC-07 — Modal "Edit Profil" (Desktop)
| Field | Detail |
|-------|--------|
| **Kategori** | UI / Komponen |
| **Langkah** | Kik "Edit Profil" dari Dropdown tadi |
| **Expected Result** | Muncul Modal layar tumpang (Shadcn `Dialog`) yang memuat Form Edit Akun tanpa merusak *layout layouting* belakangnya. |
| **Status** | ✅ Pass |

---

## Ringkasan Hasil
**Total:** 7 Test Cases | ✅ Pass: 7 | ❌ Fail: 0 | ⬜ Belum: 0
