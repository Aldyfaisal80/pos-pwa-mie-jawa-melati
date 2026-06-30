"use client";

import { useMemo } from "react";
import { useReportChart } from "./useReportChart";
import { useOfflinePending } from "@/hooks/useOfflinePending";
import { toWIBDateString } from "@/lib/offline-merge";
import type { PaymentMethod } from "@/server/validations";

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const;

interface Params {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod | "ALL";
}

/**
 * Wraps useReportChart and injects pending transaction totals into
 * matching chart bars so the report graph stays current while offline.
 */
export const useOfflineAwareReportChart = (params: Params) => {
  const query = useReportChart(params);
  const { pending } = useOfflinePending();

  const merged = useMemo(() => {
    if (!query.data) return undefined;
    if (pending.length === 0) return query.data;

    // Filter pending by payment method
    const filtered =
      params.paymentMethod && params.paymentMethod !== "ALL"
        ? pending.filter((t) => t.paymentMethod === (params.paymentMethod as string))
        : pending;

    if (filtered.length === 0) return query.data;

    // Sum pending amounts per WIB date
    const pendingByDay = new Map<string, number>();
    for (const trx of filtered) {
      const dayStr = toWIBDateString(trx.date);
      pendingByDay.set(dayStr, (pendingByDay.get(dayStr) ?? 0) + trx.totalAmount);
    }

    // Build date→label mapping for the chart range
    const now = new Date();
    const rawStart = params.startDate ?? new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
    const rawEnd = params.endDate ?? now;
    const diffMs = rawEnd.getTime() - rawStart.getTime();
    const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const useDate = diffDays > 14;

    return query.data.map((bar, i) => {
      const d = new Date(rawStart.getTime() + i * 24 * 60 * 60 * 1000);
      const wibD = new Date(d.getTime() + WIB_OFFSET_MS);

      const label = useDate
        ? `${String(wibD.getUTCDate()).padStart(2, "0")}/${String(wibD.getUTCMonth() + 1).padStart(2, "0")}`
        : DAY_NAMES[wibD.getUTCDay()]!;

      const wibDStr = `${wibD.getUTCFullYear()}-${String(wibD.getUTCMonth() + 1).padStart(2, "0")}-${String(wibD.getUTCDate()).padStart(2, "0")}`;
      const extra = pendingByDay.get(wibDStr) ?? 0;

      if (bar.name === label) {
        return { ...bar, total: bar.total + extra };
      }
      return bar;
    });
  }, [query.data, pending, params.startDate, params.endDate, params.paymentMethod]);

  return { ...query, data: merged };
};
