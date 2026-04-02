"use client";

import { useEffect, useRef, useCallback } from "react";

type BroadcastMessage = {
  type: "TRANSACTION_CREATED" | "TRANSACTION_SYNCED";
  payload?: unknown;
};

export const useBroadcastChannel = (
  channelName: string,
  onMessage?: (message: BroadcastMessage) => void,
) => {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Pastikan jalan hanya di browser
    if (typeof window === "undefined") return;

    const bc = new BroadcastChannel(channelName);
    channelRef.current = bc;

    bc.onmessage = (event) => {
      if (onMessage) {
        onMessage(event.data as BroadcastMessage);
      }
    };

    return () => {
      bc.close();
      channelRef.current = null;
    };
  }, [channelName, onMessage]);

  const postMessage = useCallback((message: BroadcastMessage) => {
    if (channelRef.current) {
      channelRef.current.postMessage(message);
    }
  }, []);

  return { postMessage };
};
