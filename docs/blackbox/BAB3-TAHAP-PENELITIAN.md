# BAB III METODOLOGI PENELITIAN

## 3.x Tahap-Tahap Penelitian

Tahap-tahap penelitian dalam pengembangan Sistem POS (*Point of Sale*) berbasis PWA ini disusun mengikuti kerangka kerja *Rapid Application Development* (RAD), yang terdiri atas empat fase utama. Pemilihan metode RAD didasarkan pada kebutuhan pengembangan sistem yang cepat, iteratif, dan berorientasi pada kebutuhan pengguna akhir. Alur tahapan penelitian secara keseluruhan digambarkan pada Gambar 3.x berikut.

**Gambar 3.x** Diagram Alur Tahap-Tahap Penelitian

Secara umum, proses penelitian diawali dengan identifikasi masalah dan pengumpulan data, dilanjutkan dengan empat fase RAD, dan diakhiri dengan penyerahan sistem yang siap digunakan. Uraian masing-masing tahap adalah sebagai berikut.

### 3.x.1 Identifikasi Masalah

Tahap pertama dalam penelitian ini adalah mengidentifikasi permasalahan yang dihadapi oleh UMKM Mie Jawa Melati dalam pengelolaan transaksi penjualan harian. Berdasarkan hasil observasi awal, ditemukan bahwa pencatatan transaksi masih dilakukan secara manual menggunakan catatan kertas, yang rentan terhadap kesalahan perhitungan, kehilangan data, dan ketidakefisienan proses operasional kasir.

### 3.x.2 Pengumpulan Data

Pengumpulan data dilaksanakan melalui dua teknik, yaitu wawancara dan observasi. Wawancara dilakukan secara langsung terhadap pemilik UMKM Mie Jawa Melati untuk memahami kebutuhan fungsional sistem, kendala operasional yang dihadapi, dan harapan terhadap sistem POS yang akan dikembangkan. Observasi dilakukan dengan mengamati proses transaksi harian secara langsung di lokasi usaha untuk mengidentifikasi alur kerja yang perlu diakomodasi oleh sistem.

### 3.x.3 Fase 1 — Perencanaan Kebutuhan (*Requirement Planning*)

Pada fase ini, dilakukan analisis kebutuhan sistem berdasarkan data yang telah dikumpulkan. Kebutuhan fungsional dan non-fungsional diidentifikasi dan didokumentasikan, mencakup fitur-fitur utama seperti manajemen produk, proses transaksi kasir, pencetakan struk, pembuatan laporan penjualan, serta kemampuan operasi secara *offline*. Selain itu, ditentukan pula spesifikasi teknis sistem, yaitu arsitektur berbasis *Progressive Web App* (PWA) dengan teknologi Next.js, Supabase, dan Prisma ORM.

### 3.x.4 Fase 2 — Siklus Prototipe (*Prototype Cycle*)

Fase kedua merupakan inti dari metode RAD, yaitu siklus pengembangan prototipe yang bersifat iteratif. Dalam penelitian ini, siklus prototipe dilaksanakan sebanyak 1 (satu) kali iterasi dengan tiga sub-tahap sebagai berikut.

#### a. Perancangan Desain UI/UX (*Build*)

Sub-tahap pertama dari siklus prototipe adalah perancangan antarmuka pengguna. Pada tahap ini, dibuat *wireframe* untuk seluruh halaman utama sistem, meliputi halaman Beranda (*Dashboard*), Kasir, Manajemen Produk, Laporan Transaksi, dan Pengaturan Toko. Perancangan *wireframe* mengacu pada prinsip *mobile-first design* agar sistem dapat dioperasikan secara optimal melalui perangkat *smartphone* yang umum digunakan oleh pelaku UMKM.

#### b. Demonstrasi ke Pengguna (*Demonstrate*)

Sub-tahap kedua adalah mendemonstrasikan hasil prototipe kepada pemilik UMKM Mie Jawa Melati selaku pengguna utama. Demonstrasi dilakukan dengan menjalankan prototipe aplikasi secara langsung di perangkat pengguna, sehingga pengguna dapat memberikan umpan balik (*feedback*) terkait kesesuaian tampilan, alur navigasi, dan kelengkapan fitur terhadap kebutuhan operasional kasir sehari-hari.

#### c. Perbaikan Prototipe (*Refine*)

Sub-tahap ketiga adalah memperbaiki prototipe berdasarkan umpan balik yang diperoleh dari tahap demonstrasi. Perbaikan mencakup penyesuaian tata letak antarmuka, penambahan fitur yang belum terakomodasi, dan perbaikan alur navigasi. Setelah proses perbaikan selesai, prototipe dievaluasi kembali untuk memastikan kesesuaiannya dengan kebutuhan pengguna sebelum dilanjutkan ke fase berikutnya.

### 3.x.5 Fase 3 — Konstruksi Desain dan Pengujian (*Design Construction and Testing*)

Pada fase ini, prototipe yang telah disetujui dikembangkan menjadi sistem yang utuh dan fungsional. Pengembangan sistem dilakukan menggunakan teknologi Next.js 15 sebagai *framework* utama, Prisma ORM untuk pengelolaan basis data, dan Supabase sebagai layanan *backend-as-a-service*. Setelah proses konstruksi selesai, dilakukan pengujian terhadap sistem menggunakan dua metode pengujian, yaitu:

1. **Pengujian *Blackbox Testing***: Dilakukan untuk memverifikasi bahwa setiap fungsi pada sistem berjalan sesuai dengan spesifikasi kebutuhan yang telah didefinisikan, tanpa memperhatikan struktur internal kode program.
2. **Pengujian Keamanan (*Security Testing*)**: Dilakukan untuk memastikan bahwa sistem memiliki ketahanan terhadap potensi ancaman keamanan, seperti serangan *brute force*, *IDOR* (*Insecure Direct Object Reference*), dan injeksi SQL.

### 3.x.6 Fase 4 — Implementasi Desain dan Rilis (*Design Implementation and Release*)

Fase terakhir dari metode RAD adalah implementasi dan rilis sistem ke lingkungan produksi. Sistem POS PWA dideploy menggunakan platform Vercel untuk memastikan ketersediaan dan performa yang optimal. Setelah proses rilis, dilaksanakan *User Acceptance Test* (UAT) dengan menyerahkan kuesioner kepada pemilik UMKM Mie Jawa Melati untuk mengevaluasi tingkat penerimaan dan kepuasan pengguna terhadap sistem yang telah dikembangkan.
