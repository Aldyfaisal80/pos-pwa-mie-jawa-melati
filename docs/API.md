# API Reference — Post PWA

> All endpoints are served via tRPC over HTTP. Access via `api.{router}.{procedure}` using tRPC React hooks.

---

## Router Overview

| Router | Namespace | Procedures |
|--------|-----------|------------|
| [Product](#product-router) | `api.product.*` | `getAll`, `create`, `update`, `delete` |
| [Category](#category-router) | `api.category.*` | `getAll`, `create`, `delete` |
| [Transaction](#transaction-router) | `api.transaction.*` | `syncOfflineData`, `deleteTransaction`, `getTransactionReport`, `exportTransactionReport`, `getDashboardStats`, `getRevenueChart` |
| [Store](#store-router) | `api.store.*` | `getProfile`, `updateProfile` |

---

## Product Router

### `product.getAll` — Query

Get all products with optional filtering.

**Input (optional):**

| Field | Type | Description |
|-------|------|-------------|
| `categoryId` | `number?` | Filter by category |
| `search` | `string?` | Search by name (case insensitive) |
| `onlyAvailable` | `boolean?` | Filter only available products |

**Response:** `Product[]` (includes `category` relation)

---

### `product.create` — Mutation

Create a new product.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ✅ | Product name (1–100 chars) |
| `description` | `string?` | — | Up to 255 chars |
| `price` | `number` | ✅ | Unit price (≥ 0) |
| `image` | `string?` | — | Image URL |
| `categoryId` | `number` | ✅ | Category ID (FK) |
| `isAvailable` | `boolean?` | — | Default: `true` |

**Response:** Created `Product` object

---

### `product.update` — Mutation

Update an existing product.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Product UUID |
| `data` | `Partial<CreateProduct>` | ✅ | Fields to update |

**Response:** Updated `Product` object  
**Errors:** `404` if product not found

---

### `product.delete` — Mutation

Soft-delete a product (sets `isAvailable = false`).

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Product UUID |

**Response:** Updated `Product` object

---

## Category Router

### `category.getAll` — Query

Get all categories ordered by ID ascending.

**Input:** None  
**Response:** `Category[]`

---

### `category.create` — Mutation

Create a new category.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ✅ | Category name (1–50 chars) |

**Response:** Created `Category` object

---

### `category.delete` — Mutation

Delete a category. Handles product reassignment safely.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number` | ✅ | Category ID |

**Business Logic:**
1. If active products exist in category → **Error** (`PRECONDITION_FAILED`)
2. If inactive products exist → moves them to "Arsip Produk" archive category (auto-created if needed)
3. Deletes the category

**Response:** Deleted `Category` object  
**Errors:** `PRECONDITION_FAILED` if category has active products

---

## Transaction Router

### `transaction.syncOfflineData` — Mutation

Batch sync offline transactions to the database.

**Input:** Array of transaction objects:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `invoiceNumber` | `string` | ✅ | Format: `INV-YYYYMMDD-XXXX` |
| `date` | `Date` | ✅ | Transaction date |
| `totalAmount` | `number` | ✅ | Total amount |
| `paymentMethod` | `PaymentMethod` | ✅ | `CASH`, `QRIS`, or `TRANSFER` |
| `paidAmount` | `number` | ✅ | Amount paid |
| `change` | `number` | ✅ | Change returned |
| `items` | `TransactionItem[]` | ✅ | At least 1 item |

**Item Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | `string (uuid)` | ✅ | Product reference |
| `productName` | `string` | ✅ | Product name snapshot |
| `quantity` | `number (int)` | ✅ | Qty ≥ 1 |
| `unitPrice` | `number` | ✅ | Price snapshot ≥ 0 |
| `subTotal` | `number` | ✅ | Line total ≥ 0 |
| `note` | `string?` | — | Item note |

**Response:** Array of created `Transaction` objects  
**Note:** Uses Prisma `$transaction` for atomicity. All items synced with `isSynced = true`.

---

### `transaction.deleteTransaction` — Mutation

Soft-delete a transaction (sets `deletedAt` timestamp). Deleted transactions are excluded from all reports and dashboard stats.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string (uuid)` | ✅ | Transaction ID |

**Response:** Updated `Transaction` object (with `deletedAt` set)  
**Errors:** `NOT_FOUND` if transaction doesn't exist · `CONFLICT` if already deleted

---

### `transaction.getTransactionReport` — Query

Paginated transaction report with filtering and sorting.

**Input:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `startDate` | `Date?` | — | Filter start date |
| `endDate` | `Date?` | — | Filter end date |
| `paymentMethod` | `PaymentMethod?` | — | Filter by payment type |
| `search` | `string?` | — | Search invoice number |
| `sortBy` | `ReportSortBy` | `date` | Sort field |
| `sortOrder` | `asc \| desc` | `desc` | Sort direction |
| `limit` | `number` | `25` | Items per page (1–100) |
| `page` | `number` | `1` | Page number |

**Sort Fields:** `invoiceNumber`, `date`, `paymentMethod`, `totalAmount`, `itemCount`

**Response:**

```typescript
{
  transactions: Transaction[]  // includes items
  totalCount: number
  totalPages: number
  currentPage: number
}
```

---

### `transaction.exportTransactionReport` — Query

Export report data (no pagination). Same filters as `getTransactionReport` minus `limit`/`page`.

**Response:** Array of `{ invoiceNumber, date, paymentMethod, totalAmount }`

---

### `transaction.getDashboardStats` — Query

Get today's dashboard statistics.

**Input:** None

**Response:**

```typescript
{
  totalOmzet: number          // Today's total revenue
  totalTransactions: number   // Today's transaction count
  topProducts: Array<{        // Top 5 products today
    name: string
    sold: number
  }>
}
```

---

### `transaction.getRevenueChart` — Query

Get revenue chart data over N days.

**Input:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `days` | `number` | `7` | Range 1–90 days |

**Response:** `Array<{ name: string, total: number }>`  
Labels: Day names (Sen, Sel, etc.) for ≤14 days, DD/MM format for >14 days.

---

## Store Router

### `store.getProfile` — Query

Get store configuration.

**Input:** None  
**Response:** `StoreConfig` object (falls back to defaults if not configured)

---

### `store.updateProfile` — Mutation

Update store profile (upsert pattern).

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ✅ | Store name (1–100 chars) |
| `address` | `string?` | — | Up to 255 chars |
| `phone` | `string?` | — | Up to 20 chars |
| `logoUrl` | `string (url)?` | — | Logo image URL |

**Response:** Updated/created `StoreConfig` object

---

## Error Handling

All procedures use a centralized `errorFilter` that maps Prisma errors to tRPC errors:

| Prisma Error | tRPC Code | Meaning |
|-------------|-----------|---------|
| `P2025` | `NOT_FOUND` | Record not found |
| `P2002` | `CONFLICT` | Unique constraint violation |
| Other | `INTERNAL_SERVER_ERROR` | Unexpected error |
