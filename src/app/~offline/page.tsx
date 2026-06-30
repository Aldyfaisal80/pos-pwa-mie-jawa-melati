"use client";

import React, { useState } from "react";
import { WifiOff, RefreshCcw, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SyncStatusBadge } from "@/components/fragments/SyncStatusBadge";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    window.location.reload();
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-background to-muted p-4">
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex max-w-md flex-col items-center space-y-6 text-center">
        <div className="rounded-full bg-red-50 p-6 dark:bg-red-900/20">
          <WifiOff className="h-16 w-16 animate-pulse text-red-500 motion-reduce:animate-none dark:text-red-400" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight">
            Koneksi Terputus
          </h1>
          <SyncStatusBadge state="offline" />
          <p className="text-muted-foreground">
            Sepertinya Anda sedang offline. Beberapa fitur mungkin tidak
            tersedia saat ini. Aplikasi akan berfungsi kembali saat koneksi
            pulih.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            className="w-full cursor-pointer transition-all duration-200 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-auto"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" />
                Menghubungkan...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Coba Lagi
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full cursor-pointer transition-all duration-200 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-auto"
            asChild
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
