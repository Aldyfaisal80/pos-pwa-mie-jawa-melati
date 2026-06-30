"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getAllPendingTransactions,
  getPendingCount,
  removePendingTransaction,
} from "@/lib/offline-db";
import { type PaymentMethod as ServerPaymentMethod } from "@/server/validations/transaction.validation";
import { useBroadcastChannel } from "./useBroadcastChannel";
import { vanillaTrpcClient } from "@/trpc/vanilla-client";

// Error codes that are never recoverable — server returns these via errorCode field
const UNRECOVERABLE_SERVER_CODES = new Set(["DUPLICATE", "FK_VIOLATION"]);

// Fallback: inspect tRPCClientError message for legacy/unclassified server errors
const isLegacyUnrecoverableError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    (msg.includes("unique constraint") && msg.includes("invoicenumber")) ||
    msg.includes("foreign key constraint") ||
    msg.includes("foreign key violation") ||
    msg.includes("p2002") ||
    msg.includes("p2003") ||
    msg.includes("p2025")
  );
};

export const useOfflineSync = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  // isSyncingRef guards the loop — survives re-renders unlike useState
  const isSyncingRef = useRef(false);
  const { postMessage } = useBroadcastChannel("pos-sync-channel");

  // Refresh jumlah pending dari IndexedDB
  const refreshCount = useCallback(async () => {
    if (typeof window === "undefined") return;
    const count = await getPendingCount();
    setPendingCount(count);
  }, []);

  // Sinkronisasi semua pending ke server.
  // Menggunakan vanilla tRPC client (bukan useMutation) agar loop tidak
  // terputus oleh page re-render/unmount yang dipicu Next.js RSC refresh.
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
      // Hentikan loop jika koneksi putus di tengah sync
      if (!navigator.onLine) break;

      try {
        const results =
          await vanillaTrpcClient.transaction.syncOfflineData.mutate([
            {
              invoiceNumber: trx.invoiceNumber,
              date: new Date(trx.date),
              totalAmount: trx.totalAmount,
              paymentMethod:
                trx.paymentMethod as unknown as ServerPaymentMethod,
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

        // Server returns per-item result array
        const result = results[0];

        if (result?.success) {
          try { await removePendingTransaction(trx.invoiceNumber); } catch { /* IndexedDB error — keep in queue */ }
          successCount++;
        } else if (
          result?.errorCode &&
          UNRECOVERABLE_SERVER_CODES.has(result.errorCode)
        ) {
          // Unrecoverable: purge dari antrian tanpa retry
          try { await removePendingTransaction(trx.invoiceNumber); } catch { /* IndexedDB error — will retry purge next sync */ }
          purgedCount++;
        } else {
          // Transient/unknown error — biarkan di queue untuk retry berikutnya
          failCount++;
        }
      } catch (error) {
        // Network/tRPC-level error (bukan aplikasi error)
        if (isLegacyUnrecoverableError(error)) {
          try { await removePendingTransaction(trx.invoiceNumber); } catch { /* IndexedDB error */ }
          purgedCount++;
        } else {
          failCount++;
        }
      }
    }

    setIsSyncing(false);
    isSyncingRef.current = false;
    await refreshCount();

    if (successCount > 0) {
      postMessage({ type: "TRANSACTION_CREATED" });
      window.dispatchEvent(new CustomEvent("pos-pending-changed"));
      toast.success(`Sinkronisasi Berhasil`, {
        description: `${successCount} transaksi offline berhasil diunggah ke server.`,
      });
    }
    if (purgedCount > 0) {
      toast.warning(`${purgedCount} transaksi tidak dapat disinkronkan`, {
        description:
          "Data produk tidak lagi valid atau pesanan sudah ada. Transaksi telah dihapus dari antrian.",
      });
    }
    if (failCount > 0) {
      toast.error(
        `${failCount} transaksi gagal disinkronkan, coba lagi nanti.`,
      );
    }
  }, [refreshCount, postMessage]);

  // Auto-sync saat koneksi kembali online + instant refresh on same-tab event
  useEffect(() => {
    void refreshCount();

    const handleOnline = () => {
      void refreshCount();
      void syncNow();
    };

    const handlePendingChanged = () => void refreshCount();

    window.addEventListener("online", handleOnline);
    window.addEventListener("pos-pending-changed", handlePendingChanged);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("pos-pending-changed", handlePendingChanged);
    };
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
