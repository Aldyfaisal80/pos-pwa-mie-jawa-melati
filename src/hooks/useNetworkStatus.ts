"use client";

import { useState, useEffect, useRef } from "react";

const HEARTBEAT_INTERVAL = 10_000; // 10 seconds
const HEARTBEAT_TIMEOUT = 3_000; // 3 seconds

/**
 * Network status with real connectivity check.
 * navigator.onLine is unreliable when SW serves cached pages —
 * it reports "online" as long as the network interface is active,
 * even if there's no actual internet connection.
 *
 * Heartbeat pings /api/health (HEAD) to verify real connectivity.
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true,
  );
  const isOnlineRef = useRef(isOnline);

  useEffect(() => {
    isOnlineRef.current = isOnline;
  }, [isOnline]);

  useEffect(() => {
    const setOnline = (online: boolean) => {
      if (online !== isOnlineRef.current) {
        setIsOnline(online);
        isOnlineRef.current = online;
      }
    };

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    const checkConnectivity = async () => {
      try {
        const response = await fetch("/api/health", {
          method: "HEAD",
          cache: "no-store",
          signal: AbortSignal.timeout(HEARTBEAT_TIMEOUT),
        });
        setOnline(response.ok);
      } catch {
        setOnline(false);
      }
    };

    // Initial check + interval
    void checkConnectivity();
    const interval = setInterval(() => void checkConnectivity(), HEARTBEAT_INTERVAL);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

