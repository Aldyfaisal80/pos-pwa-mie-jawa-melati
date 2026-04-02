import { useEffect } from "react";
import { api } from "@/trpc/react";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";
import { supabase } from "@/lib/supabase-client";

export const useLiveStats = () => {
  const utils = api.useUtils();

  // 1. LOCAL PWA: Listen for transactions created on the same device (Offline/Online)
  useBroadcastChannel("pos-sync-channel", (message) => {
    if (message.type === "TRANSACTION_CREATED") {
      // void: intentionally fire-and-forget — suppresses no-floating-promises lint rule
      void utils.transaction.getDashboardStats.invalidate();
      void utils.transaction.getTransactionReport.invalidate();
      void utils.transaction.getRevenueChart.invalidate();
    }
  });

  // 2. SERVER REALTIME: Listen for changes from OTHER devices (e.g. Cashier on PC → Owner on Tablet)
  useEffect(() => {
    // NOTE: `utils` from api.useUtils() is referentially stable (tRPC guarantees this),
    // so including it in deps is safe and does NOT cause repeated subscribe/unsubscribe cycles.
    const channel = supabase
      .channel("supabase_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Transaction",
        },
        () => {
          // void: intentionally fire-and-forget — suppresses no-floating-promises lint rule
          void utils.transaction.getDashboardStats.invalidate();
          void utils.transaction.getTransactionReport.invalidate();
          void utils.transaction.getRevenueChart.invalidate();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [utils]);
};
