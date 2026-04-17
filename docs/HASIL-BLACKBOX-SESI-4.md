# HASIL BLACKBOX TESTING - SESI 4: Kasir POS — Keranjang (F-04 Bagian 1)

## 📌 Informasi Pengujian
- **Tanggal:** 15 April 2026
- **Modul:** Kasir Point of Sale — Bagian 1: Keranjang (F-04)
- **Viewport:** Desktop (1280×800) & Mobile (375×812) untuk TC012
- **Persentase Kelulusan:** 100% (12/12 TC Pass)
- **Metode Eksekusi:** Otomatis via Chrome DevTools MCP

---

## 📊 Detail Hasil Eksekusi

| NO | Skenario Pengujian | Langkah-langkah | Hasil Diharapkan | Hasil Diperoleh | Hasil Pengujian | Screenshot |
|----|-------------------|-----------------|------------------|-----------------|-----------------|------------|
| **F-04-TC001** | Filter kategori produk | 1. Navigasi ke `/pos`<br>2. Klik tab kategori "Minuman" | Katalog hanya menampilkan produk dari kategori "Minuman" | Katalog memfilter dan hanya menampilkan produk dari kategori "Minuman" secara real-time. | ✅ PASS | `docs/screenshots/F04/TC001.png` |
| **F-04-TC002** | Filter "Semua" menampilkan semua produk | 1. Klik tab "Semua" | Semua produk aktif kembali tampil di katalog | Semua produk aktif tampil setelah klik tab "Semua". Filter category di-reset. | ✅ PASS | `docs/screenshots/F04/TC002.png` |
| **F-04-TC003** | Tambah produk ke keranjang | 1. Klik tombol "+" pada produk "Kopi Hitam" | Produk masuk keranjang (qty=1), total diperbarui | Keranjang memuat item baru dengan qty=1 dan total harga diperbarui secara otomatis. | ✅ PASS | `docs/screenshots/F04/TC003.png` |
| **F-04-TC004** | Tambah produk duplikat (tidak ada baris ganda) | 1. Klik "+" pada produk yang sudah ada di keranjang | Qty bertambah menjadi 2, tidak ada baris duplikat | Qty item berubah dari 1 ke 2 tanpa membuat baris baru. Total dihitung ulang dengan benar. | ✅ PASS | `docs/screenshots/F04/TC004.png` |
| **F-04-TC005** | Ubah qty item di keranjang | 1. Klik/edit input qty pada item di keranjang<br>2. Ketik "5" | Qty berubah menjadi 5, total dihitung ulang | Input qty merespons perubahan langsung — qty berubah ke 5 dan total diperbarui sesuai. | ✅ PASS | `docs/screenshots/F04/TC005.png` |
| **F-04-TC006** | Hapus satu item dari keranjang | 1. Klik ikon tempat sampah (Trash) pada salah satu item | Item terhapus dari keranjang, item lain tetap ada | Item berhasil dihapus dari keranjang. Item lain tidak terpengaruh, total diperbarui. | ✅ PASS | `docs/screenshots/F04/TC006.png` |
| **F-04-TC007** | Dialog konfirmasi muncul saat kosongkan keranjang | 1. Isi keranjang dengan beberapa item<br>2. Klik tombol "Kosongkan" | AlertDialog konfirmasi muncul sebelum tindakan dieksekusi | AlertDialog muncul dengan pertanyaan konfirmasi "Apakah Anda yakin ingin mengosongkan keranjang?". | ✅ PASS | `docs/screenshots/F04/TC007.png` |
| **F-04-TC008** | Konfirmasi kosongkan keranjang | 1. Saat AlertDialog muncul, klik "Ya, Kosongkan" | Keranjang menjadi kosong, total Rp 0 | Semua item dihapus dari keranjang. Teks "Keranjang masih kosong" tampil dan total kembali Rp 0. | ✅ PASS | `docs/screenshots/F04/TC008.png` |
| **F-04-TC009** | Batal kosongkan keranjang | 1. Klik "Kosongkan" untuk memunculkan dialog<br>2. Klik "Batal" di dialog | Dialog menutup, keranjang tidak berubah | AlertDialog menutup tanpa mengosongkan keranjang. Semua item tetap ada. | ✅ PASS | `docs/screenshots/F04/TC009.png` |
| **F-04-TC010** | Tambah catatan pada item | 1. Klik ikon catatan (Note) pada item<br>2. Isi catatan "Tanpa gula"<br>3. Klik "Simpan" | Ikon catatan teraktivasi (berubah warna), catatan tersimpan | Ikon catatan berubah status (teraktivasi). Catatan "Tanpa gula" tersimpan pada item keranjang. | ✅ PASS | `docs/screenshots/F04/TC010.png` |
| **F-04-TC011** | Split qty dari NoteModal | 1. Buka catatan item dengan qty=3<br>2. Ubah split qty menjadi 2<br>3. Simpan | Item terbagi menjadi 2 baris terpisah di keranjang | Keranjang memunculkan 2 baris terpisah sesuai split qty yang dipilih di NoteModal. | ✅ PASS | `docs/screenshots/F04/TC011.png` |
| **F-04-TC012** | Floating cart button di Mobile | 1. Emulate mobile (375×812)<br>2. Tambah produk ke keranjang | Tombol keranjang melayang (floating) muncul di atas bottom navigation bar | Floating cart button muncul di atas bottom bar dengan indikator jumlah item, sesuai desain mobile. | ✅ PASS | `docs/screenshots/F04/TC012.png` |

---

## 📝 Catatan & Temuan

- **Filter Kategori (TC001-TC002):** Filter tab berfungsi secara real-time tanpa delay — produk langsung difilter saat tab diklik.
- **Qty Handling (TC003-TC005):** Sistem berhasil menangani penambahan produk duplikat, edit qty langsung di input, dan penghapusan item individual.
- **Dialog Konfirmasi (TC007-TC009):** AlertDialog muncul konsisten sebelum operasi destruktif (kosongkan keranjang), mencegah penghapusan tidak disengaja.
- **Mobile Floating Cart (TC012):** Tombol floating hanya muncul saat keranjang tidak kosong — behavior kondisional ini terkonfirmasi berfungsi.
