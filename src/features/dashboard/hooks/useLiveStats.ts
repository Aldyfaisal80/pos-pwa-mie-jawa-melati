import { useEffect } from "react";
import { api } from "@/trpc/react";
import { useBroadcastChannel } from "@/hooks/use-broadcast-channel";
import { supabase } from "@/lib/supabase-client";

export const useLiveStats = () => {
  const utils = api.useUtils();

  // 1. LOKAL PWA: Mendengarkan tab lain pada perangkat yang sama (Offline/Online)
  useBroadcastChannel("pos-sync-channel", (message) => {
    if (message.type === "TRANSACTION_CREATED") {
      void utils.transaction.getDashboardStats.invalidate();
      void utils.transaction.getTransactionReport.invalidate();
    }
  });

  // 2. SERVER RTS: Mendengarkan perubahan dari perangkat BERBEDA (seperti Kasir di PC -> Bos di Tablet)
  useEffect(() => {
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
          // Hanya me-refresh jika ada trigger dari Supabase (perangkat lain)
          void utils.transaction.getDashboardStats.invalidate();
          void utils.transaction.getTransactionReport.invalidate();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [utils]);
};
