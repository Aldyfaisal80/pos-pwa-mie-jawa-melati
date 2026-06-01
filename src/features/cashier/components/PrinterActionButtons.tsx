import { Bluetooth, BluetoothConnected, Loader2, Printer, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrinterActionButtonsProps {
  isConnected: boolean;
  isReconnecting?: boolean;
  isPrinting: boolean;
  savedPrinterName: string | null;
  onConnect: () => void;
  onDisconnect?: () => void;
  onPrint: () => void;
  onClose?: () => void;
  printLabel?: string;
  className?: string;
}

export const PrinterActionButtons = ({
  isConnected,
  isReconnecting = false,
  isPrinting,
  savedPrinterName,
  onConnect,
  onDisconnect,
  onPrint,
  onClose,
  printLabel = "Cetak",
  className,
}: PrinterActionButtonsProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Connect status row */}
      {!isConnected ? (
        isReconnecting ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-50 py-2.5 text-xs font-semibold text-amber-600">
            <RotateCcw className="h-4 w-4 animate-spin" />
            Menghubungkan ulang printer...
          </div>
        ) : (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-2.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
            onClick={onConnect}
          >
            <Bluetooth className="h-4 w-4" />
            {savedPrinterName
              ? `Hubungkan: ${savedPrinterName}`
              : "Hubungkan Printer Bluetooth"}
          </button>
        )
      ) : (
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <BluetoothConnected className="h-4 w-4" />
            <span>Printer Siap ({savedPrinterName})</span>
          </div>
          {onDisconnect && (
            <button
              type="button"
              className="text-xs text-gray-400 transition-colors hover:text-red-500"
              onClick={onDisconnect}
              disabled={isPrinting}
            >
              Putuskan
            </button>
          )}
        </div>
      )}

      {/* Action row */}
      <div className={cn("flex gap-2", !onClose && "flex-col")}>
        {onClose && (
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-300 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
            onClick={onClose}
            disabled={isPrinting}
          >
            Tutup Tanpa Cetak
          </button>
        )}
        <button
          type="button"
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-50",
            onClose ? "flex-[1.5]" : "w-full",
          )}
          onClick={onPrint}
          disabled={!isConnected || isPrinting}
        >
          {isPrinting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Printer className="h-4 w-4" />
          )}
          {isPrinting ? "Mencetak..." : printLabel}
        </button>
      </div>
    </div>
  );
};
