"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import {
  getAllPendingTransactions,
  getPendingCount,
  removePendingTransaction,
} from "@/lib/offline-db";
import { type PaymentMethod as ServerPaymentMethod } from "@/server/validations/transaction.validation";
import { useBroadcastChannel } from "./use-broadcast-channel";

const isDuplicateInvoiceError = (error: unknown) => {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("unique constraint failed") &&
    message.includes("invoicenumber")
  );
};

// FK violation = productId di IndexedDB tidak ada di DB server
// Terjadi saat DB di-seed/reset ulang sementara IndexedDB punya data lama
// Transaksi ini tidak bisa di-recover → purge dari antrian
const isForeignKeyError = (error: unknown) => {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("foreign key constraint") ||
    message.includes("foreign key violation")
  );
};

const isUnrecoverableError = (error: unknown) =>
  isDuplicateInvoiceError(error) || isForeignKeyError(error);

export const useOfflineSync = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const isSyncingRef = useRef(false);
  const { postMessage } = useBroadcastChannel("pos-sync-channel");

  const syncMutation = api.transaction.syncOfflineData.useMutation();

  // Refresh jumlah pending dari IndexedDB
  const refreshCount = useCallback(async () => {
    if (typeof window === "undefined") return;
    const count = await getPendingCount();
    setPendingCount(count);
  }, []);

  // Sinkronisasi semua pending ke server
  const syncNow = useCallback(async () => {
    if (isSyncingRef.current || !navigator.onLine) return;

    const pending = await getAllPendingTransactions();
    if (pending.length === 0) return;

    isSyncingRef.current = true;
    setIsSyncing(true);

    let successCount = 0;
    let failCount = 0;
    let purgedCount = 0;

    for (const trx of pending) {
      try {
        await syncMutation.mutateAsync([
          {
            invoiceNumber: trx.invoiceNumber,
            date: new Date(trx.date),
            totalAmount: trx.totalAmount,
            paymentMethod: trx.paymentMethod as unknown as ServerPaymentMethod,
            paidAmount: trx.paidAmount,
            change: trx.change,
            items: trx.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subTotal: item.subTotal,
              note: item.note ?? null,
            })),
          },
        ]);
        await removePendingTransaction(trx.invoiceNumber);
        successCount++;
      } catch (error) {
        // Unrecoverable: duplicate invoice atau FK violation (stale productId setelah DB seed)
        // Purge dari antrian — retry tidak akan pernah berhasil
        if (isUnrecoverableError(error)) {
          await removePendingTransaction(trx.invoiceNumber);
          purgedCount++;
          continue;
        }

        failCount++;
      }
    }

    setIsSyncing(false);
    isSyncingRef.current = false;
    await refreshCount();

    if (successCount > 0) {
      postMessage({ type: "TRANSACTION_CREATED" });
      toast.success(`Sinkronisasi Berhasil`, {
        description: `${successCount} transaksi offline berhasil diunggah ke server.`,
      });
    }
    if (purgedCount > 0) {
      toast.warning(
        `${purgedCount} transaksi offline tidak dapat disinkronkan`,
        {
          description:
            "Data produk tidak lagi valid (mungkin karena migrasi database). Transaksi telah dihapus dari antrian.",
        },
      );
    }
    if (failCount > 0) {
      toast.error(
        `${failCount} transaksi gagal disinkronkan, coba lagi nanti.`,
      );
    }
  }, [syncMutation, refreshCount]);

  // Auto-sync saat koneksi kembali online
  useEffect(() => {
    void refreshCount();

    const handleOnline = () => {
      void refreshCount();
      void syncNow();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [refreshCount, syncNow]);

  // Polling jumlah pending setiap 10 detik (kalau ada antrian)
  useEffect(() => {
    const interval = setInterval(() => {
      void refreshCount();
    }, 10_000);
    return () => clearInterval(interval);
  }, [refreshCount]);

  return { pendingCount, isSyncing, syncNow, refreshCount };
};
