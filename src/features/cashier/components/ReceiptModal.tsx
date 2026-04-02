"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UtensilsCrossed } from "lucide-react";
import type { RouterOutputs } from "@/trpc/react";
import { formatRupiah } from "@/lib/format";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { render } from "react-thermal-printer";
import type { CartItem, PaymentMethod } from "../types/cashier.types";
import { usePrinter } from "@/components/layouts/providers/PrinterProvider";
import { ReceiptPrintTemplate } from "./ReceiptPrintTemplate";
import { PrinterActionButtons } from "./PrinterActionButtons";

interface ReceiptModalProps {
  open: boolean;
  cart: CartItem[];
  cartTotal: number;
  paymentMethod: PaymentMethod;
  paymentAmount: string;
  invoiceNumber: string;
  transactionDate: Date;
  onFinish: () => void;
}

export const ReceiptModal = ({
  open,
  cart,
  cartTotal,
  paymentMethod,
  paymentAmount,
  invoiceNumber,
  transactionDate,
  onFinish,
}: ReceiptModalProps) => {
  type StoreProfile = NonNullable<RouterOutputs["store"]["getProfile"]>;
  const { data: store } = api.store.getProfile.useQuery();
  const changeAmount = Number(paymentAmount) - cartTotal;

  const {
    isConnected,
    isPrinting,
    connect,
    disconnect,
    printReceipt,
    savedPrinterName,
  } = usePrinter();

  const handlePrint = async () => {
    if (!store) {
      toast.error("Data toko belum dimuat");
      return;
    }

    try {
      const data = await render(
        <ReceiptPrintTemplate
          store={store as StoreProfile}
          cart={cart}
          cartTotal={cartTotal}
          paymentAmount={paymentAmount}
          paymentMethod={paymentMethod}
          invoiceNumber={invoiceNumber}
          transactionDate={transactionDate}
        />,
      );
      await printReceipt(data);
    } catch (e: unknown) {
      toast.error(
        `Gagal merender struk: ${e instanceof Error ? e.message : "Error tidak diketahui"}`,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={undefined}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-85 overflow-visible border-none bg-transparent p-0 shadow-none sm:w-85">
        <DialogTitle className="sr-only">Struk Pembayaran</DialogTitle>

        <style>{`
          .receipt-jagged { position: relative; background: #ffffff; }
          .receipt-jagged::after {
            content: ''; position: absolute; bottom: -10px; left: 0; width: 100%; height: 10px;
            background: linear-gradient(45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%),
                        linear-gradient(-45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%);
            background-size: 20px 20px; background-position: 0 0;
          }
        `}</style>

        <div className="receipt-jagged mt-8 w-full rounded-t-xl pb-4 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center border-b border-dashed border-gray-300 p-6 pb-4">
            {store?.logoUrl ? (
              <img
                src={store.logoUrl}
                alt="Store Logo"
                className="mb-3 h-16 w-auto max-w-40 object-contain drop-shadow-sm"
              />
            ) : (
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-600 text-white shadow-sm">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
            )}
            <h3 className="text-center font-mono text-xl leading-tight font-bold tracking-tight text-gray-900">
              {store?.name?.toUpperCase() ?? "TOKO"}
            </h3>
            {store?.address && (
              <p className="mt-1 text-center font-mono text-xs whitespace-pre-line text-gray-500">
                {store.address}
              </p>
            )}
            {store?.phone && (
              <p className="mt-1 text-center font-mono text-xs text-gray-500">
                Telp: {store.phone}
              </p>
            )}
          </div>

          {/* Isi */}
          <div className="p-6 py-4">
            <div className="mb-3 flex justify-between border-b border-dashed border-gray-300 pb-3 font-mono text-xs text-gray-500">
              <div>
                <p>No: #{invoiceNumber}</p>
                <p>Kasir: Admin</p>
              </div>
              <div className="text-right">
                <p>{transactionDate.toLocaleDateString("id-ID")}</p>
                <p>
                  {transactionDate.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-sm text-gray-800">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-start justify-between"
                >
                  <div className="flex flex-col pr-2">
                    <span className="font-medium text-gray-900">
                      {item.name}{" "}
                      <span className="text-xs text-gray-500">x{item.qty}</span>
                    </span>
                    {item.note && (
                      <span className="mt-0.5 text-[10px] leading-tight text-gray-500 italic">
                        * {item.note}
                      </span>
                    )}
                  </div>
                  <span className="font-medium whitespace-nowrap text-gray-900">
                    {formatRupiah(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1 border-t border-dashed border-gray-300 pt-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900">
                  {formatRupiah(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pajak (0%)</span>
                <span className="text-gray-900">Rp 0</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-dashed border-gray-300 pt-2 text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatRupiah(cartTotal)}</span>
              </div>
              <div className="flex justify-between pt-1 text-xs text-gray-500">
                <span>
                  {paymentMethod === "CASH" ? "Tunai" : paymentMethod}
                </span>
                <span>
                  {formatRupiah(Number(paymentAmount ?? cartTotal.toString()))}
                </span>
              </div>
              {paymentMethod === "CASH" && changeAmount >= 0 && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Kembali</span>
                  <span>{formatRupiah(changeAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 text-center">
            <p className="mb-5 font-mono text-xs text-gray-400">
              *** TERIMA KASIH ***
              <br />
              Selamat Menikmati
            </p>
            <PrinterActionButtons
              isConnected={isConnected}
              isPrinting={isPrinting}
              savedPrinterName={savedPrinterName}
              onConnect={connect}
              onDisconnect={disconnect}
              onPrint={handlePrint}
              onClose={onFinish}
              printLabel="Cetak Struk"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
