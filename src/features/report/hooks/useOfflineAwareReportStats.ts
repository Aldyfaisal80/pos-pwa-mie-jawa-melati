"use client";

import { useMemo } from "react";
import { useReportStats } from "./useReportStats";
import { useOfflinePending } from "@/hooks/useOfflinePending";
import type { PaymentMethod } from "@/server/validations";

interface Params {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod | "ALL";
}

/**
 * Wraps useReportStats and adds pending transactions that fall within
 * the selected date range and payment method filter.
 */
export const useOfflineAwareReportStats = ({
  startDate,
  endDate,
  paymentMethod,
}: Params) => {
  const query = useReportStats({ startDate, endDate, paymentMethod });
  const { pending } = useOfflinePending();

  const result = useMemo(() => {
    if (!query.data) return { data: undefined, pendingBreakdown: { omzet: 0, count: 0 } };
    if (pending.length === 0) return { data: query.data, pendingBreakdown: { omzet: 0, count: 0 } };

    // Filter pending by date range & payment method
    const filtered = pending.filter((trx) => {
      const d = new Date(trx.date);
      if (startDate && d < startDate) return false;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (d > endOfDay) return false;
      }
      if (
        paymentMethod &&
        paymentMethod !== "ALL" &&
        trx.paymentMethod !== (paymentMethod as string)
      ) {
        return false;
      }
      return true;
    });

    if (filtered.length === 0) return { data: query.data, pendingBreakdown: { omzet: 0, count: 0 } };

    const pendingOmzet = filtered.reduce((s, t) => s + t.totalAmount, 0);
    const totalOmzet = query.data.totalOmzet + pendingOmzet;
    const totalTransactions = query.data.totalTransactions + filtered.length;
    const avgPerTransaction =
      totalTransactions > 0 ? totalOmzet / totalTransactions : 0;

    return {
      data: { totalOmzet, totalTransactions, avgPerTransaction },
      pendingBreakdown: { omzet: pendingOmzet, count: filtered.length },
    };
  }, [query.data, pending, startDate, endDate, paymentMethod]);

  return { ...query, ...result };
};
