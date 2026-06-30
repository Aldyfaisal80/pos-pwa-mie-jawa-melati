"use client";

import { useMemo } from "react";
import { useRevenueChart } from "./useRevenueChart";
import { useOfflinePending } from "@/hooks/useOfflinePending";
import { toWIBDateString } from "@/lib/offline-merge";
import type { PeriodDays } from "../constants/periodOptions";

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const;

/**
 * Wraps useRevenueChart and adds pending transaction amounts to matching
 * chart bars so the revenue graph stays accurate while offline.
 */
export const useOfflineAwareRevenueChart = (days: PeriodDays) => {
  const query = useRevenueChart(days);
  const { pending } = useOfflinePending();

  const merged = useMemo(() => {
    if (!query.data) return undefined;
    if (pending.length === 0) return query.data;

    // Build a map: WIB date string → extra amount from pending
    const pendingByDay = new Map<string, number>();
    for (const trx of pending) {
      const dayStr = toWIBDateString(trx.date);
      pendingByDay.set(dayStr, (pendingByDay.get(dayStr) ?? 0) + trx.totalAmount);
    }

    if (pendingByDay.size === 0) return query.data;

    // Rebuild chart labels → WIB date string mapping for lookup
    const now = new Date();
    return query.data.map((bar, i) => {
      const d = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
      const wibD = new Date(d.getTime() + WIB_OFFSET_MS);
      const useDate = days > 14;

      const label = useDate
        ? `${String(wibD.getUTCDate()).padStart(2, "0")}/${String(wibD.getUTCMonth() + 1).padStart(2, "0")}`
        : DAY_NAMES[wibD.getUTCDay()]!;

      const wibDStr = `${wibD.getUTCFullYear()}-${String(wibD.getUTCMonth() + 1).padStart(2, "0")}-${String(wibD.getUTCDate()).padStart(2, "0")}`;
      const extra = pendingByDay.get(wibDStr) ?? 0;

      // Only merge if the label matches (ensures alignment with server data)
      if (bar.name === label) {
        return { ...bar, total: bar.total + extra };
      }
      return bar;
    });
  }, [query.data, pending, days]);

  return { ...query, data: merged };
};
