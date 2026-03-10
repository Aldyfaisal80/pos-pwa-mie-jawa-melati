"use client";

import { MessageSquare, Minus, Plus } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { CartItem } from "../types/cashier.types";

interface CheckoutCartSummaryProps {
  cart: CartItem[];
  onOpenNote: (cartId: string) => void;
  onUpdateQty: (cartId: string, delta: number) => void;
}

export const CheckoutCartSummary = ({
  cart,
  onOpenNote,
  onUpdateQty,
}: CheckoutCartSummaryProps) => {
  return (
    <div className="bg-muted/20 space-y-3 rounded-xl border p-3">
      <h4 className="text-muted-foreground text-xs font-bold uppercase">
        Rincian Pesanan
      </h4>
      {cart.map((item) => (
        <div
          key={item.cartId}
          className="flex flex-col border-b pb-2 last:border-0 last:pb-0"
        >
          <div className="flex justify-between">
            <div className="flex items-start gap-2">
              <span className="bg-muted rounded px-1.5 py-0.5 text-xs font-bold">
                {item.qty}x
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.name}</span>
                {item.note && (
                  <span className="mt-0.5 text-[10px] font-medium text-orange-500">
                    {item.note}
                  </span>
                )}
              </div>
            </div>
            <span className="text-sm font-bold">
              {formatRupiah(item.price * item.qty)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between pl-7">
            <button
              onClick={() => onOpenNote(item.cartId)}
              className="text-primary text-[11px] font-bold"
            >
              {item.note ? "Ubah Catatan" : "+ Catatan"}
            </button>
            <div className="bg-background flex h-6 items-center rounded border">
              <button
                onClick={() => onUpdateQty(item.cartId, -1)}
                className="text-muted-foreground hover:text-destructive px-2"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-4 text-center text-[10px] font-bold">
                {item.qty}
              </span>
              <button
                onClick={() => onUpdateQty(item.cartId, 1)}
                className="text-muted-foreground px-2 hover:text-green-600"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
