# HASIL BLACKBOX TESTING - SESI 2: Beranda / Home Hub (F-02)

## 📌 Informasi Pengujian
- **Tanggal:** 15 April 2026
- **Modul:** Beranda / Home Hub (F-02)
- **Viewport:** Desktop (1280×800) & Mobile (375×812) untuk TC009
- **Persentase Kelulusan:** 100% (9/9 TC Pass)
- **Metode Eksekusi:** Otomatis via Chrome DevTools MCP

---

## 📊 Detail Hasil Eksekusi

| NO | Skenario Pengujian | Langkah-langkah | Hasil Diharapkan | Hasil Diperoleh | Hasil Pengujian | Screenshot |
|----|-------------------|-----------------|------------------|-----------------|-----------------|------------|
| **F-02-TC001** | Sapaan dinamis waktu pagi | 1. Pastikan jam sistem pukul 06.00–11.59<br>2. Navigasi ke `/` (Beranda) | Komponen *GreetingBanner* menampilkan "Selamat Pagi," diikuti nama toko | GreetingBanner menampilkan "Selamat Pagi," diikuti nama toko sesuai kondisi waktu pagi. | ✅ PASS | `docs/screenshots/F02/TC001-after.png` |
| **F-02-TC002** | Sapaan dinamis waktu siang | 1. Akses saat pukul 12.00–14.59 (atau inject mock waktu)<br>2. Navigasi ke `/` | Komponen menampilkan "Selamat Siang," diikuti nama toko | GreetingBanner menampilkan "Selamat Siang," diikuti nama toko saat diakses di rentang waktu siang. | ✅ PASS | `docs/screenshots/F02/TC002-after.png` |
| **F-02-TC003** | Sapaan dinamis waktu sore/malam | 1. Akses saat pukul 15.00–23.59<br>2. Navigasi ke `/` | Komponen menampilkan "Selamat Sore" atau "Selamat Malam," diikuti nama toko | GreetingBanner menampilkan "Selamat Malam," diikuti nama toko saat diakses di rentang waktu malam. | ✅ PASS | `docs/screenshots/F02/TC003-after.png` |
| **F-02-TC004** | MiniStats hari ini tampil | 1. Pastikan terdapat transaksi hari ini<br>2. Navigasi ke `/` | Kartu "Omzet Hari Ini" menampilkan nilai Rp, kartu "Total Transaksi" menampilkan angka | Kartu "Omzet Hari Ini" menampilkan Rp 7.000, kartu "Total Transaksi" menampilkan angka 5 sesuai data DB. | ✅ PASS | `docs/screenshots/F02/TC004-after.png` |
| **F-02-TC005** | Badge status Online | 1. Pastikan koneksi internet aktif<br>2. Navigasi ke `/` | Badge menampilkan indikator hijau dan teks "Online" | Badge menampilkan indikator hijau dan teks "Online" saat koneksi internet aktif. | ✅ PASS | `docs/screenshots/F02/TC005-after.png` |
| **F-02-TC006** | Badge status Offline | 1. Emulate network Offline via DevTools<br>2. Navigasi ke `/`<br>3. Reset network setelah uji | Badge berubah menampilkan indikator abu/merah dan teks "Offline" | Badge beralih ke indikator abu dan teks "Offline" setelah jaringan diemulasi offline via DevTools. | ✅ PASS | `docs/screenshots/F02/TC006-after.png` |
| **F-02-TC007** | QuickAction navigasi ke Kasir | 1. Di halaman Beranda<br>2. Klik kartu "Mulai Kasir" pada *QuickActionGrid* | User diarahkan ke halaman Kasir (`/pos`) | User berhasil diarahkan ke `/pos` setelah mengklik kartu "Mulai Kasir". | ✅ PASS | `docs/screenshots/F02/TC007-after.png` |
| **F-02-TC008** | QuickAction navigasi ke Produk | 1. Navigasi ke `/`<br>2. Klik kartu "Kelola Produk" pada *QuickActionGrid* | User diarahkan ke halaman Manajemen Produk (`/products`) | User berhasil diarahkan ke `/products` setelah mengklik kartu "Kelola Produk". | ✅ PASS | `docs/screenshots/F02/TC008-after.png` |
| **F-02-TC009** | Tab Beranda aktif di Mobile | 1. Emulate mobile viewport (375×812)<br>2. Navigasi ke `/` | Tab "Beranda" pada Bottom Tab Bar tampil dalam kondisi aktif (berwarna/tebal), tab lain tidak aktif | Tab "Beranda" pada Bottom Tab Bar tampil aktif (berwarna) saat diemulasi mobile. Tab lain dalam kondisi tidak aktif. | ✅ PASS | `docs/screenshots/F02/TC009-after.png` |

---

## 📝 Catatan & Temuan

- Sapaan waktu berhasil dimodifikasi via simulasi jam (script injection) untuk menguji kondisi pagi dan siang hari.
- Status Offline berhasil dideteksi dengan tepat menggunakan emulasi jaringan DevTools — badge berpindah dari "Online" ke "Offline" secara reaktif.
- Semua navigasi QuickAction ke `/pos` dan `/products` berfungsi tanpa delay atau error.
