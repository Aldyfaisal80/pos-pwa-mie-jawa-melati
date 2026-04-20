# Matriks Keterlacakan — Halaman Sistem ke Test Case Blackbox

> Dokumen ini memetakan setiap fitur dan halaman aplikasi POS ke test case pengujian blackbox
> yang bersesuaian, memastikan keterlacakan (*traceability*) antara dokumen implementasi dan
> dokumen pengujian dalam laporan skripsi.

---

## 1. Halaman Login

| ID Fitur | Deskripsi Fitur | Test Case | Kondisi Uji |
|----------|----------------|-----------|-------------|
| F-01 | Menampilkan formulir login dengan field email dan password | TC001 | Halaman login dapat diakses |
| F-02 | Login berhasil dengan kredensial valid | TC002 | Email dan password benar → redirect ke Beranda |
| F-03 | Login gagal dengan kredensial tidak valid | TC003 | Email atau password salah → pesan error tampil |
| F-04 | Redirect otomatis jika sudah login | TC004 | Pengguna yang sudah login diarahkan ke Beranda |
| F-05 | Proteksi rute oleh middleware server-side | TC004 | Akses langsung ke rute terproteksi dialihkan ke `/login` |

---

## 2. Halaman Beranda

| ID Fitur | Deskripsi Fitur | Test Case | Kondisi Uji |
|----------|----------------|-----------|-------------|
| F-06 | Menampilkan sapaan kontekstual berdasarkan waktu | TC005 | Sapaan berbeda sesuai rentang jam (Pagi/Siang/Sore/Malam) |
| F-07 | Menampilkan nama toko dari database | TC005 | Nama toko dari profil server tampil di banner |
| F-08 | Menampilkan waktu real-time (update tiap 60 detik) | TC005 | Jam diperbarui tanpa refresh halaman |
| F-09 | Indikator status koneksi Online/Offline | TC006 | Badge berganti saat koneksi diputus/disambung |
| F-10 | Kartu statistik "Omzet Hari Ini" menampilkan data | TC007 | Nilai omzet sesuai data transaksi hari ini dari server |
| F-11 | Kartu statistik "Total Transaksi" menampilkan data | TC007 | Jumlah transaksi sesuai data hari ini |
| F-12 | Navigasi cepat ke Kasir | TC008 | Klik "Mulai Kasir" → diarahkan ke `/pos` |
| F-13 | Navigasi cepat ke Produk | TC008 | Klik "Kelola Produk" → diarahkan ke `/products` |
| F-14 | Navigasi cepat ke Laporan | TC008 | Klik "Lihat Laporan" → diarahkan ke `/reports` |
| F-15 | Navigasi cepat ke Dashboard | TC008 | Klik "Dashboard" → diarahkan ke `/dashboard` |

---

## 3. Halaman Dashboard

| ID Fitur | Deskripsi Fitur | Test Case | Kondisi Uji |
|----------|----------------|-----------|-------------|
| F-16 | Kartu KPI "Omzet Hari Ini" tampil dengan data valid | TC009 | Nilai omzet terhitung benar dari data hari ini |
| F-17 | Kartu KPI "Total Transaksi" tampil | TC009 | Jumlah transaksi hari ini ditampilkan akurat |
| F-18 | Kartu KPI "Rata-rata per Transaksi" tampil | TC009 | Nilai rata-rata = omzet ÷ jumlah transaksi |
| F-19 | Kartu KPI "Menu Terlaris" tampil nama & jumlah | TC009 | Produk dengan kuantitas terjual tertinggi hari ini |
| F-20 | Grafik pendapatan menampilkan data 7 hari terakhir | TC010 | Bar chart terbentuk dengan data historis 7 hari |
| F-21 | Filter grafik 14 hari mengubah tampilan | TC010 | Data grafik berubah saat filter diubah ke 14 hari |
| F-22 | Filter grafik 30 hari mengubah tampilan | TC010 | Data grafik berubah saat filter diubah ke 30 hari |
| F-23 | Tabel top produk menampilkan peringkat penjualan | TC011 | Urutan produk sesuai dengan jumlah penjualan |
| F-24 | Data dashboard diperbarui real-time | TC012 | Statistik berubah tanpa refresh saat transaksi baru masuk |

---

## 4. Halaman Kasir (POS)

| ID Fitur | Deskripsi Fitur | Test Case | Kondisi Uji |
|----------|----------------|-----------|-------------|
| F-25 | Katalog produk tampil dari database | TC013 | Semua produk aktif muncul di halaman kasir |
| F-26 | Filter kategori memfilter tampilan produk | TC014 | Klik kategori → hanya produk kategori tersebut tampil |
| F-27 | Tambah produk ke keranjang | TC015 | Klik kartu produk → item masuk keranjang dengan qty=1 |
| F-28 | Edit kuantitas via tombol +/- | TC005 | Tombol + menambah, tombol - mengurangi kuantitas |
| F-29 | Edit kuantitas via input langsung | TC005 | Ketik angka di bidang input → kuantitas berubah sesuai |
| F-30 | Subtotal item dihitung otomatis | TC015 | Subtotal = harga × kuantitas, tepat sesuai perhitungan |
| F-31 | Total keranjang diperbarui otomatis | TC015 | Total = jumlah semua subtotal item |
| F-32 | Fitur hapus semua item (kosongkan keranjang) | TC016 | Klik "Kosongkan" → konfirmasi → keranjang kosong |
| F-33 | Modal catatan item dapat diisi | TC017 | Isi catatan → catatan tersimpan per item |
| F-34 | Fitur split quantity di modal catatan | TC017 | Pecah 2 item menjadi 2 entri berbeda dengan catatan berbeda |
| F-35 | Modal Checkout tampil saat klik "Bayar" | TC018 | Klik tombol bayar → CheckoutModal terbuka |
| F-36 | Pilih metode bayar Tunai (CASH) | TC018 | Dropdown CASH terpilih |
| F-37 | Input nominal uang diterima & kalkulasi kembalian | TC019 | Kembalian = nominal diterima - total, dihitung real-time |
| F-38 | Pilih metode bayar QRIS | TC020 | Dropdown QRIS terpilih, no nominal field |
| F-39 | Pilih metode bayar Transfer | TC021 | Dropdown Transfer terpilih |
| F-40 | Proses transaksi online berhasil | TC022 | Transaksi tersimpan ke Supabase, ReceiptModal muncul |
| F-41 | Proses transaksi saat offline (simpan antrean) | TC023 | Transaksi masuk antrean lokal, notifikasi offline tampil |
| F-42 | Sinkronisasi otomatis saat online kembali | TC023 | Transaksi offline masuk ke server saat koneksi pulih |
| F-43 | ReceiptModal menampilkan struk digital | TC024 | Struk berisi nama toko, item, total, metode, kembalian |
| F-44 | Cetak struk via Bluetooth | TC025 | Struk tercetak di printer thermal yang terhubung |
| F-45 | Keranjang dikosongkan setelah "Selesai" | TC024 | Klik Selesai → keranjang kosong, siap transaksi baru |
| F-46 | Floating cart button muncul di mobile | TC026 | Layar mobile: tombol melayang muncul saat keranjang tidak kosong |

---

## 5. Halaman Manajemen Produk

| ID Fitur | Deskripsi Fitur | Test Case | Kondisi Uji |
|----------|----------------|-----------|-------------|
| F-47 | Tabel produk menampilkan semua produk | TC027 | Seluruh produk aktif muncul di tabel |
| F-48 | Pencarian produk real-time | TC028 | Ketik nama → tabel terfilter secara langsung |
| F-49 | Tambah produk baru | TC029 | Isi formulir → simpan → produk muncul di tabel & kasir |
| F-50 | Validasi formulir produk (field wajib) | TC029 | Submit tanpa nama/harga → error validasi tampil |
| F-51 | Edit produk yang ada | TC030 | Ubah data → simpan → data terupdate di tabel |
| F-52 | Hapus produk dengan konfirmasi | TC031 | Klik hapus → dialog konfirmasi → produk dihapus |
| F-53 | Upload gambar produk | TC032 | Pilih file gambar → upload ke Supabase Storage |
| F-54 | Kelola kategori — Tambah kategori | TC033 | Isi nama kategori → simpan → kategori baru muncul |
| F-55 | Kelola kategori — Edit kategori | TC034 | Ubah nama → simpan → nama kategori terupdate |
| F-56 | Kelola kategori — Hapus kategori | TC035 | Konfirmasi hapus → kategori dihapus dari sistem |
| F-57 | Kategori baru muncul di filter kasir | TC033 | Setelah tambah kategori, filter di /pos langsung diperbarui |

---

## 6. Halaman Laporan Penjualan

| ID Fitur | Deskripsi Fitur | Test Case | Kondisi Uji |
|----------|----------------|-----------|-------------|
| F-58 | Tabel transaksi tampil dengan data | TC036 | Semua transaksi terdaftar tampil di tabel |
| F-59 | Filter pencarian nomor nota | TC037 | Ketik nomor nota → tabel menampilkan transaksi relevan |
| F-60 | Filter metode pembayaran | TC038 | Pilih "Tunai" → hanya transaksi tunai tampil |
| F-61 | Filter tanggal mulai | TC039 | Set tanggal mulai → transaksi sebelum tanggal tidak tampil |
| F-62 | Filter tanggal akhir | TC039 | Set tanggal akhir → transaksi setelah tanggal tidak tampil |
| F-63 | Kombinasi filter | TC040 | Semua filter aktif bersamaan → data terfilter akurat |
| F-64 | Pilih jumlah baris per halaman | TC041 | Ganti ke 25 baris → tabel tampilkan maks 25 data |
| F-65 | Navigasi halaman (pagination) | TC042 | Klik Next → halaman berikutnya tampil |
| F-66 | Kartu statistik merespons filter | TC043 | Ubah filter → kartu total pendapatan & transaksi berubah |
| F-67 | Klik baris → detail transaksi | TC044 | Klik baris → TransactionDetailModal terbuka dengan data benar |
| F-68 | Detail transaksi menampilkan item & total | TC044 | Modal berisi: item, qty, subtotal, total, metode, kembalian |
| F-69 | Ekspor CSV sesuai filter aktif | TC045 | Klik Export → file .csv terunduh dengan data sesuai filter |

---

## 7. Halaman Pengaturan Toko

| ID Fitur | Deskripsi Fitur | Test Case | Kondisi Uji |
|----------|----------------|-----------|-------------|
| F-70 | Tampilan tab Info Toko sebagai default | TC046 | Buka /settings → Tab Info Toko aktif |
| F-71 | Edit nama toko & simpan | TC047 | Ubah nama → simpan → nama terupdate di Beranda & struk |
| F-72 | Edit alamat toko & simpan | TC047 | Ubah alamat → simpan → tersimpan ke database |
| F-73 | Edit nomor telepon & simpan | TC047 | Ubah telepon → simpan → tersimpan ke database |
| F-74 | Upload & simpan logo toko | TC048 | Upload gambar → preview tampil → simpan → logo di struk |
| F-75 | Beralih ke tab Printer | TC049 | Klik tab Printer → konten printer tampil |
| F-76 | Status printer terhubung tampil hijau | TC050 | Saat printer terhubung → indikator hijau + nama printer |
| F-77 | Status printer terputus tampil abu-abu | TC051 | Tanpa printer → indikator abu-abu + teks "Belum terhubung" |
| F-78 | Auto-reconnect printer saat halaman dibuka | TC052 | Buka /settings saat printer pernah dipasangkan → otomatis terhubung |
| F-79 | Hubungkan printer baru via dialog Bluetooth | TC053 | Klik "Hubungkan Printer" → dialog browser muncul |
| F-80 | Putuskan koneksi printer | TC054 | Klik "Putuskan" → status berubah ke terputus |
| F-81 | Toggle "Cetak otomatis" | TC055 | Aktifkan toggle → struk tercetak langsung setelah transaksi |
| F-82 | Toggle "Tampilkan logo di struk" | TC055 | Toggle → struk dicetak dengan/tanpa logo |
| F-83 | Toggle "Tampilkan footer struk" | TC055 | Toggle → struk dicetak dengan/tanpa teks footer |
| F-84 | Tab "Backup" tampil di navigasi *sidebar* Pengaturan | TC056 | Buka `/settings` → *sidebar* menampilkan item "Info Toko", "Printer", dan "Backup" |
| F-85 | Ekspor backup data semua tabel ke format JSON | TC057 | Klik tombol ekspor → file `.json` terunduh berisi data *categories*, *products*, *transactions*, *transaction_items* |
| F-86 | Peringatan "Belum pernah backup" ditampilkan | TC058 | Saat *localStorage* tidak ada *key* backup → *badge* peringatan muncul di panel Backup |
| F-87 | Waktu backup terakhir tersimpan dan ditampilkan | TC059 | Setelah ekspor berhasil → *localStorage* menyimpan *timestamp*; tampil di UI saat halaman dibuka kembali |
| F-88 | *Loading state* tombol ekspor aktif selama proses | TC060 | Klik ekspor → tombol *disabled* + *spinner* tampil; kembali aktif setelah selesai |

---

## 8. Ringkasan Coverage (Cakupan Pengujian)

| Halaman | Jumlah Fitur | Test Case yang Ter-cover | Coverage |
|---------|-------------|------------------------|---------|
| Login | 5 | TC001–TC004 | ✅ 100% |
| Beranda | 10 | TC005–TC008 | ✅ 100% |
| Dashboard | 9 | TC009–TC012 | ✅ 100% |
| Kasir (POS) | 22 | TC013–TC026 | ✅ 100% |
| Produk | 11 | TC027–TC035 | ✅ 100% |
| Laporan | 12 | TC036–TC045 | ✅ 100% |
| Pengaturan | 19 | TC046–TC060 | ✅ 100% |
| **TOTAL** | **88** | **TC001–TC060** | **✅ 100%** |

---

## 9. Catatan Penggunaan Dokumen

Dokumen ini digunakan untuk:
1. **Verifikasi kelengkapan pengujian** — memastikan setiap fitur yang diimplementasikan memiliki setidaknya satu test case pengujian
2. **Referensi silang BAB IV dan BAB V** — menghubungkan uraian implementasi (BAB IV) dengan hasil pengujian *blackbox* (BAB V)
3. **Template pelaporan** — format tabel di atas dapat langsung dipindahkan ke laporan skripsi sebagai lampiran atau sub-bagian dalam BAB IV/V

> **Catatan**: Nomor test case (TC001–TC055) mengacu pada dokumen pengujian blackbox
> yang terpisah (`blackbox-results.json` / `blackbox-report.html`).
> Pastikan penomoran ini konsisten dengan dokumen pengujian yang digunakan.
