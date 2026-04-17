# HASIL BLACKBOX TESTING - SESI 3: Dashboard Analitik (F-03)

## 📌 Informasi Pengujian
- **Tanggal:** 15 April 2026
- **Modul:** Dashboard Analitik (F-03)
- **Viewport:** Desktop (1280×800)
- **Persentase Kelulusan:** 100% (7/7 TC Pass)
- **Metode Eksekusi:** Otomatis via Chrome DevTools MCP

---

## 📊 Detail Hasil Eksekusi

| NO | Skenario Pengujian | Langkah-langkah | Hasil Diharapkan | Hasil Diperoleh | Hasil Pengujian | Screenshot |
|----|-------------------|-----------------|------------------|-----------------|-----------------|------------|
| **F-03-TC001** | 4 StatsCard tampil di Dashboard | 1. Navigasi ke `/dashboard`<br>2. Periksa komponen kartu statistik | 4 kartu statistik (Omzet, Total Transaksi, Rata-rata, Menu Terlaris) tampil dengan nilai dari DB | 4 kartu statistik tampil lengkap: Omzet, Total Transaksi, Rata-rata Transaksi, dan Menu Terlaris — semuanya terisi dengan data riil dari Supabase. | ✅ PASS | `docs/screenshots/F03/TC001-after.png` |
| **F-03-TC002** | Grafik 7 Hari Terakhir | 1. Navigasi ke `/dashboard`<br>2. Amati grafik RevenueChart | Grafik RevenueChart tampil dengan default filter 7 hari terakhir | Grafik 7 Hari Terakhir tampil secara default dengan data bar/line sesuai periode. | ✅ PASS | `docs/screenshots/F03/TC002-after.png` |
| **F-03-TC003** | Filter grafik 30 hari | 1. Klik dropdown filter periode<br>2. Pilih "30 Hari Terakhir" | Grafik memperbarui rentang tampilan data menjadi 30 titik | Grafik RevenueChart berhasil memperbarui span ke 30 hari. Sumbu X menyesuaikan label tanggal. | ✅ PASS | `docs/screenshots/F03/TC003-after.png` |
| **F-03-TC004** | Filter grafik 90 hari | 1. Klik dropdown filter periode<br>2. Pilih "90 Hari Terakhir" | Grafik memperbarui rentang tampilan data menjadi 90 titik | Grafik RevenueChart berhasil memuat rentang 90 hari dengan data lebih padat. | ✅ PASS | `docs/screenshots/F03/TC004-after.png` |
| **F-03-TC005** | TopProducts (Penjualan Teratas) tampil | 1. Navigasi ke `/dashboard`<br>2. Periksa komponen daftar produk terlaris | Komponen "Penjualan Menu Teratas" merender daftar produk terlaris dengan progress bar | Komponen Top Products tampil dengan daftar produk berikut progress bar persentase penjualan tiap item. | ✅ PASS | `docs/screenshots/F03/TC005-after.png` |
| **F-03-TC006** | Item sidebar "Dashboard" aktif | 1. Navigasi ke `/dashboard`<br>2. Periksa status item navigasi di sidebar | Item "Dashboard" atau "Beranda" di sidebar ditandai aktif (bold/berwarna) | Item navigasi "Dashboard" di sidebar dalam kondisi aktif (disorot) saat berada di halaman `/dashboard`. | ✅ PASS | `docs/screenshots/F03/TC006-after.png` |
| **F-03-TC007** | Live update StatsCard setelah transaksi | 1. Buka tab baru `/pos`<br>2. Proses 1 transaksi baru<br>3. Kembali ke `/dashboard` | Nilai StatsCard (Omzet) bertambah sesuai transaksi yang baru diproses | Nilai Omzet meningkat dari Rp 7.000 menjadi Rp 11.000 setelah transaksi baru. React Query invalidation (refetch on focus) berhasil memperbarui data secara otomatis. | ✅ PASS | `docs/screenshots/F03/TC007-after.png` |

---

## 📝 Catatan & Temuan

- Semua data statistik bersumber langsung dari Supabase — tidak ada data *mock* yang digunakan.
- React Query *refetch on window focus* berfungsi sebagai mekanisme *live invalidation*: saat user kembali ke tab dashboard setelah transaksi, data diperbarui otomatis tanpa perlu refresh manual.
- Filter grafik (7/30/90 hari) memperbarui query ke backend secara dinamis tanpa reload halaman.
