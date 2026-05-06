# BAB III METODOLOGI PENELITIAN

## 3.x Rancangan Pengujian Penerimaan Pengguna (*User Acceptance Test*)

Selain pengujian *blackbox*, penelitian ini juga menerapkan *User Acceptance Test* (UAT) untuk mengukur tingkat penerimaan pengguna akhir terhadap sistem yang dikembangkan. Pengujian dilaksanakan dengan menyerahkan kuesioner kepada pemilik UMKM Mie Jawa Melati selaku pengguna utama sistem POS berbasis PWA, guna mengevaluasi kesesuaian sistem terhadap kebutuhan operasional kasir harian secara langsung.

### 3.x.1 Instrumen Pengujian

Instrumen yang digunakan dalam pengujian UAT berupa kuesioner tertutup dengan menggunakan Skala Likert 5 (lima) tingkatan penilaian. Setiap butir pernyataan pada kuesioner dinilai oleh responden berdasarkan lima tingkatan sebagaimana disajikan pada Tabel 3.x berikut.

**Tabel 3.x** Skala Penilaian Likert
| Keterangan | Skor |
|---|---|
| Sangat Setuju (SS) | 5 |
| Setuju (S) | 4 |
| Cukup Setuju (CS) | 3 |
| Kurang Setuju (KS) | 2 |
| Tidak Setuju (TS) | 1 |


Kuesioner UAT terdiri atas 15 (lima belas) butir pernyataan yang dikelompokkan ke dalam 6 (enam) kategori aspek penilaian. Pengelompokan kategori disesuaikan dengan modul-modul utama yang terdapat pada sistem POS PWA, sehingga setiap aspek fungsional sistem dapat dievaluasi secara terpisah dan terukur. Rincian butir pernyataan kuesioner UAT disajikan pada Tabel 3.x berikut.

**Tabel 3.x** Butir Pernyataan Kuesioner UAT
| No | Pernyataan | SS | S | CS | KS | TS |
|---|---|---|---|---|---|---|
| **I** | **Tampilan dan Navigasi** | | | | | |
| 1 | Tampilan antarmuka aplikasi POS ini mudah dipahami dan menarik secara visual. | | | | | |
| 2 | Navigasi antarhalaman (*Dashboard*, Kasir, Produk, Laporan, Pengaturan) berjalan dengan lancar dan mudah diakses. | | | | | |
| 3 | Tampilan aplikasi menyesuaikan ukuran layar *smartphone* dengan baik sehingga nyaman digunakan. | | | | | |
| **II** | **Fitur Kasir dan Transaksi** | | | | | |
| 4 | Proses pemilihan menu dan penambahan ke keranjang belanja dapat dilakukan dengan mudah dan cepat. | | | | | |
| 5 | Proses pembayaran (Tunai, QRIS, Transfer) dapat diselesaikan dengan akurat dan tanpa hambatan. | | | | | |
| 6 | Informasi kembalian uang ditampilkan dengan benar setelah proses pembayaran tunai selesai. | | | | | |
| 7 | Struk transaksi digital dapat dilihat dan dicetak sesuai kebutuhan operasional. | | | | | |
| **III** | **Manajemen Produk dan Kategori** | | | | | |
| 8 | Fitur penambahan, pengubahan, dan penghapusan data produk menu berfungsi dengan benar. | | | | | |
| 9 | Pengelolaan kategori produk (tambah, ubah, dan hapus kategori) mudah dilakukan. | | | | | |
| **IV** | **Laporan Transaksi** | | | | | |
| 10 | Riwayat transaksi harian dapat dilihat dengan lengkap dan datanya akurat. | | | | | |
| 11 | Fitur *filter* laporan berdasarkan rentang tanggal memudahkan pengecekan data penjualan. | | | | | |
| **V** | **Dashboard dan Pengaturan Toko** | | | | | |
| 12 | Informasi ringkasan omzet dan jumlah transaksi hari ini ditampilkan dengan jelas di halaman utama. | | | | | |
| 13 | Fitur pengaturan data toko (nama, telepon, alamat) memudahkan penyesuaian informasi usaha pada aplikasi. | | | | | |
| **VI** | **Penilaian Umum** | | | | | |
| 14 | Secara keseluruhan, aplikasi ini membantu operasional kasir Mie Jawa Melati menjadi lebih efisien dibandingkan pencatatan manual. | | | | | |
| 15 | Saya bersedia menggunakan aplikasi ini secara rutin untuk kegiatan usaha sehari-hari. | | | | | |

### 3.x.2 Teknik Analisis Data UAT

Hasil pengisian kuesioner dianalisis menggunakan rumus persentase kelayakan. Perhitungan persentase kelayakan dilakukan dengan membandingkan total skor yang diperoleh dari responden terhadap skor ideal (skor maksimum). Rumus yang digunakan adalah sebagai berikut.

Persentase Kelayakan = (Skor Diperoleh / Skor Ideal) × 100% ............... (3.x)

**Keterangan:**
Skor Diperoleh = total nilai yang diberikan oleh responden pada seluruh butir pernyataan
Skor Ideal = jumlah butir pernyataan × skor tertinggi pada Skala Likert

Skor ideal dihitung berdasarkan jumlah butir pernyataan dikalikan dengan skor tertinggi pada Skala Likert. Dengan jumlah 15 butir pernyataan dan skor maksimum 5, maka skor ideal yang diperoleh adalah 15 × 5 = 75. Selanjutnya, persentase kelayakan yang dihasilkan diinterpretasikan berdasarkan kriteria sebagaimana disajikan pada Tabel 3.x berikut.

**Tabel 3.x** Skala Interpretasi Persentase Kelayakan
| Persentase | Kategori |
|---|---|
| 81% – 100% | Sangat Layak |
| 61% – 80% | Layak |
| 41% – 60% | Cukup Layak |
| 21% – 40% | Kurang Layak |
| 0% – 20% | Tidak Layak |


Analisis dilakukan pada dua tingkatan, yaitu analisis per kategori dan analisis keseluruhan. Analisis per kategori bertujuan untuk mengidentifikasi aspek mana yang memperoleh penilaian tertinggi maupun terendah, sehingga dapat dijadikan dasar evaluasi pengembangan sistem di masa mendatang. Sementara itu, analisis keseluruhan memberikan gambaran umum mengenai tingkat penerimaan pengguna terhadap sistem secara utuh.

### 3.x.3 Profil Responden

Responden dalam pengujian UAT ini adalah pemilik UMKM Mie Jawa Melati yang berperan sebagai pengguna utama (*primary user*) sistem POS PWA. Pengujian dilaksanakan secara langsung di lokasi usaha dengan menggunakan perangkat yang dioperasikan sehari-hari oleh responden. Hal ini dilakukan agar evaluasi yang diberikan mencerminkan pengalaman penggunaan dalam kondisi operasional yang sesungguhnya. Profil responden disajikan pada Tabel 3.x berikut.

**Tabel 3.x** Profil Responden UAT
| Keterangan | Isian |
|---|---|
| Nama | ........................................................ |
| Jabatan | Pemilik Usaha |
| Nama Usaha | Mie Jawa Melati |
| Tanggal Pengujian | ........................................................ |
| Perangkat yang Digunakan | ........................................................ |
