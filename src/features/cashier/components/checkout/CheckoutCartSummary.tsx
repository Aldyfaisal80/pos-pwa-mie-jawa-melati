"use client";

import { useState, useCallback } from "react";
import { Minus, Plus } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import type { CartItem } from "../../types/cashier.types";

interface CheckoutCartSummaryProps {
  cart: CartItem[];
  onOpenNote: (cartId: string) => void;
  onUpdateQty: (cartId: string, delta: number) => void;
  onSetAbsoluteQty: (cartId: string, qty: number) => void;
}

const CheckoutItemRow = ({
  item,
  onOpenNote,
  onUpdateQty,
  onSetAbsoluteQty,
}: {
  item: CartItem;
  onOpenNote: (cartId: string) => void;
  onUpdateQty: (cartId: string, delta: number) => void;
  onSetAbsoluteQty: (cartId: string, qty: number) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = useCallback(() => {
    setEditValue(String(item.qty));
    setIsEditing(true);
  }, [item.qty]);

  const handleCommit = useCallback(() => {
    setIsEditing(false);
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed) && parsed !== item.qty) {
      if (parsed <= 0) {
        onUpdateQty(item.cartId, -item.qty);
      } else {
        onSetAbsoluteQty(item.cartId, parsed);
      }
    }
  }, [editValue, item.qty, item.cartId, onUpdateQty, onSetAbsoluteQty]);

  return (
    <div className="flex flex-col border-b pb-2 last:border-0 last:pb-0">
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
            className="text-muted-foreground hover:text-destructive hover:bg-muted/50 flex h-full items-center rounded-l-lg px-2 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          {isEditing ? (
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleCommit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCommit();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="w-8 bg-transparent text-center text-xs font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              autoFocus
              onFocus={(e) => e.target.select()}
              min={0}
              inputMode="numeric"
            />
          ) : (
            <button
              onClick={handleStartEdit}
              className="w-8 text-center text-xs font-bold hover:text-primary transition-colors cursor-text"
              title="Klik untuk ubah qty"
            >
              {item.qty}
            </button>
          )}
          <button
            onClick={() => onUpdateQty(item.cartId, 1)}
            className="text-muted-foreground hover:bg-muted/50 flex h-full items-center rounded-r-lg px-2 transition-colors hover:text-green-600"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const CheckoutCartSummary = ({
  cart,
  onOpenNote,
  onUpdateQty,
  onSetAbsoluteQty,
}: CheckoutCartSummaryProps) => {
  return (
    <div className="bg-muted/20 space-y-3 rounded-xl border p-3">
      <h4 className="text-muted-foreground text-xs font-bold uppercase">
        Rincian Pesanan
      </h4>
      {cart.map((item) => (
        <CheckoutItemRow
          key={item.cartId}
          item={item}
          onOpenNote={onOpenNote}
          onUpdateQty={onUpdateQty}
          onSetAbsoluteQty={onSetAbsoluteQty}
        />
      ))}
    </div>
  );
};
