import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/format";
import { formatDateTime, getPaymentMethodLabel } from "../utils/reportUtils";
import type { RouterOutputs } from "@/trpc/react";

import { toast } from "sonner";
import { api } from "@/trpc/react";
import { render, Printer } from "react-thermal-printer";
import { usePrinter } from "@/components/layouts/providers/PrinterProvider";
import { ReceiptPrintTemplate } from "@/features/cashier/components/ReceiptPrintTemplate";
import { PrinterActionButtons } from "@/features/cashier/components/PrinterActionButtons";
import type { PaymentMethod } from "@/features/cashier/types/cashier.types";
import { mapTransactionItemsToCart } from "../utils/receiptMapper";

type StoreProfile = NonNullable<RouterOutputs["store"]["getProfile"]>;

type Transaction = Exclude<
  RouterOutputs["transaction"]["getTransactionReport"],
  undefined
>["transactions"][number];

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionDetailModal = ({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailModalProps) => {
  const { data: store } = api.store.getProfile.useQuery();
  const {
    isConnected,
    isPrinting,
    connect,
    disconnect,
    printReceipt,
    savedPrinterName,
  } = usePrinter();

  if (!transaction) return null;

  const { date, time } = formatDateTime(transaction.date);

  const handlePrint = async () => {
    if (!store || !transaction) {
      toast.error("Data toko belum dimuat");
      return;
    }

    try {
      const data = await render(
        <Printer type="epson" width={32}>
          <ReceiptPrintTemplate
            store={store as StoreProfile}
            cart={mapTransactionItemsToCart(transaction.items)}
            cartTotal={Number(transaction.totalAmount)}
            paymentAmount={String(transaction.paidAmount)}
            paymentMethod={transaction.paymentMethod as PaymentMethod}
            invoiceNumber={transaction.invoiceNumber}
            transactionDate={transaction.date}
          />
        </Printer>,
      );
      await printReceipt(data);
    } catch (e: unknown) {
      toast.error(
        `Gagal merender struk: ${e instanceof Error ? e.message : "Error tidak diketahui"}`,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="bg-muted/30 rounded-lg border p-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-muted-foreground">No. Nota</div>
              <div className="font-mono font-medium">
                {transaction.invoiceNumber}
              </div>

              <div className="text-muted-foreground">Waktu Dibuat</div>
              <div>
                {date} <span className="text-muted-foreground">{time}</span>
              </div>

              <div className="text-muted-foreground">Metode Bayar</div>
              <div className="font-medium">
                {getPaymentMethodLabel(transaction.paymentMethod)}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3 pt-2">
            <h4 className="text-sm font-semibold">Daftar Item</h4>
            <div className="max-h-[30vh] overflow-y-auto pr-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="text-muted-foreground pb-2 font-medium">
                      Item
                    </th>
                    <th className="text-muted-foreground pb-2 text-right font-medium">
                      Harga
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transaction.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-muted-foreground text-xs">
                          {item.quantity} x{" "}
                          {formatRupiah(Number(item.unitPrice))}
                        </div>
                        {item.note && (
                          <div className="text-muted-foreground text-xs italic">
                            Catatan: {item.note}
                          </div>
                        )}
                      </td>
                      <td className="py-2 text-right align-top font-medium">
                        {formatRupiah(Number(item.subTotal))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-muted/50 mt-2 space-y-1.5 rounded-lg border p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Tagihan</span>
              <span className="font-bold">
                {formatRupiah(Number(transaction.totalAmount))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uang Diterima</span>
              <span>{formatRupiah(Number(transaction.paidAmount))}</span>
            </div>
            {Number(transaction.change) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kembalian</span>
                <span className="text-green-600 dark:text-green-400">
                  {formatRupiah(Number(transaction.change))}
                </span>
              </div>
            )}
          </div>

          <div className="mt-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
            <PrinterActionButtons
              isConnected={isConnected}
              isPrinting={isPrinting}
              savedPrinterName={savedPrinterName}
              onConnect={connect}
              onDisconnect={disconnect}
              onPrint={handlePrint}
              printLabel="Cetak Ulang Struk"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
