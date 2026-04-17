"use client";

import { Button } from "@/components/ui/button";
import { Banknote, QrCode, CreditCard } from "lucide-react";
import type { PaymentMethod } from "../../types/cashier.types";

interface CheckoutPaymentMethodsProps {
  paymentMethod: PaymentMethod;
  cartTotal: number;
  onPaymentMethodChange: (m: PaymentMethod) => void;
  onPaymentAmountChange: (v: string) => void;
}

export const CheckoutPaymentMethods = ({
  paymentMethod,
  cartTotal,
  onPaymentMethodChange,
  onPaymentAmountChange,
}: CheckoutPaymentMethodsProps) => {
  const methods = [
    { method: "CASH" as PaymentMethod, Icon: Banknote, label: "Tunai" },
    { method: "QRIS" as PaymentMethod, Icon: QrCode, label: "QRIS" },
    { method: "TRANSFER" as PaymentMethod, Icon: CreditCard, label: "Transfer" },
  ];

  return (
    <div>
      <p className="text-muted-foreground mb-2 text-xs font-bold uppercase">
        Metode Pembayaran
      </p>
      <div className="grid grid-cols-3 gap-2">
        {methods.map(({ method, Icon, label }) => (
          <Button
            key={method}
            variant={paymentMethod === method ? "default" : "outline"}
            className="flex h-auto flex-col gap-1 py-3"
            onClick={() => {
              onPaymentMethodChange(method);
              if (method !== "CASH") onPaymentAmountChange(cartTotal.toString());
            }}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
