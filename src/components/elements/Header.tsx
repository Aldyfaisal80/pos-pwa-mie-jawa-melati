"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSelector } from "./ThemeSelector";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { MobileMenu } from "../fragments/MobileMenu";
import { StatusPopover } from "../fragments/StatusPopover";
import { useOfflineSync } from "@/hooks/use-offline-sync";
import { navItems } from "../config/navigation";
import { api } from "@/trpc/react";

export const Header = () => {
  const isOnline = useNetworkStatus();
  const pathname = usePathname();

  const activeNav =
    navItems.find((item) => item.href === pathname) || navItems[0];

  // Gunakan hook offline-sync untuk antrian IndexedDB
  const { pendingCount, syncNow, isSyncing } = useOfflineSync();

  // Data dashboard real (transaksi & omzet hari ini)
  const { data: stats } = api.transaction.getDashboardStats.useQuery();

  // Data profil toko untuk logo
  const { data: store } = api.store.getProfile.useQuery();

  return (
    <header className="bg-background sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b px-3 transition-all duration-300 ease-in-out sm:px-4">
      <div className="flex items-center gap-3">
        {/* Tombol pelipat Sidebar Desktop */}
        <SidebarTrigger className="-ml-2 hidden lg:flex" />

        {/* Navigasi layar kecil */}
        <MobileMenu />

        <Link href="/" className="flex w-10 items-center gap-2 lg:hidden">
          {(store as any)?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={(store as any).logoUrl}
              alt={store?.name || "Logo"}
              className="h-8 w-auto max-w-16 shrink-0 object-contain drop-shadow-sm"
            />
          ) : (
            <Store className="h-6 w-6 shrink-0 text-amber-600" />
          )}
          <span className="sr-only">Home</span>
        </Link>
      </div>

      {/* Centered Page Title (Mobile Only) */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden">
        <h1 className="text-foreground/90 text-base font-bold tracking-tight whitespace-nowrap">
          {activeNav?.label || "Dashboard"}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-x-1.5 sm:gap-x-3">
        {/* Indikator Online/Offline (Hanya di layar besar) */}
        <div
          className={`hidden items-center rounded-full border px-3 py-1.5 text-xs font-bold sm:flex ${
            isOnline
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400"
              : "border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          <span
            className={`mr-2 h-2 w-2 rounded-full ${
              isOnline ? "animate-pulse bg-green-600" : "bg-gray-500"
            }`}
          />
          {isOnline ? "Online" : "Offline"}
        </div>

        {/* Lonceng Pusat Status */}
        <StatusPopover
          isOnline={isOnline}
          pendingUpload={pendingCount}
          transactionCount={stats?.totalTransactions ?? 0}
          totalOmzet={stats?.totalOmzet ?? 0}
          isSyncing={isSyncing}
          onSync={syncNow}
        />

        <ThemeSelector />
      </div>
    </header>
  );
};
