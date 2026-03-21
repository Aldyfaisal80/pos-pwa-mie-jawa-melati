"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
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
  const isMobile = useIsMobile();
  const changeAmount = Number(paymentAmount || "0") - cartTotal;
  const isValid =
    cart.length > 0 &&
    (paymentMethod !== "CASH" || Number(paymentAmount || "0") >= cartTotal);

  // Bagian konten yang sama untuk Modal maupun Drawer
  const InnerContent = (
    <>
      <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-4 sm:max-h-[70vh]">
        <CheckoutCartSummary
          cart={cart}
          onOpenNote={onOpenNote}
          onUpdateQty={onUpdateQty}
        />

        <div className="text-center">
          <p className="text-muted-foreground mb-1 text-sm">Total Tagihan</p>
          <h2 className="text-4xl font-bold tracking-tight">
            {formatRupiah(cartTotal)}
          </h2>
        </div>

        <CheckoutPaymentMethods
          paymentMethod={paymentMethod}
          cartTotal={cartTotal}
          onPaymentMethodChange={onPaymentMethodChange}
          onPaymentAmountChange={onPaymentAmountChange}
        />

        {paymentMethod === "CASH" && (
          <CheckoutCashInput
            paymentAmount={paymentAmount}
            changeAmount={changeAmount}
            onPaymentAmountChange={onPaymentAmountChange}
          />
        )}
      </div>

      <div className="bg-background shrink-0 border-t p-4 sm:p-5">
        <Button
          className="h-14 w-full rounded-xl text-base font-bold shadow-lg shadow-primary/25 transition-transform active:scale-[0.98] hover:-translate-y-0.5"
          disabled={!isValid || isPending}
          onClick={onProcess}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-6 w-6" />
          )}
          {isPending ? "Memproses Transaksi..." : "Selesaikan Transaksi"}
        </Button>
      </div>
    </>
  );

  // Tampilan Mobile (Drawer)
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-background flex max-h-[92dvh] flex-col">
          <div className="border-b px-4 py-3 text-center">
            <DrawerTitle className="text-xl font-bold">
              Penyelesaian Pembayaran
            </DrawerTitle>
          </div>
          {InnerContent}
        </DrawerContent>
      </Drawer>
    );
  }

  // Tampilan Desktop (Dialog)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background flex h-auto w-full flex-col p-0 sm:max-w-112.5">
        <div className="bg-muted/30 border-b p-4">
          <DialogTitle className="text-xl font-bold">
            Penyelesaian Pembayaran
          </DialogTitle>
        </div>
        {InnerContent}
      </DialogContent>
    </Dialog>
  );
};
