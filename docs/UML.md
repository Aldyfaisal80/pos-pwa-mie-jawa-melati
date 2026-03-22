# UML Diagrams — Post PWA

> Comprehensive UML documentation for the POS-PWA system.

---

## 1. Use Case Diagram

Menampilkan interaksi aktor (Kasir) dengan semua fitur yang tersedia di sistem.

![Post PWA — Use Case Diagram](./uml-usecase.png)

<details>
<summary>📝 Mermaid Text Version</summary>

```mermaid
graph TB
    Kasir(("Kasir"))

    subgraph POS-PWA System
        subgraph Cashier Operations
            UC1["Melihat Katalog Produk"]
            UC2["Menambah Item ke Keranjang"]
            UC3["Menambah Catatan Item"]
            UC4["Proses Pembayaran"]
            UC5["Mencetak Struk"]
        end

        subgraph Product Management
            UC6["Mengelola Produk CRUD"]
            UC7["Mengelola Kategori"]
            UC8["Upload Gambar Produk"]
        end

        subgraph Reports
            UC9["Melihat Laporan Transaksi"]
            UC10["Export Laporan CSV"]
            UC11["Melihat Dashboard"]
        end

        subgraph Settings
            UC12["Mengatur Profil Toko"]
            UC13["Mengubah Tema"]
        end

        subgraph Offline
            UC14["Transaksi Offline"]
            UC15["Sinkronisasi Data"]
        end
    end

    Kasir --> UC1
    Kasir --> UC2
    Kasir --> UC3
    Kasir --> UC4
    Kasir --> UC5
    Kasir --> UC6
    Kasir --> UC7
    Kasir --> UC8
    Kasir --> UC9
    Kasir --> UC10
    Kasir --> UC11
    Kasir --> UC12
    Kasir --> UC13
    UC4 -.->|"extends"| UC14
    UC14 -.->|"includes"| UC15
```

</details>

**Aktor:**
- **Kasir** — Pengguna utama sistem POS

**Use Cases:**

| Grup | Use Case | Deskripsi |
|------|----------|-----------|
| Kasir | Melihat Katalog Produk | Browse produk berdasarkan kategori |
| Kasir | Menambah Item ke Keranjang | Pilih produk dan atur qty |
| Kasir | Menambah Catatan Item | Tambah note khusus per item |
| Kasir | Proses Pembayaran | Checkout dengan metode bayar |
| Kasir | Mencetak Struk | Tampilkan / cetak receipt |
| Produk | Mengelola Produk (CRUD) | Tambah, edit, hapus produk |
| Produk | Mengelola Kategori | Tambah, hapus kategori |
| Produk | Upload Gambar Produk | Upload via Supabase Storage |
| Laporan | Melihat Laporan Transaksi | Report dengan filter & sort |
| Laporan | Export Laporan CSV | Download data transaksi |
| Laporan | Melihat Dashboard | Statistik hari ini & chart |
| Setting | Mengatur Profil Toko | Nama, alamat, logo toko |
| Setting | Mengubah Tema | Light / Dark mode |
| Offline | Transaksi Offline | Checkout tanpa internet |
| Offline | Sinkronisasi Data | Auto-sync saat online |

**Relasi:**
- `Transaksi Offline` **extends** `Proses Pembayaran`
- `Sinkronisasi Data` **includes** `Transaksi Offline`

---

## 2. Class Diagram

Menampilkan struktur data model beserta atribut, method, dan relasi antar class.

![Post PWA — Class Diagram](./uml-class.png)

<details>
<summary>📝 Mermaid Text Version</summary>

```mermaid
classDiagram
    class Category {
        +int id
        +string name
        +DateTime createdAt
        +DateTime updatedAt
        +getAll() Category[]
        +create(name) Category
        +delete(id) void
    }

    class Product {
        +string id
        +string name
        +string description
        +Decimal price
        +string image
        +boolean isAvailable
        +int categoryId
        +DateTime createdAt
        +DateTime updatedAt
        +getAll(filter) Product[]
        +create(data) Product
        +update(id, data) Product
        +delete(id) void
    }

    class Transaction {
        +string id
        +string invoiceNumber
        +DateTime date
        +Decimal totalAmount
        +PaymentMethod paymentMethod
        +Decimal paidAmount
        +Decimal change
        +boolean isSynced
        +syncOfflineData(batch) Transaction[]
        +delete(id) void
        +getReport(filters) PaginatedResult
        +getDashboardStats() DashboardStats
        +getRevenueChart(days) ChartData[]
    }

    class TransactionItem {
        +string id
        +string transactionId
        +string productId
        +string productName
        +int quantity
        +Decimal unitPrice
        +Decimal subTotal
        +string note
    }

    class StoreConfig {
        +int id
        +string name
        +string address
        +string phone
        +string logoUrl
        +getProfile() StoreConfig
        +updateProfile(data) StoreConfig
    }

    class PaymentMethod {
        <<enumeration>>
        CASH
        QRIS
        TRANSFER
    }

    Category "1" --> "0..*" Product : has
    Product "1" --> "0..*" TransactionItem : referenced by
    Transaction "1" *-- "1..*" TransactionItem : contains
    Transaction --> PaymentMethod : uses
```

</details>

**Classes:**

| Class | Tipe | Atribut Utama | Method Utama |
|-------|------|--------------|--------------|
| `Category` | Entity | id, name | getAll, create, delete |
| `Product` | Entity | id, name, price, isAvailable, categoryId | getAll, create, update, delete (soft) |
| `Transaction` | Entity | id, invoiceNumber, totalAmount, paymentMethod, isSynced | syncOfflineData, delete, getReport, getDashboardStats |
| `TransactionItem` | Entity | id, transactionId, productId, productName, quantity, unitPrice | — (managed via Transaction) |
| `StoreConfig` | Singleton | id, name, address, phone, logoUrl | getProfile, updateProfile |
| `PaymentMethod` | Enum | CASH, QRIS, TRANSFER | — |

**Relasi:**
- `Category` **1 → 0..\*** `Product` (one-to-many)
- `Product` **1 → 0..\*** `TransactionItem` (one-to-many)
- `Transaction` **1 → 1..\*** `TransactionItem` (composition, cascade delete)
- `Transaction` **uses** `PaymentMethod` (dependency)

---

## 3. Component Diagram

Menampilkan arsitektur komponen sistem dan dependensi antar layer.

![Post PWA — Component Diagram](./uml-component.png)

<details>
<summary>📝 Mermaid Text Version</summary>

```mermaid
graph TB
    subgraph Presentation Layer
        C1["Cashier Module"]
        C2["Product Module"]
        C3["Report Module"]
        C4["Dashboard Module"]
        C5["Store Settings"]
        C6["Shared UI"]
    end

    subgraph Application Layer
        A1["tRPC Client"]
        A2["Offline Manager"]
        A3["Theme Manager"]
        A4["Network Monitor"]
    end

    subgraph Server Layer
        S1["tRPC Routers"]
        S2["Zod Validators"]
        S3["Prisma ORM"]
        S4["Error Filter"]
    end

    subgraph Infrastructure
        I1[("PostgreSQL")]
        I2["Serwist SW"]
        I3["Supabase Storage"]
    end

    C1 --> A1
    C1 --> A2
    C2 --> A1
    C3 --> A1
    C4 --> A1
    C5 --> A1
    C1 --> C6
    C2 --> C6
    C3 --> C6
    A1 --> S1
    A2 --> A4
    A2 --> S1
    S1 --> S2
    S1 --> S4
    S2 --> S3
    S3 --> I1
    C2 --> I3
    C1 --> I2
```

</details>

**Layer Architecture:**

| Layer | Komponen | Teknologi |
|-------|----------|-----------|
| **Presentation** | Cashier, Product, Report, Dashboard, Store Settings, Shared UI | React, Shadcn UI, Vaul |
| **Application** | tRPC Client, Offline Manager, Theme Manager, Network Monitor | TanStack Query, IndexedDB, next-themes |
| **Server** | tRPC Routers, Zod Validators, Prisma ORM, Error Filter | tRPC, Zod, Prisma |
| **Infrastructure** | PostgreSQL, Service Worker, Supabase Storage | Supabase, Serwist |

**Dependency Flow:**
```
Presentation → Application → Server → Infrastructure
```

---

## 4. Activity Diagram — Checkout Flow

Menampilkan alur proses checkout dari awal hingga struk dicetak, termasuk handling offline.

![Post PWA — Activity Diagram: Checkout Flow](./uml-activity.png)

<details>
<summary>📝 Mermaid Text Version</summary>

```mermaid
flowchart TD
    Start(("Start")) --> A["Buka halaman kasir"]
    A --> B["Melihat katalog produk"]
    B --> C["Menambah item ke keranjang"]
    C --> D{"Tambah item lagi?"}
    D -->|"Ya"| C
    D -->|"Tidak"| E["Review keranjang"]
    E --> F["Buka checkout"]
    F --> G["Pilih metode pembayaran"]
    G --> H{"Metode = CASH?"}
    H -->|"Ya"| I["Input jumlah bayar"]
    H -->|"Tidak"| J["Klik Proses Pembayaran"]
    I --> J
    J --> K{"Online?"}
    K -->|"Ya"| L["Simpan ke Supabase via tRPC"]
    K -->|"Tidak"| M["Simpan ke IndexedDB"]
    M --> N["Update pending counter"]
    L --> O["Tampilkan struk"]
    N --> O
    O --> P["Reset keranjang"]
    P --> End(("End"))
```

</details>

**Alur:**

| Step | Aksi | Kondisi |
|------|------|---------|
| 1 | Buka halaman kasir | — |
| 2 | Lihat katalog produk | — |
| 3 | Tambah item ke keranjang | Loop sampai selesai |
| 4 | Review keranjang | — |
| 5 | Buka checkout | — |
| 6 | Pilih metode pembayaran | CASH / QRIS / TRANSFER |
| 7 | Input jumlah bayar | Hanya jika CASH |
| 8 | Proses pembayaran | — |
| 9a | Simpan ke Supabase | Jika **Online** |
| 9b | Simpan ke IndexedDB | Jika **Offline** → pending sync |
| 10 | Tampilkan struk | — |
| 11 | Reset keranjang | — |

**Decision Points:**
- **Tambah item lagi?** → Ya: kembali ke step 3
- **Metode = CASH?** → Ya: input jumlah bayar / Tidak: skip
- **Online?** → Ya: simpan ke server / Tidak: simpan lokal

---

## Diagram Index

| Diagram | File Gambar | Deskripsi |
|---------|-------------|-----------|
| Use Case | `uml-usecase.png` | Interaksi aktor dengan sistem |
| Class | `uml-class.png` | Data model dan relasi |
| Component | `uml-component.png` | Arsitektur komponen |
| Activity | `uml-activity.png` | Alur proses checkout |
| ERD | `erd-diagram.png` | Entity Relationship (lihat [DATABASE.md](./DATABASE.md)) |
| Data Flow | `data-flow-diagram.png` | Aliran data (lihat [ARCHITECTURE.md](./ARCHITECTURE.md)) |
| Offline Sync | `offline-sync-diagram.png` | Sequence sync (lihat [ARCHITECTURE.md](./ARCHITECTURE.md)) |
