# Dokumen Pengujian Black-Box Testing
## Aplikasi POS PWA (Point of Sale Progressive Web App)

---

## 1. Pendahuluan

### 1.1 Tujuan Pengujian

Dokumen ini bertujuan untuk mendokumentasikan hasil **Pengujian Black-Box** (*Black-Box Testing*) terhadap sistem POS PWA yang dikembangkan sebagai luaran penelitian tugas akhir. Pengujian dilakukan untuk memvalidasi bahwa seluruh fungsionalitas sistem berperilaku sesuai dengan spesifikasi kebutuhan yang telah ditetapkan, tanpa mempertimbangkan struktur kode internal.

### 1.2 Ruang Lingkup

Pengujian mencakup **7 modul fungsional** utama sistem POS PWA:

| Kode | Modul | Deskripsi |
|------|-------|-----------|
| F-01 | Autentikasi | Proses login, logout, dan proteksi rute |
| F-02 | Beranda (*Home Hub*) | Dasbor akses cepat dengan statistik ringkas |
| F-03 | Dashboard Analitik | Grafik dan statistik penjualan |
| F-04 | Kasir (*Point of Sale*) | Transaksi, keranjang, pembayaran, dan struk |
| F-05 | Manajemen Produk | CRUD produk dan kelola kategori |
| F-06 | Laporan | Riwayat dan filter transaksi |
| F-07 | Pengaturan | Info toko, printer, dan profil akun |

### 1.3 Metodologi

Pengujian menggunakan metode **Black-Box Testing** dengan pendekatan:

- **Equivalence Partitioning (EP):** Membagi domain input ke dalam kelas-kelas ekuivalen untuk mengurangi jumlah kasus uji tanpa mengorbankan cakupan.
- **Boundary Value Analysis (BVA):** Menguji nilai-nilai batas kritis pada setiap partisi input untuk mendeteksi kesalahan pada kondisi tepi.

**Kriteria Kelulusan:**
- `✅ Pass` — Sistem menghasilkan output yang identik dengan *Expected Output*
- `❌ Fail` — Sistem menghasilkan output yang berbeda dari *Expected Output*

### 1.4 Lingkungan Pengujian

| Parameter | Nilai |
|-----------|-------|
| Browser | Google Chrome (versi terbaru) |
| Mode | Desktop (≥1024px) dan Mobile (375px) |
| Koneksi | Online (WiFi) dan Offline (DevTools → Offline) |
| Sistem Operasi | Windows 11 |
| URL Aplikasi | `http://localhost:3000` (Development) |

---

## 2. Tabel Pengujian

### 2.1 F-01 — Autentikasi

> **Precondition Umum:** Aplikasi berjalan, halaman `/login` terbuka.

| ID | Nama Skenario | Precondition | Input | Expected Output | Hasil |
|----|---------------|--------------|-------|-----------------|-------|
| F-01-TC001 | Login dengan kredensial valid | Halaman `/login` terbuka, pengguna belum login | Email terdaftar + password benar, klik "Masuk" | Pengguna diarahkan ke halaman Beranda (`/`), tidak ada pesan error | ✅ Pass |
| F-01-TC002 | Login dengan email kosong | Halaman `/login` terbuka | Field email dibiarkan kosong, password diisi, klik "Masuk" | Muncul pesan validasi "Email tidak boleh kosong", form tidak terkirim | ✅ Pass |
| F-01-TC003 | Login dengan password kosong | Halaman `/login` terbuka | Email diisi, field password dibiarkan kosong, klik "Masuk" | Muncul pesan validasi "Password tidak boleh kosong", form tidak terkirim | ✅ Pass |
| F-01-TC004 | Login dengan password salah | Halaman `/login` terbuka, email terdaftar | Email terdaftar + password salah, klik "Masuk" | Muncul pesan error "Invalid login credentials", pengguna tetap di halaman login | ✅ Pass |
| F-01-TC005 | Login dengan email tidak terdaftar | Halaman `/login` terbuka | Email tidak terdaftar + password sembarang, klik "Masuk" | Muncul pesan error autentikasi, pengguna tetap di halaman login | ✅ Pass |
| F-01-TC006 | Akses halaman terproteksi tanpa login | Pengguna belum login | Navigasi langsung ke URL `/products` atau `/pos` | Sistem otomatis mengarahkan pengguna ke halaman `/login` | ✅ Pass |
| F-01-TC007 | Logout berhasil | Pengguna sudah login, berada di halaman mana pun | Klik tombol logout / avatar pengguna → pilih "Keluar" | Session dihapus, pengguna diarahkan ke `/login`, halaman terproteksi tidak dapat diakses | ✅ Pass |
| F-01-TC008 | Session persisten setelah refresh | Pengguna sudah login | Tekan `F5` atau reload halaman browser | Pengguna tetap dalam keadaan terlogin, tidak diarahkan ke `/login` | ✅ Pass |

---

### 2.2 F-02 — Beranda (*Home Hub*)

> **Precondition Umum:** Pengguna sudah login, berada di halaman Beranda (`/`).

| ID | Nama Skenario | Precondition | Input | Expected Output | Hasil |
|----|---------------|--------------|-------|-----------------|-------|
| F-02-TC001 | Sapaan dinamis sesuai waktu | Sudah login, membuka halaman Beranda | Akses halaman pukul 06.00–11.59 | Komponen *GreetingBanner* menampilkan teks "Selamat Pagi," diikuti nama toko | ✅ Pass |
| F-02-TC002 | MiniStats menampilkan data hari ini | Sudah login, terdapat transaksi hari ini | Halaman Beranda dibuka | Kartu "Omzet Hari Ini" menampilkan nilai Rp dan "Total Transaksi" menampilkan angka sesuai data server | ✅ Pass |
| F-02-TC003 | Badge status koneksi Online | Sudah login, koneksi internet aktif | Halaman Beranda dibuka dengan koneksi normal | Badge menampilkan indikator hijau dan teks "Online" | ✅ Pass |
| F-02-TC004 | Navigasi QuickAction ke Kasir | Sudah login, berada di Beranda | Klik kartu "Mulai Kasir" pada *QuickActionGrid* | Pengguna diarahkan ke halaman Kasir (`/pos`) | ✅ Pass |
| F-02-TC005 | Navigasi QuickAction ke Produk | Sudah login, berada di Beranda | Klik kartu "Kelola Produk" pada *QuickActionGrid* | Pengguna diarahkan ke halaman Manajemen Produk (`/products`) | ✅ Pass |
| F-02-TC006 | Tab navigasi Beranda aktif (Mobile) | Sudah login, layar ≤768px | Halaman Beranda dibuka di perangkat mobile | Tab "Beranda" pada *Bottom Tab Bar* aktif (berwarna/tebal), tab lain tidak aktif | ✅ Pass |

---

### 2.3 F-03 — Dashboard Analitik

> **Precondition Umum:** Pengguna sudah login, berada di halaman Dashboard (`/dashboard`).

| ID | Nama Skenario | Precondition | Input | Expected Output | Hasil |
|----|---------------|--------------|-------|-----------------|-------|
| F-03-TC001 | Empat kartu statistik tampil | Sudah login, halaman Dashboard dibuka | — (halaman di-load) | Empat StatsCard ditampilkan: Omzet Hari Ini, Total Transaksi, Rata-rata/Transaksi, Menu Terlaris | ✅ Pass |
| F-03-TC002 | Grafik pendapatan 7 hari tampil | Sudah login, halaman Dashboard dibuka | — (halaman di-load) | *RevenueChart* menampilkan 7 batang grafik dengan label hari (Sen–Min) | ✅ Pass |
| F-03-TC003 | Filter periode grafik berfungsi | Sudah login, grafik tampil | Pilih opsi "30 Hari" dari dropdown filter grafik | Grafik memperbarui data dan menampilkan 30 titik data periode yang dipilih | ✅ Pass |
| F-03-TC004 | Daftar produk terlaris tampil | Sudah login, terdapat transaksi | — (halaman di-load) | Komponen *TopProducts* menampilkan maksimal 5 produk terlaris dengan progress bar relatif | ✅ Pass |
| F-03-TC005 | Item sidebar Dashboard aktif | Sudah login, berada di halaman Dashboard | — | Item navigasi "Dashboard" pada sidebar (desktop) ditampilkan dalam keadaan aktif/terpilih | ✅ Pass |

---

### 2.4 F-04 — Kasir (*Point of Sale*)

> **Precondition Umum:** Pengguna sudah login, berada di halaman Kasir (`/pos`), terdapat produk tersedia.

| ID | Nama Skenario | Precondition | Input | Expected Output | Hasil |
|----|---------------|--------------|-------|-----------------|-------|
| F-04-TC001 | Filter produk berdasarkan kategori | Terdapat produk dari minimal 2 kategori | Klik tab kategori "Minuman" | Katalog hanya menampilkan produk dari kategori "Minuman" | ✅ Pass |
| F-04-TC002 | Tambah produk ke keranjang | Keranjang kosong | Klik tombol "+" pada produk "Kopi Hitam" | Produk masuk keranjang dengan qty=1, total tagihan diperbarui | ✅ Pass |
| F-04-TC003 | Tambah produk yang sudah ada di keranjang | Produk A sudah ada di keranjang (qty=1) | Klik tombol "+" pada produk A yang sama | Qty produk di keranjang bertambah menjadi 2, tidak terjadi duplikasi baris | ✅ Pass |
| F-04-TC004 | Ubah qty item di keranjang | Produk A di keranjang (qty=2) | Ketik angka "5" pada input qty item A | Qty berubah menjadi 5, total tagihan dihitung ulang secara otomatis | ✅ Pass |
| F-04-TC005 | Hapus satu item dari keranjang | Keranjang berisi 2 item | Klik tombol hapus (ikon tempat sampah) pada item B | Item B dihapus dari keranjang, item A tetap ada, total diperbarui | ✅ Pass |
| F-04-TC006 | Kosongkan keranjang — muncul konfirmasi | Keranjang berisi minimal 1 item | Klik tombol "Kosongkan" | Muncul *AlertDialog* konfirmasi dengan teks "Kosongkan semua pesanan?" beserta tombol "Ya, Kosongkan" dan "Batal" | ✅ Pass |
| F-04-TC007 | Konfirmasi kosongkan keranjang | *AlertDialog* konfirmasi terbuka | Klik tombol "Ya, Kosongkan" | Semua item dihapus dari keranjang, keranjang menjadi kosong, dialog tertutup | ✅ Pass |
| F-04-TC008 | Batal kosongkan keranjang | *AlertDialog* konfirmasi terbuka | Klik tombol "Batal" | Dialog tertutup, keranjang tidak berubah, semua item tetap ada | ✅ Pass |
| F-04-TC009 | Tambah catatan pada item | Produk A ada di keranjang | Klik ikon catatan pada item A → ketik "Tanpa gula" → klik "Simpan" | Catatan "Tanpa gula" tersimpan, ikon catatan pada item A berubah (teraktivasi) | ✅ Pass |
| F-04-TC010 | Split qty dari modal catatan | Produk A di keranjang (qty=3) | Buka catatan A → ubah split qty menjadi 2 → simpan | Produk A terpecah menjadi 2 baris: 1 item dengan catatan (qty=2) dan 1 item tanpa catatan (qty=1) | ✅ Pass |
| F-04-TC011 | Floating cart button muncul di mobile | Layar ≤768px, keranjang berisi item | Tambah produk ke keranjang | Muncul tombol melayang di atas *Bottom Tab Bar* yang menampilkan jumlah item dan total tagihan | ✅ Pass |
| F-04-TC012 | Checkout dengan metode CASH | Keranjang berisi item, buka *CheckoutModal* | Pilih metode "Tunai", masukkan nominal bayar Rp 20.000 (total Rp 15.000) | Informasi kembalian Rp 5.000 ditampilkan, tombol "Proses" aktif | ✅ Pass |
| F-04-TC013 | Checkout dengan metode QRIS | Keranjang berisi item, buka *CheckoutModal* | Pilih metode "QRIS" | Field nominal bayar disembunyikan/tidak relevan, tombol "Proses" langsung aktif | ✅ Pass |
| F-04-TC014 | Validasi pembayaran kurang dari total | Keranjang berisi item, total Rp 15.000 | Pilih metode "Tunai", masukkan nominal bayar Rp 10.000 | Tombol "Proses Pembayaran" tetap nonaktif atau muncul pesan peringatan pembayaran kurang | ✅ Pass |
| F-04-TC015 | Proses transaksi saat koneksi online | Keranjang terisi, checkout siap, koneksi online | Klik "Proses Pembayaran" | *CheckoutModal* tertutup, *ReceiptModal* terbuka menampilkan nomor invoice dan detail transaksi | ✅ Pass |
| F-04-TC016 | Proses transaksi saat offline | Keranjang terisi, checkout siap, koneksi dimatikan via DevTools | Klik "Proses Pembayaran" | Transaksi tersimpan di *IndexedDB* lokal, *ReceiptModal* terbuka, setelah selesai muncul *toast* "Transaksi Tersimpan Lokal" | ✅ Pass |
| F-04-TC017 | Struk menampilkan informasi lengkap | Transaksi berhasil diproses | — (*ReceiptModal* terbuka) | Struk menampilkan: nomor invoice, tanggal/waktu transaksi, daftar item beserta qty dan harga, total tagihan, dan metode pembayaran | ✅ Pass |
| F-04-TC018 | Keranjang kosong setelah transaksi selesai | *ReceiptModal* terbuka setelah transaksi sukses | Klik tombol "Selesai" pada *ReceiptModal* | *ReceiptModal* tertutup, keranjang kembali kosong, halaman kasir siap untuk transaksi berikutnya | ✅ Pass |

---

### 2.5 F-05 — Manajemen Produk

> **Precondition Umum:** Pengguna sudah login, membuka halaman Produk (`/products`).

| ID | Nama Skenario | Precondition | Input | Expected Output | Hasil |
|----|---------------|--------------|-------|-----------------|-------|
| F-05-TC001 | Daftar produk tampil di tabel | Terdapat minimal 1 produk di database | — (halaman di-load) | Tabel menampilkan daftar produk dengan kolom: Nama, Kategori, Harga, Status, Aksi | ✅ Pass |
| F-05-TC002 | Pencarian produk berdasarkan nama | Terdapat produk dengan nama "Kopi Hitam" | Ketik "Kopi" pada *search bar* | Tabel hanya menampilkan produk yang mengandung kata "Kopi" secara *real-time* | ✅ Pass |
| F-05-TC003 | Tambah produk dengan data valid | Form tambah produk (`ProductFormModal`) terbuka | Nama: "Es Lemon Tea", Kategori: "Minuman", Harga: 8000, Status: Aktif → klik "Simpan" | Modal tertutup, produk baru muncul di daftar, muncul notifikasi sukses | ✅ Pass |
| F-05-TC004 | Tambah produk — nama kosong | Form tambah produk terbuka | Field nama dibiarkan kosong, isi field lainnya → klik "Simpan" | Muncul pesan validasi di bawah field nama ("Nama produk wajib diisi"), form tidak tersimpan | ✅ Pass |
| F-05-TC005 | Tambah produk — harga nol (0) | Form tambah produk terbuka | Nama diisi, Harga: 0 → klik "Simpan" | Muncul pesan validasi "Harga harus lebih dari 0", form tidak tersimpan | ✅ Pass |
| F-05-TC006 | Tambah produk — harga negatif | Form tambah produk terbuka | Nama diisi, Harga: -5000 → klik "Simpan" | Muncul pesan validasi, form tidak tersimpan | ✅ Pass |
| F-05-TC007 | Tambah produk — kategori tidak dipilih | Form tambah produk terbuka | Nama dan Harga diisi, Kategori tidak dipilih → klik "Simpan" | Muncul pesan validasi "Kategori wajib dipilih", form tidak tersimpan | ✅ Pass |
| F-05-TC008 | Edit produk yang sudah ada | Terdapat produk "Kopi Susu" di daftar | Klik tombol edit produk "Kopi Susu" → ubah harga menjadi 7000 → klik "Simpan" | Modal tertutup, harga produk "Kopi Susu" diperbarui menjadi Rp 7.000 di tabel | ✅ Pass |
| F-05-TC009 | Hapus produk — muncul dialog konfirmasi | Terdapat produk di daftar | Klik tombol hapus (ikon merah) pada suatu produk | Muncul *AlertDialog* konfirmasi penghapusan produk dengan tombol "Hapus" dan "Batal" | ✅ Pass |
| F-05-TC010 | Konfirmasi hapus produk berhasil | *AlertDialog* hapus terbuka | Klik tombol "Hapus" / "Ya, Hapus" | Produk dihapus dari daftar, muncul notifikasi sukses | ✅ Pass |
| F-05-TC011 | Batal hapus produk | *AlertDialog* hapus terbuka | Klik tombol "Batal" | Dialog tertutup, produk tidak dihapus, daftar tidak berubah | ✅ Pass |
| F-05-TC012 | Toggle status produk menjadi Nonaktif | Terdapat produk berstatus Aktif | Klik *toggle* status pada produk aktif | Status produk berubah menjadi "Tidak Tersedia", produk tidak tampil di katalog kasir | ✅ Pass |
| F-05-TC013 | Tambah kategori baru | Modal Kelola Kategori terbuka | Ketik "Dessert" pada field kategori baru → klik "Tambah" | Kategori "Dessert" muncul di daftar kategori dan tersedia di *dropdown* form produk | ✅ Pass |
| F-05-TC014 | Hapus kategori yang sudah ada | Terdapat kategori "Snack" di daftar | Klik tombol hapus pada kategori "Snack" → konfirmasi | Kategori "Snack" dihapus dari daftar | ✅ Pass |

---

### 2.6 F-06 — Laporan

> **Precondition Umum:** Pengguna sudah login, membuka halaman Laporan (`/reports`).

| ID | Nama Skenario | Precondition | Input | Expected Output | Hasil |
|----|---------------|--------------|-------|-----------------|-------|
| F-06-TC001 | Daftar transaksi hari ini tampil | Terdapat minimal 1 transaksi pada hari ini | — (halaman di-load) | Halaman menampilkan daftar transaksi hari ini secara *default* | ✅ Pass |
| F-06-TC002 | Filter laporan berdasarkan tanggal kemarin | Terdapat transaksi pada hari sebelumnya | Pilih tanggal kemarin pada filter kalender | Daftar transaksi diperbarui menampilkan hanya transaksi dari tanggal yang dipilih | ✅ Pass |
| F-06-TC003 | Filter laporan berdasarkan periode minggu | — | Pilih opsi filter "Minggu Ini" atau pilih rentang 7 hari | Daftar transaksi menampilkan semua transaksi dalam rentang 7 hari tersebut | ✅ Pass |
| F-06-TC004 | Detail transaksi lengkap | Terdapat transaksi di daftar | Klik baris transaksi atau ikon detail | Tampil detail: daftar item pesanan (nama, qty, harga), total, metode pembayaran, tanggal/waktu | ✅ Pass |
| F-06-TC005 | Transaksi offline tersinkronisasi muncul | Terdapat transaksi yang disimpan offline | Koneksi online kembali aktif, buka halaman Laporan | Transaksi yang sebelumnya offline (telah tersinkronisasi) muncul di daftar laporan | ✅ Pass |
| F-06-TC006 | Laporan kosong pada hari tanpa transaksi | Tidak ada transaksi pada tanggal tertentu | Pilih tanggal di mana tidak ada transaksi | Halaman menampilkan pesan atau tampilan *empty state* "Belum ada transaksi" | ✅ Pass |

---

### 2.7 F-07 — Pengaturan

> **Precondition Umum:** Pengguna sudah login, membuka halaman Pengaturan (`/settings`).

| ID | Nama Skenario | Precondition | Input | Expected Output | Hasil |
|----|---------------|--------------|-------|-----------------|-------|
| F-07-TC001 | Tab Info Toko tampil dengan data tersimpan | Pengguna memiliki data toko tersimpan | Buka tab/panel "Info Toko" | Form menampilkan nilai tersimpan: nama toko, alamat, nomor telepon | ✅ Pass |
| F-07-TC002 | Simpan info toko dengan data valid | Tab "Info Toko" aktif | Ubah nama toko menjadi nama baru, klik "Simpan" | Muncul notifikasi sukses, data toko diperbarui | ✅ Pass |
| F-07-TC003 | Simpan info toko — nama toko kosong | Tab "Info Toko" aktif | Hapus isi field nama toko, klik "Simpan" | Muncul pesan validasi "Nama toko wajib diisi", data tidak tersimpan | ✅ Pass |
| F-07-TC004 | Test print printer (tab Printer) | Tab "Printer" aktif, printer terkonfigurasi | Klik tombol "Test Print" | Sistem mengirim perintah cetak ke printer yang terkonfigurasi | ✅ Pass |
| F-07-TC005 | Email akun ditampilkan sebagai read-only | Tab "Akun" aktif | — (panel di-load) | Field email ditampilkan dengan nilai email pengguna yang login, field tidak dapat diubah (read-only) | ✅ Pass |
| F-07-TC006 | Ubah Display Name dengan nama baru valid | Tab "Akun" aktif | Hapus nama lama, isi field "Nama Tampilan" dengan "Mie Jawa Melati", klik "Simpan" | Muncul notifikasi sukses, nama tampilan diperbarui | ✅ Pass |
| F-07-TC007 | Ubah Display Name — field kosong | Tab "Akun" aktif | Kosongkan field "Nama Tampilan", klik "Simpan" | Muncul pesan validasi, data tidak tersimpan | ✅ Pass |
| F-07-TC008 | Ganti password — password lama benar | Tab "Akun" aktif, bagian ganti password | Isi "Password Lama" dengan password saat ini yang benar, isi "Password Baru" dan "Konfirmasi Password" yang sama, klik "Simpan" | Muncul notifikasi sukses perubahan password | ✅ Pass |
| F-07-TC009 | Ganti password — password lama salah | Tab "Akun" aktif | Isi "Password Lama" dengan nilai yang salah, klik "Simpan" | Muncul pesan error bahwa password lama tidak cocok, password tidak diubah | ✅ Pass |
| F-07-TC010 | Ganti password — password baru terlalu pendek | Tab "Akun" aktif | Isi "Password Baru" dengan 5 karakter, klik "Simpan" | Muncul pesan validasi "Password minimal 8 karakter", password tidak diubah | ✅ Pass |
| F-07-TC011 | Ganti password — konfirmasi tidak cocok | Tab "Akun" aktif | Isi "Password Baru": "abcdefgh", "Konfirmasi": "12345678", klik "Simpan" | Muncul pesan validasi "Konfirmasi password tidak cocok", password tidak diubah | ✅ Pass |
| F-07-TC012 | Navigasi antar tab Pengaturan | Halaman Pengaturan terbuka | Klik tab "Printer" (sebelumnya di "Info Toko") | Panel konten beralih menampilkan pengaturan Printer, tab "Printer" menjadi aktif | ✅ Pass |
| F-07-TC013 | Tab "Akun" dihapus dari sidebar halaman `/settings` (Desktop) | Pengguna sudah login, buka `/settings` di viewport ≥1024px | — (halaman di-load) | Sidebar navigasi halaman Pengaturan hanya menampilkan tab "Info Toko" dan "Printer". Tab "Akun" sudah tidak ada. | ✅ Pass |
| F-07-TC014 | Tab "Akun" di navigasi bawah membuka Drawer (Mobile) | Pengguna sudah login, viewport ≤768px | Tap tab "Akun" pada *Bottom Tab Bar* | Muncul *Shadcn Drawer* dari bawah yang menampilkan inisial, email, role, serta item "Edit Profil", "Pengaturan Toko", dan "Keluar" | ✅ Pass |
| F-07-TC015 | "Edit Profil" dari Drawer mobile membuka form akun secara internal | Drawer Akun aktif di mobile | Tap tombol "Edit Profil" di dalam Drawer | Drawer **tidak** menutup dan **tidak** berpindah halaman. Konten drawer langsung berganti menampilkan form profil akun (nama tampilan & ganti password) | ✅ Pass |
| F-07-TC016 | Tombol kembali dari form profil mengembalikan ke tampilan Drawer | Form profil akun tampil di dalam Drawer | Tap tombol "Kembali" | Konten Drawer kembali ke tampilan menu utama (Edit Profil, Pengaturan Toko, Keluar) | ✅ Pass |
| F-07-TC017 | Logout dari Drawer mobile berhasil | Drawer Akun aktif di mobile | Tap tombol "Keluar" (warna merah) | Sesi dihapus (`signOut()`), pengguna diredirect ke halaman `/login` tanpa reload berulang | ✅ Pass |
| F-07-TC018 | Dropdown profil muncul di AppSidebar (Desktop) | Pengguna sudah login, viewport ≥1024px, sidebar aplikasi terlihat | Klik area avatar/nama pengguna di bagian bawah *AppSidebar* utama | Muncul *DropdownMenu Shadcn* tepat di atas area klik, menampilkan opsi "Edit Profil" dan "Keluar" | ✅ Pass |
| F-07-TC019 | Klik "Edit Profil" dari Dropdown membuka Dialog (Desktop) | *DropdownMenu* AppSidebar terbuka | Klik opsi "Edit Profil" | Muncul modal *Shadcn Dialog* yang memuat form profil akun lengkap tanpa merusak layout halaman di belakangnya | ✅ Pass |

---

## 3. Rekapitulasi Hasil Pengujian

| Kode | Modul | Total TC | Pass | Fail | % Keberhasilan |
|------|-------|----------|------|------|----------------|
| F-01 | Autentikasi | 8 | 8 | 0 | 100% |
| F-02 | Beranda | 6 | 6 | 0 | 100% |
| F-03 | Dashboard Analitik | 5 | 5 | 0 | 100% |
| F-04 | Kasir (*Point of Sale*) | 18 | 18 | 0 | 100% |
| F-05 | Manajemen Produk | 14 | 14 | 0 | 100% |
| F-06 | Laporan | 6 | 6 | 0 | 100% |
| F-07 | Pengaturan | 19 | 19 | 0 | 100% |
| | **TOTAL** | **76** | **76** | **0** | **100%** |

### Kesimpulan

Berdasarkan hasil pengujian *black-box* yang telah dilakukan terhadap **76 kasus uji** yang mencakup 7 modul fungsional utama aplikasi POS PWA, seluruh kasus uji menghasilkan output yang sesuai dengan *expected output* yang telah ditetapkan. Tingkat keberhasilan pengujian mencapai **100%**, yang menandakan bahwa sistem telah memenuhi seluruh spesifikasi kebutuhan fungsional yang dirancang.

Pengujian mencakup skenario positif (input valid) maupun skenario negatif (validasi input tidak valid, kondisi *offline*, dan kondisi batas), sehingga memberikan kepercayaan yang memadai bahwa sistem siap untuk digunakan pada lingkungan nyata.

---

*Dokumen ini dibuat sebagai bagian dari penelitian tugas akhir / skripsi pengembangan Sistem POS Progressive Web App.*
