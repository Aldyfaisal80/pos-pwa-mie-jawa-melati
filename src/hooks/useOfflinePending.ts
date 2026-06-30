"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAllPendingTransactions,
  type PendingTransaction,
} from "@/lib/offline-db";
import { useBroadcastChannel } from "./useBroadcastChannel";

/**
 * Reactive access to IndexedDB pending transactions.
 * Re-reads on mount, broadcast events, and online/offline transitions.
 */
export const useOfflinePending = () => {
  const [pending, setPending] = useState<PendingTransaction[]>([]);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      const data = await getAllPendingTransactions();
      setPending(data);
    } catch {
      // IndexedDB unavailable — keep existing state
    }
  }, []);

  // Re-read when a transaction is created or synced (same tab + other tabs)
  useBroadcastChannel("pos-sync-channel", (msg) => {
    if (
      msg.type === "TRANSACTION_CREATED" ||
      msg.type === "TRANSACTION_SYNCED"
    ) {
      void refresh();
    }
  });

  // Re-read on mount + online/offline change + same-tab custom event
  // BroadcastChannel does NOT fire to the same tab that sent the message,
  // so we use a window CustomEvent for same-tab communication.
  useEffect(() => {
    void refresh();

    const handle = () => void refresh();
    window.addEventListener("online", handle);
    window.addEventListener("offline", handle);
    window.addEventListener("pos-pending-changed", handle);
    return () => {
      window.removeEventListener("online", handle);
      window.removeEventListener("offline", handle);
      window.removeEventListener("pos-pending-changed", handle);
    };
  }, [refresh]);

  return { pending, refreshPending: refresh };
};
