"use client";

import React from "react";
import { WifiOff, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function OfflinePage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center space-y-6 text-center">
        <div className="bg-muted rounded-full p-6">
          <WifiOff className="text-muted-foreground h-16 w-16" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Koneksi Terputus</h1>
          <p className="text-muted-foreground">
            Sepertinya Anda sedang offline. Beberapa fitur mungkin tidak tersedia saat ini.
            Aplikasi akan berfungsi kembali saat koneksi pulih.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button 
            className="w-full sm:w-auto" 
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
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
