"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSelector } from "./ThemeSelector";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { StatusPopover } from "../fragments/StatusPopover";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { navItems } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export const Header = () => {
  const isOnline = useNetworkStatus();
  const pathname = usePathname();

  const activeNav =
    navItems.find((item) => item.href === pathname) ?? navItems[0];

  const { pendingCount, syncNow, isSyncing } = useOfflineSync();

  return (
    <header className="bg-background border-border/50 sticky top-0 z-40 flex h-14 w-full shrink-0 items-center border-b px-3 sm:px-4">
      {/* Desktop: sidebar trigger */}
      <SidebarTrigger className="-ml-2 hidden lg:flex" />

      {/* Mobile: page title left-aligned */}
      <div className="flex flex-1 items-center gap-2 lg:hidden">
        <h1 className="text-foreground/90 truncate text-sm font-semibold tracking-tight">
          {activeNav?.label ?? "Dashboard"}
        </h1>
      </div>

      {/* Desktop: spacer to push right-actions to the right */}
      <div className="hidden flex-1 lg:flex" />

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-x-1.5 sm:gap-x-2">
        {/* Online/Offline pill — desktop only (mobile shows in StatusPopover) */}
        <div
          className={cn(
            "hidden items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold sm:flex",
            isOnline
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400"
              : "border-border bg-muted text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "mr-1.5 h-1.5 w-1.5 rounded-full",
              isOnline ? "animate-pulse bg-green-500" : "bg-gray-400",
            )}
          />
          {isOnline ? "Online" : "Offline"}
        </div>

        {/* Status bell popover */}
        <StatusPopover
          isOnline={isOnline}
          pendingUpload={pendingCount}
          isSyncing={isSyncing}
          onSync={syncNow}
        />

        <ThemeSelector />
      </div>
    </header>
  );
};
