"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { CartItem, PaymentMethod } from "../types/cashier.types";
import { CheckoutCartSummary } from "./CheckoutCartSummary";
import { CheckoutPaymentMethods } from "./CheckoutPaymentMethods";
import { CheckoutCashInput } from "./CheckoutCashInput";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  cartTotal: number;
  paymentMethod: PaymentMethod;
  paymentAmount: string;
  onPaymentMethodChange: (m: PaymentMethod) => void;
  onPaymentAmountChange: (v: string) => void;
  onUpdateQty: (cartId: string, delta: number) => void;
  onOpenNote: (cartId: string) => void;
  onProcess: () => void;
  isPending: boolean;
}

export const CheckoutModal = ({
  open,
  onOpenChange,
  cart,
  cartTotal,
  paymentMethod,
  paymentAmount,
  onPaymentMethodChange,
  onPaymentAmountChange,
  onUpdateQty,
  onOpenNote,
  onProcess,
  isPending,
}: CheckoutModalProps) => {
  const changeAmount = Number(paymentAmount || "0") - cartTotal;
  const isValid =
    paymentMethod !== "CASH" || Number(paymentAmount || "0") >= cartTotal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background flex h-dvh w-full max-w-none flex-col border-0 p-0 sm:h-auto sm:max-w-112.5 sm:rounded-xl sm:border">
        <div className="bg-muted/30 border-b p-4">
          <DialogTitle className="text-xl font-bold">
            Penyelesaian Pembayaran
          </DialogTitle>
        </div>

        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-4 sm:max-h-[70vh]">
          {/* Rincian pesanan - Render using atomic component */}
          <CheckoutCartSummary
            cart={cart}
            onOpenNote={onOpenNote}
            onUpdateQty={onUpdateQty}
          />

          {/* Total */}
          <div className="text-center">
            <p className="text-muted-foreground mb-1 text-sm">Total Tagihan</p>
            <h2 className="text-4xl font-bold tracking-tight">
              {formatRupiah(cartTotal)}
            </h2>
          </div>

          {/* Metode pembayaran - Render using atomic component */}
          <CheckoutPaymentMethods
            paymentMethod={paymentMethod}
            cartTotal={cartTotal}
            onPaymentMethodChange={onPaymentMethodChange}
            onPaymentAmountChange={onPaymentAmountChange}
          />

          {/* Input nominal tunai - Render using atomic component */}
          {paymentMethod === "CASH" && (
            <CheckoutCashInput
              paymentAmount={paymentAmount}
              changeAmount={changeAmount}
              onPaymentAmountChange={onPaymentAmountChange}
            />
          )}
        </div>

        <div className="bg-background shrink-0 border-t p-4">
          <Button
            className="h-12 w-full text-sm font-bold"
            disabled={!isValid || isPending}
            onClick={onProcess}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-5 w-5" />
            )}
            {isPending ? "Memproses Transaksi..." : "Selesaikan Transaksi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
