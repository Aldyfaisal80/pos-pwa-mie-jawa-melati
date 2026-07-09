"use client";

import { useEffect, useRef, useCallback } from "react";

type BroadcastMessage = {
  type:
    | "TRANSACTION_CREATED"
    | "TRANSACTION_SYNCED"
    | "PRODUCT_UPDATED"
    | "CATEGORY_UPDATED";
  payload?: unknown;
};

export const useBroadcastChannel = (
  channelName: string,
  onMessage?: (message: BroadcastMessage) => void,
) => {
  const channelRef = useRef<BroadcastChannel | null>(null);
  // Store onMessage in a ref so the channel is NOT torn down on every re-render.
  // Inline arrow callbacks (e.g. in useLiveStats) get a new identity each render;
  // if placed in useEffect deps, the channel would be closed & recreated constantly,
  // causing broadcast messages to be lost during the brief gap.
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    // Pastikan jalan hanya di browser
    if (typeof window === "undefined") return;

    const bc = new BroadcastChannel(channelName);
    channelRef.current = bc;

    bc.onmessage = (event) => {
      onMessageRef.current?.(event.data as BroadcastMessage);
    };

    // Also listen for same-tab CustomEvents (BroadcastChannel doesn't deliver to sender)
    const handleWindowEvent = (event: Event) => {
      if (event instanceof CustomEvent && event.detail) {
        onMessageRef.current?.(event.detail as BroadcastMessage);
      }
    };
    window.addEventListener(channelName, handleWindowEvent);

    return () => {
      bc.close();
      window.removeEventListener(channelName, handleWindowEvent);
      channelRef.current = null;
    };
  }, [channelName]); // ← only channelName, NOT onMessage

  const postMessage = useCallback((message: BroadcastMessage) => {
    if (channelRef.current) {
      channelRef.current.postMessage(message);
    }
  }, []);

  return { postMessage };
};
