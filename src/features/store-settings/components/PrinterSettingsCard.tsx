"use client";

import { usePrinter } from "@/components/layouts/providers/PrinterProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bluetooth,
  BluetoothConnected,
  Printer,
  Info,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrinterPrefs } from "../hooks/usePrinterPrefs";

const TOGGLE_ITEMS = [
  { key: "autoPrint" as const, label: "Cetak otomatis setelah transaksi" },
  { key: "showLogo" as const, label: "Tampilkan logo di struk" },
  { key: "showFooter" as const, label: "Tampilkan footer struk" },
] as const;

export const PrinterSettingsCard = () => {
  const {
    isConnected,
    isReconnecting,
    isPrinting,
    savedPrinterName,
    connect,
    disconnect,
  } = usePrinter();
  const { prefs, togglePref } = usePrinterPrefs();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Printer className="h-4 w-4 text-emerald-600" />
          Pengaturan Printer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                isConnected
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                  : isReconnecting
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {isConnected ? (
                <BluetoothConnected
                  className={cn("h-5 w-5", isPrinting && "animate-pulse")}
                />
              ) : isReconnecting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Bluetooth className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {isConnected
                  ? "Printer Terhubung"
                  : isReconnecting
                    ? "Menghubungkan ulang..."
                    : "Printer Terputus"}
              </p>
              <p className="text-muted-foreground text-xs">
                {isConnected && savedPrinterName
                  ? `Device: ${savedPrinterName}`
                  : isReconnecting
                    ? "Mencoba terhubung ke printer terakhir"
                    : savedPrinterName
                      ? `Terakhir: ${savedPrinterName}`
                      : "Belum ada printer yang terhubung"}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            {isConnected ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full hover:border-red-300 hover:bg-red-50 hover:text-red-600 sm:w-auto dark:hover:bg-red-950/20"
                onClick={disconnect}
                disabled={isPrinting}
              >
                Putuskan
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 sm:w-auto dark:border-emerald-900/30 dark:bg-emerald-900/20"
                onClick={connect}
                disabled={isReconnecting}
              >
                {isReconnecting ? "Menghubungkan..." : "Hubungkan Printer"}
              </Button>
            )}
          </div>
        </div>

        {/* Printer Toggles */}
        <div className="space-y-1">
          {TOGGLE_ITEMS.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between border-b py-3 last:border-0"
            >
              <Label
                htmlFor={`printer-${key}`}
                className="text-foreground cursor-pointer text-sm font-normal"
              >
                {label}
              </Label>
              <Switch
                id={`printer-${key}`}
                checked={prefs[key]}
                onCheckedChange={() => togglePref(key)}
              />
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Membutuhkan browser Chrome/Edge dengan Bluetooth aktif. Printer akan
            terhubung otomatis saat halaman dibuka kembali.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
