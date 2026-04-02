/**
 * offline-db.ts
 * Helper layer untuk IndexedDB — menyimpan antrian transaksi offline.
 * Tidak ada library eksternal, menggunakan IndexedDB API native.
 */

const DB_NAME = "post-pwa-offline";
const DB_VERSION = 1;
const STORE_NAME = "pending_transactions";

export interface PendingTransaction {
  invoiceNumber: string;
  date: string; // ISO string agar bisa di-serialize ke IndexedDB
  totalAmount: number;
  paymentMethod: string;
  paidAmount: number;
  change: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
    note?: string | null;
  }[];
}

// Buka / inisiasi database
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "invoiceNumber" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("IndexedDB open failed"));
  });
};

/** Tambahkan satu transaksi ke antrian lokal */
export const addPendingTransaction = async (
  trx: PendingTransaction,
): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(trx); // put = add or update (idempotent)
    req.onsuccess = () => resolve();
    req.onerror = () =>
      reject(
        req.error instanceof Error ? req.error : new Error(String(req.error)),
      );
    tx.oncomplete = () => db.close();
  });
};

/** Ambil semua transaksi yang belum ter-sync */
export const getAllPendingTransactions = async (): Promise<
  PendingTransaction[]
> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as PendingTransaction[]);
    req.onerror = () =>
      reject(
        req.error instanceof Error ? req.error : new Error(String(req.error)),
      );
    tx.oncomplete = () => db.close();
  });
};

/** Hapus satu transaksi dari antrian (setelah berhasil sync ke server) */
export const removePendingTransaction = async (
  invoiceNumber: string,
): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(invoiceNumber);
    req.onsuccess = () => resolve();
    req.onerror = () =>
      reject(
        req.error instanceof Error ? req.error : new Error(String(req.error)),
      );
    tx.oncomplete = () => db.close();
  });
};

/** Hitung jumlah transaksi yang masih pending */
export const getPendingCount = async (): Promise<number> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(
        req.error instanceof Error ? req.error : new Error(String(req.error)),
      );
    tx.oncomplete = () => db.close();
  });
};
