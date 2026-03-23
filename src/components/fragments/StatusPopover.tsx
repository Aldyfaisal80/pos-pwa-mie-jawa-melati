"use client";

import React from "react";
import {
  Bell,
  WifiOff,
  CloudUpload,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatRupiah } from "@/lib/format";
import { api } from "@/trpc/react";

interface StatusPopoverProps {
  isOnline: boolean;
  pendingUpload: number;
  isSyncing: boolean;
  onSync: () => void;
}

export const StatusPopover = ({
  isOnline,
  pendingUpload,
  isSyncing,
  onSync,
}: StatusPopoverProps) => {
  const { data: stats } = api.transaction.getDashboardStats.useQuery(
    undefined,
    { staleTime: 60_000 },
  );
  const transactionCount = stats?.totalTransactions ?? 0;
  const totalOmzet = stats?.totalOmzet ?? 0;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {(pendingUpload > 0 || !isOnline) && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center border-2 border-white p-0 text-[10px] shadow-sm dark:border-gray-950"
            >
              {pendingUpload > 0 ? pendingUpload : "!"}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="z-50 w-[calc(100vw-2rem)] max-w-[320px] p-0"
      >
        <div className="bg-muted flex items-center justify-between rounded-t-md border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Pusat Status</h3>
          <Badge
            variant={isOnline ? "default" : "secondary"}
            className={`text-[10px] tracking-wider uppercase ${
              isOnline
                ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-200 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {isOnline ? "ONLINE" : "OFFLINE"}
          </Badge>
        </div>

        <div className="space-y-3 p-3">
          {pendingUpload > 0 ? (
            <div className="flex items-start gap-3 rounded-lg border border-orange-100 bg-orange-50 p-3 dark:border-orange-900/50 dark:bg-orange-950/30">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-200 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                <CloudUpload className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                  {pendingUpload} Transaksi Pending
                </p>
                <p className="mt-0.5 text-xs leading-snug text-orange-600/80 dark:text-orange-400/80">
                  {isOnline
                    ? "Internet terhubung, klik tombol di bawah untuk sync."
                    : "Data tersimpan di perangkat, menunggu koneksi internet."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-3 dark:border-green-900/50 dark:bg-green-950/30">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-300">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                  Semua Data Aman
                </p>
                <p className="mt-0.5 text-xs leading-snug text-green-700/80 dark:text-green-400/80">
                  Data transaksi tersimpan dengan aman di server utama.
                </p>
              </div>
            </div>
          )}

          {!isOnline && (
            <div className="border-destructive/20 bg-destructive/10 flex items-start gap-3 rounded-lg border p-3">
              <div className="bg-destructive/20 text-destructive mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <WifiOff className="h-4 w-4" />
              </div>
              <div>
                <p className="text-destructive text-sm font-semibold">
                  Koneksi Terputus
                </p>
                <p className="text-destructive/80 mt-0.5 text-xs leading-snug">
                  Masuk mode Offline. Transaksi tetap berjalan dan disimpan
                  lokal.
                </p>
              </div>
            </div>
          )}

          <div className="bg-background rounded-lg border p-3 shadow-sm">
            <p className="text-muted-foreground mb-2 text-[10px] font-bold uppercase">
              Info Hari Ini
            </p>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                Total Transaksi
              </span>
              <span className="text-sm font-bold">{transactionCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Total Omzet</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {formatRupiah(totalOmzet)}
              </span>
            </div>
          </div>
        </div>

        {pendingUpload > 0 && (
          <div className="bg-muted rounded-b-md border-t p-3">
            <Button
              variant="outline"
              className="w-full text-xs font-semibold"
              onClick={onSync}
              disabled={!isOnline || isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghubungkan...
                </>
              ) : (
                <>
                  <CloudUpload className="mr-2 h-4 w-4" /> Coba Sync Sekarang
                </>
              )}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
