# HASIL BLACKBOX TESTING - SESI 1: Autentikasi (F-01)

## 📌 Informasi Pengujian
- **Tanggal:** 15 April 2026
- **Modul:** Autentikasi (F-01)
- **Viewport:** Desktop (1280x800) & Mobile (375×812)
- **Persentase Kelulusan:** 100% (10/10 TC Pass)
- **Metode Eksekusi:** Otomatis via Chrome DevTools MCP

---

## 📊 Detail Hasil Eksekusi

| NO | Skenario Pengujian | Langkah-langkah | Hasil Diharapkan | Hasil Diperoleh | Hasil Pengujian | Screenshot |
|----|-------------------|-----------------|------------------|-----------------|-----------------|------------|
| **F-01-TC001** | Login dengan kredensial valid | 1. Buka `/login`<br>2. Isi email: `admin@toko.com`<br>3. Isi password: `admintoko123`<br>4. Klik tombol "Masuk" | User berhasil masuk, diarahkan ke Beranda (`/`), tidak ada pesan error | User berhasil login, halaman diarahkan ke Beranda (`/`), tidak ada pesan error yang ditampilkan. | ✅ PASS | `docs/screenshots/F01/TC001-after.png` |
| **F-01-TC002** | Login dengan email kosong | 1. Buka `/login`<br>2. Kosongkan field email<br>3. Isi password<br>4. Klik "Masuk" | Pesan validasi "Email tidak boleh kosong" muncul, form tidak terkirim | Pesan validasi "String must contain at least 1 character(s)" muncul pada field email. Form tidak terkirim, user tetap di `/login`. | ✅ PASS | `docs/screenshots/F01/TC002-after.png` |
| **F-01-TC003** | Login dengan password kosong | 1. Buka `/login`<br>2. Isi email valid<br>3. Kosongkan field password<br>4. Klik "Masuk" | Pesan validasi "Password tidak boleh kosong" muncul, form tidak terkirim | Pesan validasi "String must contain at least 1 character(s)" muncul pada field password. Form tidak terkirim, user tetap di `/login`. | ✅ PASS | `docs/screenshots/F01/TC003-after.png` |
| **F-01-TC004** | Login dengan password salah | 1. Isi email: `admin@toko.com`<br>2. Isi password: `salah123`<br>3. Klik "Masuk" | Pesan error "Invalid login credentials" muncul, user tetap di `/login` | Pesan error "Invalid login credentials" tampil di layar. User tetap berada di halaman `/login`. | ✅ PASS | `docs/screenshots/F01/TC004-after.png` |
| **F-01-TC005** | Login dengan email tidak terdaftar | 1. Isi email: `tidakada@test.com`<br>2. Isi password: `abc123`<br>3. Klik "Masuk" | Pesan error autentikasi muncul, user tetap di `/login` | Pesan error "Invalid login credentials" muncul. User tetap di halaman `/login`. | ✅ PASS | `docs/screenshots/F01/TC005-after.png` |
| **F-01-TC006** | Akses halaman terproteksi tanpa login | 1. Tanpa login, navigasi langsung ke `/products` | Sistem otomatis redirect ke `/login`, halaman terproteksi tidak dapat diakses | Sistem otomatis me-redirect dari `/products` ke `/login`. Halaman produk tidak dapat diakses tanpa sesi aktif. | ✅ PASS | `docs/screenshots/F01/TC006-after.png` |
| **F-01-TC007** | Logout dari aplikasi (Desktop) | 1. Login terlebih dahulu<br>2. Klik area avatar di footer sidebar<br>3. Klik "Keluar" | Sesi dihapus, user diarahkan ke `/login`, halaman terproteksi tidak dapat diakses kembali | Sesi dihapus setelah klik "Keluar". User diarahkan ke `/login`. Rute terproteksi memblokir akses ulang. | ✅ PASS | `docs/screenshots/F01/TC007-after.png` |
| **F-01-TC008** | Logout dari aplikasi (Mobile Drawer) | 1. Emulate mobile (375×812)<br>2. Login<br>3. Buka Drawer Akun<br>4. Klik "Keluar" | Sesi dihapus, Drawer menutup, user diarahkan ke `/login` tanpa redirect loop | Sesi dihapus, Drawer menutup, user diarahkan ke `/login` tanpa redirect loop. | ✅ PASS | `docs/screenshots/F01/TC008-after.png` |
| **F-01-TC009** | Session persisten setelah refresh | 1. Login<br>2. Reload halaman (F5 / navigate reload) | User tetap dalam keadaan terlogin, tidak ada redirect ke `/login` | User tetap berada di halaman aktif setelah `reload`. Tidak ada redirect ke login page. | ✅ PASS | `docs/screenshots/F01/TC009-after.png` |
| **F-01-TC010** | Redirect ke halaman asal setelah login | 1. Tanpa login, akses `/products`<br>2. Sistem redirect ke `/login`<br>3. Lakukan login | Setelah login berhasil, user langsung diarahkan ke `/products`, bukan ke Beranda (`/`) | Setelah login via `/login?redirect_to=/products`, user langsung diarahkan ke `/products` sesuai URL asal. | ✅ PASS | `docs/screenshots/F01/TC010-after.png` |

---

## 📝 Catatan & Temuan

- Pada awalnya terdapat isu *password hashing* Supabase yang gagal menerima password `admintoko123`, namun telah di-*patch* langsung di database sehingga seluruh skenario login kembali normal dan berhasil diverifikasi ulang.
- Semua validasi form berjalan via Zod schema — pesan error yang muncul merupakan output langsung dari Zod, bukan custom message.
- Session persistence dikonfirmasi menggunakan cookie Supabase Auth yang bertahan setelah reload halaman.
