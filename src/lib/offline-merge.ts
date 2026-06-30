import type { PendingTransaction } from "@/lib/offline-db";

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Get WIB date string (YYYY-MM-DD) from an ISO date string */
export const toWIBDateString = (isoString: string): string => {
  const utc = new Date(isoString);
  const wib = new Date(utc.getTime() + WIB_OFFSET_MS);
  const y = wib.getUTCFullYear();
  const m = String(wib.getUTCMonth() + 1).padStart(2, "0");
  const d = String(wib.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Check if an ISO date string falls on "today" in WIB */
export const isTodayWIB = (isoString: string): boolean => {
  const todayStr = toWIBDateString(new Date().toISOString());
  return toWIBDateString(isoString) === todayStr;
};

/** Filter pending transactions to only those from today (WIB) */
export const filterTodayPending = (
  pending: PendingTransaction[],
): PendingTransaction[] => pending.filter((trx) => isTodayWIB(trx.date));

/** Aggregate top products from pending transactions */
export const aggregateTopProducts = (
  pending: PendingTransaction[],
): { name: string; sold: number }[] => {
  const map = new Map<string, number>();
  for (const trx of pending) {
    for (const item of trx.items) {
      map.set(item.productName, (map.get(item.productName) ?? 0) + item.quantity);
    }
  }
  return Array.from(map.entries())
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold);
};

/** Merge two top-product arrays, combining quantities for same product name */
export const mergeTopProducts = (
  server: { name: string; sold: number }[],
  offline: { name: string; sold: number }[],
  take = 5,
): { name: string; sold: number }[] => {
  const map = new Map<string, number>();
  for (const p of server) map.set(p.name, (map.get(p.name) ?? 0) + p.sold);
  for (const p of offline) map.set(p.name, (map.get(p.name) ?? 0) + p.sold);
  return Array.from(map.entries())
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, take);
};
