"use client";

import {
  CheckCircle2,
  CloudUpload,
  WifiOff,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SyncState = "synced" | "pending" | "offline" | "syncing";

interface SyncStatusBadgeProps {
  state: SyncState;
  pendingCount?: number;
  className?: string;
}

const STYLES: Record<
  SyncState,
  { light: string; dark: string; icon: typeof CheckCircle2; label: string }
> = {
  synced: {
    light: "bg-green-50 text-green-700 border-green-200",
    dark: "dark:bg-green-900/20 dark:text-green-400 dark:border-green-900",
    icon: CheckCircle2,
    label: "Tersinkronisasi",
  },
  pending: {
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900",
    icon: CloudUpload,
    label: "Menunggu Sync",
  },
  offline: {
    light: "bg-red-50 text-red-700 border-red-200",
    dark: "dark:bg-red-900/20 dark:text-red-400 dark:border-red-900",
    icon: WifiOff,
    label: "Mode Offline",
  },
  syncing: {
    light: "bg-blue-50 text-blue-700 border-blue-200",
    dark: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900",
    icon: Loader2,
    label: "Menyinkronkan...",
  },
};

export const SyncStatusBadge = ({
  state,
  pendingCount,
  className,
}: SyncStatusBadgeProps) => {
  const config = STYLES[state];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors duration-200",
        "motion-reduce:transition-none",
        config.light,
        config.dark,
        className,
      )}
    >
      <Icon
        className={cn(
          "h-3 w-3 shrink-0",
          state === "syncing" && "animate-spin motion-reduce:animate-none",
        )}
      />
      {config.label}
      {state === "pending" && pendingCount != null && pendingCount > 0 && (
        <span className="ml-0.5 rounded-full bg-amber-200 px-1.5 text-[10px] font-bold text-amber-900 dark:bg-amber-800 dark:text-amber-100">
          {pendingCount}
        </span>
      )}
    </span>
  );
};