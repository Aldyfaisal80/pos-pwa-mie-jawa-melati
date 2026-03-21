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
              className="text-primary text-xs font-bold hover:underline"
            >
              {item.note ? "Ubah Catatan" : "+ Catatan"}
            </button>
            <div className="bg-background flex h-8 items-center rounded-lg border shadow-sm">
              <button
                onClick={() => onUpdateQty(item.cartId, -1)}
                className="text-muted-foreground hover:text-destructive px-2 transition-colors hover:bg-muted/50 rounded-l-lg flex h-full items-center"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-xs font-bold">
                {item.qty}
              </span>
              <button
                onClick={() => onUpdateQty(item.cartId, 1)}
                className="text-muted-foreground px-2 hover:text-green-600 transition-colors hover:bg-muted/50 rounded-r-lg flex h-full items-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
