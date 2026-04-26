#!/usr/bin/env python3
"""
Update WIREFRAME-BAB3.md:
1. Rewrite section 3.5.2 (Beranda vs Dashboard split)
2. Insert WF-02-MN (Gambar 3.10) after Gambar 3.9 in 3.5.3
3. Update desktop nav descriptions (add Dashboard mention)
4. Renumber Gambar 3.10-3.18 -> 3.11-3.19
5. Update mapping table + footer
"""
import re, sys

FILE = "C:/Users/aldyf/Downloads/CODE/antigravity/post-pwa/docs/wireframe/WIREFRAME-BAB3.md"

with open(FILE, encoding="utf-8") as f:
    content = f.read()

# GUARD: refuse to run if file already updated
if "3.5.2 Halaman Beranda dan Dashboard" in content:
    print("STOP: File sudah diupdate. Gunakan fix_bab3.py untuk perbaikan.")
    print("      Jangan jalankan update_bab3.py lagi!")
    sys.exit(0)


# ─────────────────────────────────────────────────────────────
# 1. REWRITE section 3.5.2 intro + 3.5 intro paragraph
# ─────────────────────────────────────────────────────────────
OLD_352_INTRO = """Perancangan antarmuka pada penelitian ini menghasilkan enam kelompok halaman utama yang mencakup seluruh alur kerja kasir dan pemilik usaha, yaitu Halaman Login, Halaman Dasbor, Halaman Kasir, Halaman Manajemen Produk, Halaman Laporan Penjualan, dan Halaman Pengaturan Toko. Setiap halaman dirancang dalam dua tampilan utama, yaitu tampilan komputer dan tampilan ponsel, serta dilengkapi dengan rancangan kondisi atau jendela interaksi yang relevan."""

NEW_352_INTRO = """Perancangan antarmuka pada penelitian ini menghasilkan enam kelompok halaman utama yang mencakup seluruh alur kerja kasir dan pemilik usaha, yaitu Halaman Login, Halaman Beranda, Halaman Kasir, Halaman Manajemen Produk, Halaman Laporan Penjualan, dan Halaman Pengaturan Toko. Selain halaman utama tersebut, terdapat halaman Dashboard yang dapat diakses melalui menu navigasi dan berfungsi khusus menampilkan analitik penjualan secara menyeluruh. Setiap halaman dirancang dalam dua tampilan utama, yaitu tampilan komputer dan tampilan ponsel, serta dilengkapi dengan rancangan kondisi atau jendela interaksi yang relevan."""

content = content.replace(OLD_352_INTRO, NEW_352_INTRO)

# ─────────────────────────────────────────────────────────────
# 2. REWRITE section 3.5.2 body
# ─────────────────────────────────────────────────────────────
OLD_352_BODY = """## 3.5.2 Halaman Dasbor (Beranda)

Halaman Dasbor merupakan halaman utama yang ditampilkan setelah pengguna berhasil masuk ke dalam sistem. Halaman ini menyajikan ringkasan kinerja penjualan harian yang meliputi total pendapatan hari ini, jumlah transaksi yang telah terjadi, dan nama produk yang paling banyak terjual. Selain itu, terdapat grafik batang yang menampilkan perbandingan pendapatan dalam tujuh hari terakhir untuk membantu pemilik usaha memantau perkembangan penjualan secara berkala.

Pada tampilan komputer, menu navigasi utama ditempatkan di sisi kiri layar dalam bentuk daftar menu vertikal, sedangkan bagian kanan layar menampilkan kartu ringkasan dan grafik secara berdampingan. Kartu ringkasan disusun dalam empat kolom berjajar yang memuat informasi omzet hari ini, total transaksi, rata-rata nilai per transaksi, dan menu terlaris, sehingga pengguna dapat langsung memantau kinerja usaha tanpa perlu membaca seluruh teks secara terperinci.

<!-- SISIPKAN: Gambar 3.4 — WF-01-D.png (lebar 15 cm, center) -->
![Gambar 3.4 Rancangan Antarmuka Halaman Dasbor — Tampilan Komputer](export/WF-01-D.png)

*Gambar 3.4 Rancangan Antarmuka Halaman Dasbor — Tampilan Komputer*

Pada tampilan ponsel, susunan halaman berubah menjadi satu kolom vertikal dengan kartu ringkasan ditampilkan terlebih dahulu di bagian atas, diikuti oleh grafik di bawahnya. Menu navigasi utama dipindahkan ke bilah tab yang terletak di bagian paling bawah layar sehingga mudah dijangkau oleh ibu jari pengguna saat menggunakan ponsel dengan satu tangan.

<!-- SISIPKAN: Gambar 3.5 — WF-01-M.png (lebar 6 cm, center) -->
![Gambar 3.5 Rancangan Antarmuka Halaman Dasbor — Tampilan Ponsel](export/WF-01-M.png)

*Gambar 3.5 Rancangan Antarmuka Halaman Dasbor — Tampilan Ponsel*"""

NEW_352_BODY = """## 3.5.2 Halaman Beranda dan Dashboard

Sistem ini memiliki dua halaman ringkasan yang saling melengkapi namun memiliki tujuan berbeda. Halaman **Beranda** merupakan halaman pertama yang muncul setelah pengguna berhasil masuk ke dalam sistem dan berfungsi sebagai pusat tindakan cepat (*home hub*). Halaman ini menampilkan sapaan selamat datang, ringkasan omzet dan jumlah transaksi hari ini, serta empat tombol tindakan cepat yang mengarahkan pengguna ke fitur-fitur utama aplikasi. Halaman **Dashboard** merupakan halaman analitik terpisah yang dapat diakses melalui menu navigasi dan berfungsi menyajikan ringkasan kinerja penjualan secara lebih menyeluruh, meliputi grafik pendapatan tujuh hari terakhir, total transaksi, rata-rata nilai per transaksi, dan produk terlaris.

Pada tampilan komputer, menu navigasi utama ditempatkan di sisi kiri layar dalam bentuk bilah sisi (*sidebar*) vertikal yang memuat enam item menu, yaitu Beranda, Kasir, Dashboard, Produk, Laporan, dan Pengaturan. Halaman Beranda pada tampilan komputer menampilkan banner sapaan dengan nama toko dan waktu, dua kartu ringkasan statistik, serta empat kartu tindakan cepat yang tersusun secara vertikal di bagian konten utama.

<!-- SISIPKAN: Gambar 3.4 — WF-01-D.png (lebar 15 cm, center) -->
![Gambar 3.4 Rancangan Antarmuka Halaman Beranda — Tampilan Komputer](export/WF-01-D.png)

*Gambar 3.4 Rancangan Antarmuka Halaman Beranda — Tampilan Komputer*

Pada tampilan ponsel, menu navigasi berpindah ke bilah tab bawah (*bottom tab bar*) yang terdiri dari lima tab, yaitu Beranda, Kasir, Produk, Laporan, dan Akun. Halaman Dashboard tidak ditampilkan sebagai tab tersendiri pada tampilan ponsel; pengguna mengaksesnya melalui tombol tindakan cepat di halaman Beranda. Susunan konten Beranda pada tampilan ponsel menjadi satu kolom vertikal agar mudah dijangkau dengan ibu jari.

<!-- SISIPKAN: Gambar 3.5 — WF-01-M.png (lebar 6 cm, center) -->
![Gambar 3.5 Rancangan Antarmuka Halaman Beranda — Tampilan Ponsel](export/WF-01-M.png)

*Gambar 3.5 Rancangan Antarmuka Halaman Beranda — Tampilan Ponsel*"""

content = content.replace(OLD_352_BODY, NEW_352_BODY)

# ─────────────────────────────────────────────────────────────
# 3. UPDATE section 3.5.3 desktop description (add sidebar mention)
# ─────────────────────────────────────────────────────────────
OLD_353_DESKTOP = """Pada tampilan komputer, daftar menu ditampilkan di bagian kiri layar, sementara bagian kanan layar menampilkan daftar pesanan yang sedang berlangsung beserta total harga yang dihitung secara langsung setiap kali ada perubahan. Kasir dapat mengubah jumlah setiap item, menambahkan catatan khusus untuk item tertentu, atau menghapus item dari daftar pesanan langsung dari panel sebelah kanan tanpa perlu berpindah halaman."""

NEW_353_DESKTOP = """Pada tampilan komputer, navigasi utama terletak pada bilah sisi vertikal di sisi paling kiri layar yang memuat enam item menu (Beranda, Kasir, Dashboard, Produk, Laporan, Pengaturan), dengan item Kasir dalam kondisi aktif. Daftar menu ditampilkan di bagian tengah layar dalam susunan grid, sementara panel pesanan aktif berada di sisi kanan layar dan menampilkan daftar item beserta total harga yang dihitung secara langsung setiap kali ada perubahan. Kasir dapat mengubah jumlah setiap item, menambahkan catatan khusus, atau mengosongkan seluruh pesanan tanpa perlu berpindah halaman."""

content = content.replace(OLD_353_DESKTOP, NEW_353_DESKTOP)

# ─────────────────────────────────────────────────────────────
# 4. INSERT Gambar 3.10 WF-02-MN after Gambar 3.9
# ─────────────────────────────────────────────────────────────
OLD_AFTER_39 = """*Gambar 3.9 Rancangan Antarmuka Halaman Kasir — Tampilan Nota Pembayaran*

---

## 3.5.4 Halaman Manajemen Produk"""

NEW_AFTER_39 = """*Gambar 3.9 Rancangan Antarmuka Halaman Kasir — Tampilan Nota Pembayaran*

**Tampilan Modal Catatan Pesanan** muncul ketika kasir menekan tautan **+ Catatan** pada salah satu item di daftar pesanan aktif. Melalui modal ini, kasir dapat menambahkan catatan khusus untuk item tertentu tanpa mengubah data produk yang ada di sistem. Terdapat dua cara pemberian catatan, yaitu memilih varian atau permintaan yang telah tersedia dalam bentuk tombol *pill* yang dapat dipilih lebih dari satu sekaligus, serta mengetik catatan bebas pada kolom teks di bawahnya. Catatan yang sedang disusun ditampilkan secara langsung dalam kotak pratinjau di bagian atas modal sehingga kasir dapat memastikan kebenaran catatan sebelum menyimpannya. Setelah tombol **Simpan Catatan** ditekan, catatan tersebut akan tersimpan pada item terkait dan turut tercetak pada nota pembayaran.

<!-- SISIPKAN: __PLACEHOLDER_310__ — WF-02-MN.png (lebar 9 cm, center) -->
![__PLACEHOLDER_310__ Rancangan Antarmuka Halaman Kasir — Tampilan Modal Catatan Pesanan](export/WF-02-MN.png)

*__PLACEHOLDER_310__ Rancangan Antarmuka Halaman Kasir — Tampilan Modal Catatan Pesanan*

---

## 3.5.4 Halaman Manajemen Produk"""

content = content.replace(OLD_AFTER_39, NEW_AFTER_39)

# ─────────────────────────────────────────────────────────────
# 5. UPDATE desktop nav descriptions for sections 3.5.4-3.5.6
# ─────────────────────────────────────────────────────────────
# 3.5.4 Produk
OLD_354_DESK = """Pada tampilan komputer, tabel daftar produk menampilkan setiap produk dalam satu baris. Di ujung kanan setiap baris terdapat dua tombol aksi, yaitu tombol **Ubah** untuk membuka formulir pengeditan dan tombol **Hapus** untuk menghapus produk dari sistem. Di bagian atas halaman terdapat tombol **Tambah Produk** dan tombol **Kelola Kategori** yang dapat diakses dengan mudah."""

NEW_354_DESK = """Pada tampilan komputer, bilah sisi vertikal di sisi kiri layar menampilkan enam item menu navigasi (Beranda, Kasir, Dashboard, Produk, Laporan, Pengaturan) dengan item Produk dalam kondisi aktif. Tabel daftar produk menampilkan setiap produk dalam satu baris. Di ujung kanan setiap baris terdapat dua tombol aksi, yaitu tombol **Ubah** untuk membuka formulir pengeditan dan tombol **Hapus** untuk menghapus produk dari sistem. Di bagian atas halaman terdapat tombol **Tambah Produk** dan tombol **Kelola Kategori** yang dapat diakses dengan mudah."""

content = content.replace(OLD_354_DESK, NEW_354_DESK)

# 3.5.5 Laporan
OLD_355_DESK = """Pada tampilan komputer, pengguna dapat menyaring data menggunakan pilihan rentang tanggal dan jenis metode pembayaran yang tersedia di bagian atas tabel."""

NEW_355_DESK = """Pada tampilan komputer, bilah sisi vertikal memuat enam item menu navigasi (Beranda, Kasir, Dashboard, Produk, Laporan, Pengaturan) dengan item Laporan dalam kondisi aktif. Pengguna dapat menyaring data menggunakan pilihan rentang tanggal dan jenis metode pembayaran yang tersedia di bagian atas tabel."""

content = content.replace(OLD_355_DESK, NEW_355_DESK)

# 3.5.6 Pengaturan
OLD_356_DESK = """Pada tampilan komputer, menu pilihan panel ditampilkan di sisi kiri layar dalam bentuk daftar menu vertikal, sementara isi dari panel yang dipilih ditampilkan di sisi kanan layar."""

NEW_356_DESK = """Pada tampilan komputer, bilah sisi navigasi utama di sisi paling kiri layar memuat enam item menu (Beranda, Kasir, Dashboard, Produk, Laporan, Pengaturan) dengan item Pengaturan dalam kondisi aktif. Di sebelah kanan bilah sisi tersebut, menu pilihan panel konfigurasi ditampilkan dalam daftar vertikal, sementara isi dari panel yang dipilih ditampilkan di area konten utama."""

content = content.replace(OLD_356_DESK, NEW_356_DESK)

# ─────────────────────────────────────────────────────────────
# 6. RENUMBER cascade (from high to low to avoid conflicts)
# WF-02-MN uses __PLACEHOLDER_310__ to avoid being bumped
# ─────────────────────────────────────────────────────────────
for n in range(18, 9, -1):
    content = content.replace(f"Gambar 3.{n}", f"Gambar 3.{n+1}")

# Restore placeholder -> Gambar 3.10
content = content.replace("__PLACEHOLDER_310__", "Gambar 3.10")

# ─────────────────────────────────────────────────────────────
# 7. UPDATE mapping table - replace entire table section
# ─────────────────────────────────────────────────────────────
OLD_TABLE = """| No. Gambar | Kode File | Keterangan Resmi |
|:----------:|-----------|------------------|
| Gambar 3.1 | `WF-00-D.png` | Rancangan Antarmuka Halaman Login — Tampilan Komputer |
| Gambar 3.2 | `WF-00-M.png` | Rancangan Antarmuka Halaman Login — Tampilan Ponsel |
| Gambar 3.3 | `WF-00-E.png` | Rancangan Antarmuka Halaman Login — Kondisi Kesalahan Masuk |
| Gambar 3.4 | `WF-01-D.png` | Rancangan Antarmuka Halaman Dasbor — Tampilan Komputer |
| Gambar 3.5 | `WF-01-M.png` | Rancangan Antarmuka Halaman Dasbor — Tampilan Ponsel |
| Gambar 3.6 | `WF-02-D.png` | Rancangan Antarmuka Halaman Kasir — Tampilan Komputer |
| Gambar 3.7 | `WF-02-M.png` | Rancangan Antarmuka Halaman Kasir — Tampilan Ponsel |
| Gambar 3.8 | `WF-02-MC.png` | Rancangan Antarmuka Halaman Kasir — Tampilan Konfirmasi Pembayaran |
| Gambar 3.9 | `WF-02-MR.png` | Rancangan Antarmuka Halaman Kasir — Tampilan Nota Pembayaran |
| Gambar 3.10 | `WF-03-D.png` | Rancangan Antarmuka Halaman Manajemen Produk — Tampilan Komputer |
| Gambar 3.11 | `WF-03-M.png` | Rancangan Antarmuka Halaman Manajemen Produk — Tampilan Ponsel |
| Gambar 3.12 | `WF-03-MF.png` | Rancangan Antarmuka Halaman Manajemen Produk — Formulir Tambah/Ubah Produk |
| Gambar 3.13 | `WF-03-MK.png` | Rancangan Antarmuka Halaman Manajemen Produk — Tampilan Kelola Kategori |
| Gambar 3.14 | `WF-04-D.png` | Rancangan Antarmuka Halaman Laporan Penjualan — Tampilan Komputer |
| Gambar 3.15 | `WF-04-M.png` | Rancangan Antarmuka Halaman Laporan Penjualan — Tampilan Ponsel |
| Gambar 3.16 | `WF-04-MD.png` | Rancangan Antarmuka Halaman Laporan Penjualan — Tampilan Detail Transaksi |
| Gambar 3.17 | `WF-05-D.png` | Rancangan Antarmuka Halaman Pengaturan Toko — Tampilan Komputer |
| Gambar 3.18 | `WF-05-M.png` | Rancangan Antarmuka Halaman Pengaturan Toko — Tampilan Ponsel |"""

NEW_TABLE = """| No. Gambar | Kode File | Keterangan Resmi |
|:----------:|-----------|------------------|
| Gambar 3.1 | `WF-00-D.png` | Rancangan Antarmuka Halaman Login — Tampilan Komputer |
| Gambar 3.2 | `WF-00-M.png` | Rancangan Antarmuka Halaman Login — Tampilan Ponsel |
| Gambar 3.3 | `WF-00-E.png` | Rancangan Antarmuka Halaman Login — Kondisi Kesalahan Masuk |
| Gambar 3.4 | `WF-01-D.png` | Rancangan Antarmuka Halaman Beranda — Tampilan Komputer |
| Gambar 3.5 | `WF-01-M.png` | Rancangan Antarmuka Halaman Beranda — Tampilan Ponsel |
| Gambar 3.6 | `WF-02-D.png` | Rancangan Antarmuka Halaman Kasir — Tampilan Komputer |
| Gambar 3.7 | `WF-02-M.png` | Rancangan Antarmuka Halaman Kasir — Tampilan Ponsel |
| Gambar 3.8 | `WF-02-MC.png` | Rancangan Antarmuka Halaman Kasir — Tampilan Konfirmasi Pembayaran |
| Gambar 3.9 | `WF-02-MR.png` | Rancangan Antarmuka Halaman Kasir — Tampilan Nota Pembayaran |
| Gambar 3.10 | `WF-02-MN.png` | Rancangan Antarmuka Halaman Kasir — Tampilan Modal Catatan Pesanan |
| Gambar 3.11 | `WF-03-D.png` | Rancangan Antarmuka Halaman Manajemen Produk — Tampilan Komputer |
| Gambar 3.12 | `WF-03-M.png` | Rancangan Antarmuka Halaman Manajemen Produk — Tampilan Ponsel |
| Gambar 3.13 | `WF-03-MF.png` | Rancangan Antarmuka Halaman Manajemen Produk — Formulir Tambah/Ubah Produk |
| Gambar 3.14 | `WF-03-MK.png` | Rancangan Antarmuka Halaman Manajemen Produk — Tampilan Kelola Kategori |
| Gambar 3.15 | `WF-04-D.png` | Rancangan Antarmuka Halaman Laporan Penjualan — Tampilan Komputer |
| Gambar 3.16 | `WF-04-M.png` | Rancangan Antarmuka Halaman Laporan Penjualan — Tampilan Ponsel |
| Gambar 3.17 | `WF-04-MD.png` | Rancangan Antarmuka Halaman Laporan Penjualan — Tampilan Detail Transaksi |
| Gambar 3.18 | `WF-05-D.png` | Rancangan Antarmuka Halaman Pengaturan Toko — Tampilan Komputer |
| Gambar 3.19 | `WF-05-M.png` | Rancangan Antarmuka Halaman Pengaturan Toko — Tampilan Ponsel |"""

content = content.replace(OLD_TABLE, NEW_TABLE)

# ─────────────────────────────────────────────────────────────
# 8. UPDATE sizing table row for WF-02-MN
# ─────────────────────────────────────────────────────────────
OLD_SIZE_ROW = """| Modal Kotak Besar | `WF-02-MC`, `WF-02-MR`, `WF-04-MD` | **8–10 cm** | Center |"""
NEW_SIZE_ROW = """| Modal Kotak Besar | `WF-02-MC`, `WF-02-MR`, `WF-02-MN`, `WF-04-MD` | **8–10 cm** | Center |"""
content = content.replace(OLD_SIZE_ROW, NEW_SIZE_ROW)

# ─────────────────────────────────────────────────────────────
# 9. UPDATE footer
# ─────────────────────────────────────────────────────────────
content = content.replace(
    "*Sumber gambar: `docs/wireframe/export/` — 18 file PNG dengan latar belakang putih.*",
    "*Sumber gambar: `docs/wireframe/export/` — 19 file PNG dengan latar belakang putih.*"
)

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)

print("DONE: WIREFRAME-BAB3.md updated successfully")
print(f"File size: {len(content)} chars")

# Verify key patterns
import re
nums = re.findall(r"Gambar 3\.(\d+)", content)
unique = sorted(set(int(x) for x in nums))
print(f"Gambar numbers found: {unique}")
assert 10 in unique, "Gambar 3.10 (WF-02-MN) missing!"
assert 19 in unique, "Gambar 3.19 missing!"
assert "WF-02-MN" in content, "WF-02-MN reference missing!"
assert "Dashboard" in content, "Dashboard mention missing!"
print("All assertions passed!")
