import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";

export const useTransactionMutations = () => {
  const utils = api.useUtils();
  const { postMessage } = useBroadcastChannel("pos-sync-channel");

  // Invalidasi cache agar tabel/grafik refresh
  const invalidateQueries = () => {
    void utils.transaction.getTransactionReport.invalidate();
    void utils.transaction.getReportStats.invalidate();
    void utils.transaction.getDashboardStats.invalidate();
    void utils.transaction.getRevenueChart.invalidate();
    void utils.transaction.getReportChart.invalidate();

    // Beritahu PWA tab lain (seperti Dashboard) agar instan terupdate
    postMessage({ type: "TRANSACTION_CREATED", payload: null });
    // Same-tab notification (BroadcastChannel doesn't deliver to sender)
    window.dispatchEvent(
      new CustomEvent("pos-sync-channel", {
        detail: { type: "TRANSACTION_CREATED" },
      }),
    );
  };

  const deleteTransaction = api.transaction.deleteTransaction.useMutation({
    onSuccess: () => {
      toast.success("Transaksi dihapus", {
        description: "Data transaksi berhasil dihapus secara permanen.",
      });
      invalidateQueries();
    },
    onError: (error) => {
      toast.error("Gagal menghapus", {
        description: error.message,
      });
    },
  });

  return { deleteTransaction };
};
