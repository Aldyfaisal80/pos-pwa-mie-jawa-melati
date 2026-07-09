import { api } from "@/trpc/react";
import { toast } from "sonner";
import { type PaymentMethod as ServerPaymentMethod } from "@/server/validations";
import type { CartItem, PaymentMethod } from "../types/cashier.types";
import { generateInvoiceNumber } from "../utils/generateInvoice";
import {
  addPendingTransaction,
  removePendingTransaction,
} from "@/lib/offline-db";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";

interface SyncOptions {
  cart: CartItem[];
  cartTotal: number;
  paymentMethod: PaymentMethod;
  paymentAmount: string;
  /** wasOffline: true = tersimpan lokal (offline/error), false = tersimpan ke server */
  onSuccess: (invoiceNumber: string, wasOffline: boolean) => void;
}

export const useSyncTransaction = () => {
  const utils = api.useUtils();
  const { postMessage } = useBroadcastChannel("pos-sync-channel");

  const syncMutation = api.transaction.syncOfflineData.useMutation({
    onError: (err) => toast.error("Gagal menyimpan: " + err.message),
  });

  const syncTransaction = ({
    cart,
    cartTotal,
    paymentMethod,
    paymentAmount,
    onSuccess,
  }: SyncOptions) => {
    const invoiceNumber = generateInvoiceNumber();
    const paid = paymentMethod === "CASH" ? Number(paymentAmount) : cartTotal;

    const payload = {
      invoiceNumber,
      date: new Date().toISOString(),
      totalAmount: cartTotal,
      paymentMethod,
      paidAmount: paid,
      change: paid - cartTotal,
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.qty,
        unitPrice: item.price,
        subTotal: item.price * item.qty,
        note: item.note || null,
      })),
    };

    if (typeof window !== "undefined" && navigator.onLine) {
      // Simpan dulu ke IndexedDB, hapus setelah server konfirmasi
      void addPendingTransaction(payload)
        .then(() => {
          window.dispatchEvent(new CustomEvent("pos-pending-changed"));
        })
        .catch(() => {
          toast.error("Gagal menyimpan transaksi lokal");
        });

      console.log("[TX] Attempting sync to server...", { invoiceNumber, totalAmount: cartTotal });
      syncMutation.mutate(
        [
          {
            ...payload,
            date: new Date(payload.date),
            paymentMethod:
              payload.paymentMethod as unknown as ServerPaymentMethod,
          },
        ],
        {
          onSuccess: () => {
            console.log("[TX] ✅ Server sync SUCCESS — invalidating queries...");
            // Hapus dari antrian setelah berhasil tersimpan di server
            void removePendingTransaction(invoiceNumber)
              .then(() => {
                window.dispatchEvent(new CustomEvent("pos-pending-changed"));
              })
              .catch(() => {
                // Non-critical: data already on server
              });
            void utils.transaction.invalidate();
            console.log("[TX] invalidate() called, broadcasting TRANSACTION_CREATED");
            postMessage({ type: "TRANSACTION_CREATED" });
            onSuccess(invoiceNumber, false); // online = wasOffline: false
          },
          onError: (error) => {
            // Tetap tampilkan struk; data tersimpan di IndexedDB untuk di-sync nanti
            console.error("[TX] ❌ Server sync FAILED — cache NOT invalidated", error);
            postMessage({ type: "TRANSACTION_CREATED" });
            onSuccess(invoiceNumber, true); // server error = wasOffline: true
          },
        },
      );
    } else {
      void addPendingTransaction(payload)
        .then(() => {
          window.dispatchEvent(new CustomEvent("pos-pending-changed"));
          console.log("[TX] 📡 Offline mode — saved to IndexedDB, broadcasting");
          postMessage({ type: "TRANSACTION_CREATED" });
          onSuccess(invoiceNumber, true);
        })
        .catch(() => {
          toast.error("Gagal menyimpan transaksi offline");
        });
    }
  };

  return {
    syncTransaction,
    isPending: syncMutation.isPending,
  };
};
