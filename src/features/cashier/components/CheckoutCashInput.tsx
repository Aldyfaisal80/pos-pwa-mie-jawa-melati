"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";

const QUICK_NOMINALS = [15000, 20000, 50000, 100000];

interface CheckoutCashInputProps {
  paymentAmount: string;
  changeAmount: number;
  onPaymentAmountChange: (v: string) => void;
}

export const CheckoutCashInput = ({
  paymentAmount,
  changeAmount,
  onPaymentAmountChange,
}: CheckoutCashInputProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-top-2">
      <p className="text-muted-foreground mb-2 text-xs font-bold uppercase">
        Uang Diterima
      </p>
      <div className="relative mb-3">
        <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 font-bold">
          Rp
        </span>
        <Input
          type="number"
          className="h-12 pl-10 text-lg font-bold"
          placeholder="0"
          value={paymentAmount}
          onChange={(e) => onPaymentAmountChange(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {QUICK_NOMINALS.map((nom) => (
          <Button
            key={nom}
            variant="outline"
            size="sm"
            onClick={() => onPaymentAmountChange(nom.toString())}
          >
            {nom / 1000}k
          </Button>
        ))}
      </div>
      <div className="bg-muted/50 mt-4 flex items-center justify-between rounded-xl border p-4">
        <span className="text-sm font-bold">Kembalian</span>
        <span
          className={`text-xl font-bold ${changeAmount >= 0 ? "text-green-600" : "text-destructive"}`}
        >
          {changeAmount >= 0 ? formatRupiah(changeAmount) : "Kurang"}
        </span>
      </div>
    </div>
  );
};
