# Diagram Alur Aplikasi POS Mie Jawa Melati

> Dokumen ini berisi diagram-diagram alur yang menggambarkan navigasi dan proses utama dalam aplikasi POS PWA.
> Cocok untuk dimasukkan ke laporan skripsi sebagai lampiran diagram atau di dalam BAB IV.

---

## 1. Diagram Alur Navigasi Sistem (Flowchart Halaman)

Diagram ini menggambarkan keseluruhan struktur navigasi antar halaman aplikasi, dimulai dari akses awal hingga seluruh fitur tersedia.

```mermaid
flowchart TD
    A(["🌐 Pengguna Buka URL"]) --> B{"Middleware\nvalidasi sesi"}
    B -- "Sesi VALID" --> C[/"🏠 Beranda (/)"\]
    B -- "Sesi TIDAK VALID" --> D[/"🔐 Login (/login)"\]

    D --> E["Isi Email\n& Password"]
    E --> F{"Autentikasi\nSupabase Auth"}
    F -- "Gagal" --> G["⚠️ Tampilkan\nPesan Error"]
    G --> E
    F -- "Berhasil" --> C

    C --> H[/"📊 Dashboard\n(/dashboard)"\]
    C --> I[/"🛒 Kasir / POS\n(/pos)"\]
    C --> J[/"📦 Produk\n(/products)"\]
    C --> K[/"📈 Laporan\n(/reports)"\]

    H -.->|"Sidebar Nav"| I
    H -.->|"Sidebar Nav"| J
    H -.->|"Sidebar Nav"| K
    I -.->|"Sidebar Nav"| H
    J -.->|"Sidebar Nav"| K
    K -.->|"Sidebar Nav"| H

    C --> L["👤 Menu Akun\n(Popup)"]
    L --> M[/"⚙️ Pengaturan\n(/settings)"\]
    L --> N["✏️ Edit Profil\n(Modal)"]
    L --> O(["🚪 Keluar →\n/login"])

    style A fill:#1a1a2e,color:#eee,stroke:#4a4a8a
    style O fill:#2d1b1b,color:#eee,stroke:#8a4a4a
    style D fill:#1e3a5f,color:#eee,stroke:#4a7ab5
    style C fill:#1a3a2a,color:#eee,stroke:#4a8a6a
    style I fill:#3a1a1a,color:#eee,stroke:#8a4a4a
```

---

## 2. Diagram Alur Proses Transaksi Kasir (Activity Diagram)

Diagram ini menggambarkan alur lengkap satu siklus transaksi kasir, dari pembukaan halaman hingga keranjang dikosongkan untuk transaksi berikutnya.

```mermaid
flowchart TD
    A(["▶ Buka /pos"]) --> B["Muat Produk\ndari Server"]
    B --> C["Tampilkan Katalog\n& Filter Kategori"]
    C --> D{"Pilih\nKategori?"}
    D -- "Ya" --> E["Filter Produk\nberdasar Kategori"]
    D -- "Tidak" --> F["Tampilkan\nSemua Produk"]
    E --> G["Klik Kartu Produk"]
    F --> G

    G --> H["Item Ditambah\nke Keranjang"]
    H --> I{"Edit\nKuantitas?"}
    I -- "Ya" --> J["Input Angka / ±\ndi Keranjang"]
    J --> K{"Tambah\nCatatan?"}
    I -- "Tidak" --> K
    K -- "Ya" --> L["Buka NoteModal\n→ Isi Catatan\n(+ opsional split qty)"]
    L --> M{"Tambah\nItem Lain?"}
    K -- "Tidak" --> M
    M -- "Ya" --> G
    M -- "Tidak" --> N["Klik Tombol 'Bayar'"]

    N --> O["Buka CheckoutModal\nRingkasan Pesanan"]
    O --> P{"Pilih\nMetode Bayar"}
    P -- "Tunai (CASH)" --> Q["Masukkan\nNominal Diterima"]
    Q --> R["Hitung Kembalian\nOtomatis"]
    R --> S["Klik 'Proses'"]
    P -- "QRIS / Transfer" --> S

    S --> T{"Koneksi\nInternet?"}
    T -- "Online" --> U["Simpan ke Supabase\n(Server)"]
    T -- "Offline" --> V["Simpan ke\nAntrean Lokal"]
    V --> W["Sync otomatis\nsaat Online kembali"]

    U --> X["Tampilkan\nReceiptModal\n(Struk Digital)"]
    W --> X

    X --> Y{"Cetak\nStruk?"}
    Y -- "Ya" --> Z["Cetak via\nBluetooth Printer\n(Web BT API)"]
    Z --> AA["Klik 'Selesai'"]
    Y -- "Tidak" --> AA
    AA --> AB(["🔄 Keranjang Dikosongkan\n→ Siap Transaksi Baru"])

    style A fill:#1a3a2a,color:#eee,stroke:#4a8a6a
    style AB fill:#1a3a2a,color:#eee,stroke:#4a8a6a
    style T fill:#3a3a1a,color:#eee,stroke:#8a8a4a
    style V fill:#3a2a1a,color:#eee,stroke:#8a6a4a
    style W fill:#3a2a1a,color:#eee,stroke:#8a6a4a
```

---

## 3. Diagram Alur Manajemen Produk (CRUD Flowchart)

Diagram ini menggambarkan operasi-operasi yang tersedia pada halaman Manajemen Produk.

```mermaid
flowchart TD
    A(["▶ Buka /products"]) --> B["Muat Daftar\nProduk & Kategori"]
    B --> C["Tampilkan\nTabel Produk"]

    C --> D{"Pilih\nAksi"}

    D -- "Tambah Produk" --> E["Buka ProductFormModal\n(Mode Create)"]
    E --> F["Isi Nama, Harga,\nKategori, Gambar"]
    F --> G{"Validasi\nZod Schema"}
    G -- "Gagal" --> H["Tampilkan Error\ndi Field"]
    H --> F
    G -- "Berhasil" --> I["Simpan ke\nDatabase via tRPC"]
    I --> J["Toast Sukses\n& Tabel Diperbarui"]

    D -- "Edit Produk" --> K["Buka ProductFormModal\n(Mode Edit, terisi data)"]
    K --> L["Ubah Data\nProduk"]
    L --> G

    D -- "Hapus Produk" --> M["Tampilkan\nDialog Konfirmasi"]
    M -- "Batalkan" --> C
    M -- "Konfirmasi" --> N["Hapus dari\nDatabase via tRPC"]
    N --> O["Toast Sukses\n& Produk Dihapus"]

    D -- "Kelola Kategori" --> P["Buka CategoryManagerModal"]
    P --> Q{"Aksi\nKategori"}
    Q -- "Tambah" --> R["Isi Nama → Simpan"]
    Q -- "Edit" --> S["Ubah Nama → Simpan"]
    Q -- "Hapus" --> T["Konfirmasi → Hapus"]
    R --> U["Kategori Diperbarui\ndi Kasir & Filter"]
    S --> U
    T --> U

    D -- "Cari Produk" --> V["Filter Tabel\nReal-time berdasar Nama"]
    V --> C

    J --> C
    O --> C
    U --> C

    style A fill:#1a2a3a,color:#eee,stroke:#4a6a8a
```

---

## 4. Diagram Alur Laporan Penjualan (Reporting Flowchart)

```mermaid
flowchart TD
    A(["▶ Buka /reports"]) --> B["Muat Transaksi\n(Default: Hari Ini)"]
    B --> C["Tampilkan:\n- Kartu Statistik\n- Tabel Transaksi\n- Pagination"]

    C --> D{"Pilih\nAksi Filter"}

    D -- "Cari No. Nota" --> E["Input Teks Bebas\n→ Filter Instan"]
    D -- "Pilih Metode Bayar" --> F["Dropdown:\nSemua/Tunai/QRIS/Transfer"]
    D -- "Pilih Rentang Tanggal" --> G["Input Tanggal\nMulai & Akhir"]
    D -- "Ubah Baris/Halaman" --> H["Dropdown:\n10/25/50/100 baris"]

    E --> I["Data Diperbarui\n+ Statistik Terupdate"]
    F --> I
    G --> I
    H --> I
    I --> C

    C --> J{"Klik\nBaris Transaksi?"}
    J -- "Ya" --> K["Buka TransactionDetailModal\n(Detail item, total, kembalian)"]
    K --> L["Tutup Modal"]
    L --> C
    J -- "Tidak" --> M{"Export\nCSV?"}
    M -- "Ya" --> N["Download .csv\nsesuai Filter Aktif"]
    N --> C
    M -- "Tidak" --> O{"Navigasi\nHalaman?"}
    O -- "Ya" --> P["Next/Prev/First/Last"]
    P --> B
    O -- "Tidak" --> C

    style A fill:#1a2a1a,color:#eee,stroke:#4a8a4a
    style K fill:#2a1a2a,color:#eee,stroke:#8a4a8a
```

---

## 5. Diagram Alur Pengaturan Printer Bluetooth

```mermaid
flowchart TD
    A(["▶ Buka /settings\nTab Printer"]) --> B{"Printer pernah\ndipasangkan?"}

    B -- "Ya\n(savedPrinterName ada)" --> C["Auto-reconnect:\ngetDevices() API"]
    C --> D{"Reconnect\nBerhasil?"}
    D -- "Ya" --> E["✅ Status: Terhubung\n(Hijau + Nama Printer)"]
    D -- "Tidak" --> F["⚠️ Status: Terputus\n(Nama terakhir tetap tampil)"]

    B -- "Belum" --> G["Status: Terputus\n(Belum ada printer)"]

    F --> H["Klik 'Hubungkan Printer'"]
    G --> H
    H --> I["Browser Dialog\nBluetooth Muncul"]
    I --> J{"Pengguna\nMemilih Printer?"}
    J -- "Batal" --> F
    J -- "Ya" --> K["Koneksi Dibuat"]
    K --> E

    E --> L["Atur Preferensi Cetak"]
    L --> M["Toggle: Cetak Otomatis\nToggle: Tampilkan Logo\nToggle: Tampilkan Footer"]
    M --> N["Preferensi Tersimpan\ndi localStorage"]

    E --> O{"Putuskan\nKoneksi?"}
    O -- "Ya" --> P["Klik 'Putuskan'"]
    P --> F

    style A fill:#1a1a3a,color:#eee,stroke:#4a4a8a
    style E fill:#1a3a1a,color:#eee,stroke:#4a8a4a
    style F fill:#3a1a1a,color:#eee,stroke:#8a4a4a
    style C fill:#2a2a1a,color:#eee,stroke:#8a8a4a
```

---

## 6. Diagram Relasi Antar Halaman (Navigation Map)

```mermaid
graph LR
    LOGIN[/"🔐 Login"\] -->|Autentikasi Berhasil| BERANDA

    BERANDA[/"🏠 Beranda"\] -->|Quick Action| KASIR
    BERANDA -->|Quick Action| PRODUK
    BERANDA -->|Quick Action| LAPORAN
    BERANDA -->|Quick Action| DASHBOARD

    DASHBOARD[/"📊 Dashboard"\] ---|Sidebar| KASIR
    DASHBOARD ---|Sidebar| PRODUK
    DASHBOARD ---|Sidebar| LAPORAN
    KASIR[/"🛒 Kasir"\] ---|Sidebar| PRODUK
    KASIR ---|Sidebar| LAPORAN
    PRODUK[/"📦 Produk"\] ---|Sidebar| LAPORAN
    LAPORAN[/"📈 Laporan"\]

    BERANDA -->|Menu Akun| PENGATURAN[/"⚙️ Pengaturan"\]
    LAPORAN ---|Sidebar| PENGATURAN
    DASHBOARD ---|Sidebar| PENGATURAN
    KASIR ---|Sidebar| PENGATURAN
    PRODUK ---|Sidebar| PENGATURAN

    PENGATURAN -->|Logout| LOGIN
    BERANDA -->|Logout| LOGIN

    style LOGIN fill:#1e3a5f,color:#eee,stroke:#4a7ab5
    style BERANDA fill:#1a3a2a,color:#eee,stroke:#4a8a6a
    style KASIR fill:#3a1a1a,color:#eee,stroke:#8a4a4a
    style PENGATURAN fill:#2a2a1a,color:#eee,stroke:#8a8a4a
```

---

## Keterangan Diagram

| Simbol | Makna |
|--------|-------|
| `(["..."])` | Titik Mulai / Titik Akhir (Terminal) |
| `[/"..."\]` | Halaman / Layar |
| `{"..."}` | Kondisi / Keputusan (*Decision*) |
| `["..."]` | Proses / Aksi (*Process*) |
| `-->` | Alur utama (*Primary Flow*) |
| `-.->` | Alur opsional / navigasi sidebar |
| `---|` | Akses dua arah (*Bidirectional*) |
