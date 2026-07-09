import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";

export const useTransactionMutations = () => {
  const utils = api.useUtils();
  const { postMessage } = useBroadcastChannel("pos-sync-channel");

  const invalidateQueries = () => {
    void utils.transaction.getTransactionReport.invalidate();
    void utils.transaction.getReportStats.invalidate();
    void utils.transaction.getDashboardStats.invalidate();
    void utils.transaction.getRevenueChart.invalidate();
    void utils.transaction.getReportChart.invalidate();

    postMessage({ type: "TRANSACTION_CREATED", payload: null });
    window.dispatchEvent(
      new CustomEvent("pos-sync-channel", {
        detail: { type: "TRANSACTION_CREATED" },
      }),
    );
  };

  const deleteTransaction = api.transaction.deleteTransaction.useMutation({
    // Optimistic update: update dashboard stats cache BEFORE server confirms
    onMutate: async () => {
      await utils.transaction.getDashboardStats.cancel();

      const prevDashboard = utils.transaction.getDashboardStats.getData();

      if (prevDashboard) {
        utils.transaction.getDashboardStats.setData(undefined, (old) => {
          if (!old) return old;
          return {
            ...old,
            totalTransactions: Math.max(0, old.totalTransactions - 1),
          };
        });
      }

      return { prevDashboard };
    },
    onSuccess: () => {
      toast.success("Transaksi dihapus", {
        description: "Data transaksi berhasil dihapus secara permanen.",
      });
      invalidateQueries();
    },
    onError: (error, _vars, ctx) => {
      // Rollback dashboard stats
      if (ctx?.prevDashboard) {
        utils.transaction.getDashboardStats.setData(
          undefined,
          ctx.prevDashboard,
        );
      }
      toast.error("Gagal menghapus", {
        description: error.message,
      });
    },
  });

  return { deleteTransaction };
};
