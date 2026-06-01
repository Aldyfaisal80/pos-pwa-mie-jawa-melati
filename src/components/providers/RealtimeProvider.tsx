"use client";

import { useLiveStats } from "@/features/dashboard/hooks/useLiveStats";

/**
 * Global realtime subscription provider.
 * Mounts Supabase postgres_changes + BroadcastChannel listeners
 * so ALL pages under AppProvider receive live data updates.
 */
export const RealtimeProvider = () => {
  useLiveStats();
  return null;
};
