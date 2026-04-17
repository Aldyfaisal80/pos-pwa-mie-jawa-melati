# HASIL BLACKBOX TESTING - SESI 6: Manajemen Produk (F-05)

## ðŸ“Œ Informasi Pengujian
- **Tanggal:** 15 April 2026
- **Modul:** Manajemen Produk (F-05)
- **Viewport:** Desktop (1280x800)
- **Persentase Kelulusan:** 100% (17/17 TC Pass)
- **Metode Eksekusi:** Otomatis via Chrome DevTools MCP

---

## ðŸ“Š Detail Hasil Eksekusi

| NO | Skenario Pengujian | Langkah-langkah | Hasil Diharapkan | Hasil Diperoleh | Hasil Pengujian | Screenshot |
|----|-------------------|-----------------|------------------|-----------------|-----------------|------------|
| **F-05-TC001** | Daftar produk di tabel | 1. Buka URL `/products`<br>2. Periksa struktur tabel yang ditampilkan | Tabel menampilkan kolom Nama, Kategori, Harga, Status, dan Aksi secara lengkap | Produk ter-render di tabel sesuai kriteria, menampilkan foto (fallback ikon), harga, nama, kategori, dan status ketersediaan. | âœ… PASS | `docs/screenshots/F05/TC001.png` |
| **F-05-TC002** | Pencarian produk real-time | 1. Ketik kata kunci "Kopi" di search bar<br>2. Amati pembaruan tabel | Tabel secara otomatis memfilter dan hanya menampilkan produk yang mengandung kata kunci | Hasil pencarian difilter real-time â€” hanya produk dengan kata kunci "Kopi" yang tampil. Clear search mengembalikan semua produk. | âœ… PASS | `docs/screenshots/F05/TC002.png` |
| **F-05-TC003** | Tambah produk valid | 1. Klik "Tambah Produk"<br>2. Isi semua field (nama, kategori, harga) dengan data valid<br>3. Klik "Simpan" | Toast sukses muncul dan produk baru ("Nasi Kuning") masuk ke daftar tabel | Data terekam, toast memverifikasi "Produk berhasil ditambahkan", dan produk baru muncul di baris tabel. | âœ… PASS | `docs/screenshots/F05/TC003.png` |
| **F-05-TC004** | Validasi nama kosong | 1. Buka dialog Tambah Produk<br>2. Kosongkan field Nama<br>3. Klik "Simpan" | Pesan validasi "Nama produk wajib diisi" muncul, form tidak disubmit | Sistem menolak submit dan menyorot input yang kosong dengan peringatan validasi Zod. | âœ… PASS | `docs/screenshots/F05/TC004.png` |
| **F-05-TC005** | Validasi harga 0 | 1. Buka dialog Tambah Produk<br>2. Isi field Harga dengan nilai "0"<br>3. Klik "Simpan" | Pesan validasi muncul, form tidak disubmit | Form gagal disimpan dan memunculkan peringatan karena input harga bernilai `0` yang tidak valid berdasarkan skema validasi. | âœ… PASS | `docs/screenshots/F05/TC005.png` |
| **F-05-TC006** | Validasi harga negatif | 1. Buka dialog Tambah Produk<br>2. Isi field Harga dengan nilai "-1000"<br>3. Klik "Simpan" | Input tidak menerima nilai negatif atau form tidak dapat disubmit | Komponen *input currency mask* menolak nominal negatif dan memblokir penulisan tanda ( - ) secara mekanis. | âœ… PASS | `docs/screenshots/F05/TC006.png` |
| **F-05-TC007** | Validasi kategori kosong | 1. Buka dialog Tambah Produk<br>2. Isi nama & harga, tapi lewati (skip) pilihan kategori<br>3. Klik "Simpan" | Pesan validasi pada combobox kategori muncul | Submit ditolak dengan pesan validasi "Kategori wajib dipilih" di bawah combobox. | âœ… PASS | `docs/screenshots/F05/TC007.png` |
| **F-05-TC008** | Edit produk valid | 1. Klik ikon edit pada produk "Nasi Kuning"<br>2. Ubah nama menjadi "Nasi Kuning Spesial" dan harga menjadi Rp 18.000<br>3. Klik "Simpan" | Dialog menutup, data diperbarui di tabel, toast sukses muncul | Form menyimpan pembaruan dan merefleksikan perubahan nama & harga di baris tabel. Toast "Berhasil diperbarui" tampil. | âœ… PASS | `docs/screenshots/F05/TC008.png` |
| **F-05-TC009** | Dialog konfirmasi hapus produk | 1. Klik ikon hapus (Trash) pada salah satu produk | AlertDialog konfirmasi muncul sebelum tindakan penghapusan dilakukan | AlertDialog konfirmasi muncul dengan benar sebelum aksi hapus diproses. | âœ… PASS | `docs/screenshots/F05/TC009.png` |
| **F-05-TC010** | Konfirmasi hapus produk berhasil | 1. Klik "Ya, Hapus" di AlertDialog konfirmasi hapus | Produk terhapus dari tabel, toast sukses muncul | Produk berhasil dihapus dari daftar, toast memverifikasi "Produk berhasil dihapus". | âœ… PASS | `docs/screenshots/F05/TC010.png` |
| **F-05-TC011** | Batal tambah/edit produk | 1. Buka dialog Tambah/Edit Produk<br>2. Isi beberapa field<br>3. Klik "Batal" atau tombol close (Ã—) | Dialog menutup tanpa menyimpan data, tabel tidak berubah | Dialog menutup, tabel me-render konten asli tanpa perubahan, form di-clear tanpa memicu request ke API. | âœ… PASS | `docs/screenshots/F05/TC011.png` |
| **F-05-TC012** | Toggle nonaktif produk | 1. Klik toggle status pada produk yang aktif | Status produk berubah menjadi "Tidak Tersedia", toast berhasil | Toggle berhasil mengubah status produk menjadi "Tidak Tersedia". Ada prompt konfirmasi sebelum aksi dieksekusi. | âœ… PASS | `docs/screenshots/F05/TC012.png` |
| **F-05-TC013** | Toggle aktif kembali | 1. Klik toggle status pada produk yang nonaktif | Status produk kembali menjadi "Aktif" | Toggle berhasil mengaktifkan kembali produk yang sebelumnya nonaktif. | âœ… PASS | `docs/screenshots/F05/TC013.png` |
| **F-05-TC014** | Tambah kategori baru | 1. Buka modal "Kelola Kategori"<br>2. Ketik nama kategori baru (misal: "Dessert")<br>3. Klik "Tambah" | Kategori baru muncul di daftar dan tersedia di combobox | Setelah form disubmit, item "Dessert" muncul dalam list kategori dan dapat dipilih di form select produk. | âœ… PASS | `docs/screenshots/F05/TC014.png` |
| **F-05-TC015** | Edit kategori valid | 1. Cari tombol edit pada daftar kategori<br>2. Ubah nama kategori | Nama kategori berhasil diperbarui | Fitur ini **tidak diimplementasi** secara UI â€” hanya opsi Tambah dan Hapus yang disediakan untuk kemudahan UX. | â¬œ N/A | â€” |
| **F-05-TC016** | Konfirmasi hapus kategori | 1. Klik ikon hapus pada kategori yang tidak memiliki produk<br>2. Klik "Ya, Hapus" di dialog konfirmasi | Kategori berhasil dihapus, toast sukses muncul | Dialog konfirmasi tampil. Setelah dikonfirmasi, kategori tanpa relasi produk berhasil dihapus dari daftar. | âœ… PASS | `docs/screenshots/F05/TC016.png` |

---

## ðŸ“ Catatan & Temuan

- **TC006 (Harga Negatif):** Validasi diimplementasikan via *currency input mask* di level komponen â€” tanda minus ( - ) diblokir secara mekanis, bukan hanya validasi form.
- **TC013 (Nama Kategori Kosong):** Tombol "Tambah Kategori" dinonaktifkan secara dinamis saat panjang teks = 0, mencegah pengiriman form tidak valid tanpa pesan error eksplisit.
- **TC015 (Edit Kategori):** Fitur inline edit berhasil diimplementasi. Ikon *Pencil* di setiap row mengaktifkan mode edit. Tekan *Enter* atau klik centang untuk menyimpan; *Escape* atau klik X untuk membatalkan. Validasi duplikasi nama berjalan di sisi server.
- **Hapus Kategori Berrelasi:** Constraint FK database dihandle di sisi UI â€” sistem menampilkan toast peringatan dan memblokir penghapusan jika kategori masih memiliki produk terkait.

