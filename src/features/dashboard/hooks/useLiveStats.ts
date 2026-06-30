import { useEffect } from "react";
import { api } from "@/trpc/react";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";
import { supabase } from "@/lib/supabase-client";

export const useLiveStats = () => {
  const utils = api.useUtils();

  // 1. LOCAL PWA: Listen for CRUD events on the same device / other tabs
  useBroadcastChannel("pos-sync-channel", (message) => {
    if (message.type === "TRANSACTION_CREATED") {
      void utils.transaction.getDashboardStats.invalidate();
      void utils.transaction.getTransactionReport.invalidate();
      void utils.transaction.getReportStats.invalidate();
      void utils.transaction.getRevenueChart.invalidate();
    }
    if (message.type === "PRODUCT_UPDATED") {
      void utils.product.getAll.invalidate();
    }
    if (message.type === "CATEGORY_UPDATED") {
      void utils.category.getAll.invalidate();
    }
  });

  // 2. SERVER REALTIME: Listen for changes from OTHER devices via Supabase postgres_changes
  useEffect(() => {
    const invalidateTransactions = () => {
      void utils.transaction.getDashboardStats.invalidate();
      void utils.transaction.getTransactionReport.invalidate();
      void utils.transaction.getReportStats.invalidate();
      void utils.transaction.getRevenueChart.invalidate();
    };

    const channel = supabase
      .channel("pos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Transaction" },
        invalidateTransactions,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Product" },
        () => {
          void utils.product.getAll.invalidate();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Category" },
        () => {
          void utils.category.getAll.invalidate();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [utils]);
};
