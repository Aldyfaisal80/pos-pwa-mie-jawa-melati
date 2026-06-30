"use client";

import { useMemo } from "react";
import { useDashboardStats } from "./useDashboardStats";
import { useOfflinePending } from "@/hooks/useOfflinePending";
import {
  filterTodayPending,
  aggregateTopProducts,
  mergeTopProducts,
} from "@/lib/offline-merge";

/**
 * Wraps useDashboardStats and merges IndexedDB pending transactions
 * so dashboard shows accurate totals even while offline.
 */
export const useOfflineAwareDashboardStats = () => {
  const query = useDashboardStats();
  const { pending } = useOfflinePending();

  const merged = useMemo(() => {
    if (!query.data) return undefined;

    const todayPending = filterTodayPending(pending);
    if (todayPending.length === 0) return query.data;

    const pendingOmzet = todayPending.reduce((s, t) => s + t.totalAmount, 0);
    const pendingCount = todayPending.length;

    const totalOmzet = query.data.totalOmzet + pendingOmzet;
    const totalTransactions = query.data.totalTransactions + pendingCount;
    const avgPerTransaction =
      totalTransactions > 0 ? totalOmzet / totalTransactions : 0;

    const offlineProducts = aggregateTopProducts(todayPending);
    const topProducts = mergeTopProducts(
      query.data.topProducts,
      offlineProducts,
    );

    return { totalOmzet, totalTransactions, avgPerTransaction, topProducts };
  }, [query.data, pending]);

  return {
    ...query,
    data: merged,
    pendingCount: pending.length,
  };
};
