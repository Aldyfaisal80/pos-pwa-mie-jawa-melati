"use client";

import { usePrinter } from "@/components/layouts/providers/PrinterProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bluetooth,
  BluetoothConnected,
  Info,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const PrinterSettingsCard = () => {
  const { isConnected, isPrinting, savedPrinterName, connect, disconnect } =
    usePrinter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Printer className="h-5 w-5 text-emerald-600" />
          Pengaturan Printer
        </CardTitle>
        <CardDescription>
          Hubungkan printer thermal 58mm via Bluetooth untuk mencetak struk
          kasir secara otomatis tanpa harus pairing ulang.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-0 sm:p-8 sm:pt-0">
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 sm:flex-row dark:border-gray-800 dark:bg-gray-900/20">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                isConnected
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-800",
              )}
            >
              {isConnected ? (
                <BluetoothConnected
                  className={cn("h-5 w-5", isPrinting && "animate-pulse")}
                />
              ) : (
                <Bluetooth className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {isConnected ? "Printer Terhubung" : "Printer Terputus"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isConnected && savedPrinterName
                  ? `Device: ${savedPrinterName}`
                  : "Belum ada printer yang terhubung"}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            {isConnected ? (
              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 sm:w-auto dark:border-gray-700"
                onClick={disconnect}
                disabled={isPrinting}
              >
                Putuskan
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 sm:w-auto dark:border-emerald-900/30 dark:bg-emerald-900/20"
                onClick={connect}
              >
                Hubungkan Printer
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Membutuhkan browser Chrome/Edge dengan Bluetooth aktif. Jika printer
            pernah terhubung, kamu hanya perlu menyalakannya.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
