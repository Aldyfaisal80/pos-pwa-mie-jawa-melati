import { memo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Minus,
  Plus,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { ChevronRight } from "lucide-react";
import type { CartItem } from "../types/cashier.types";

interface CartPanelProps {
  cart: CartItem[];
  cartTotal: number;
  onUpdateQty: (cartId: string, delta: number) => void;
  onSetAbsoluteQty: (cartId: string, qty: number) => void;
  onOpenNote: (cartId: string) => void;
  onClearNote: (cartId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

const CartItemRow = memo(
  ({
    item,
    onUpdateQty,
    onSetAbsoluteQty,
    onOpenNote,
    onClearNote,
  }: {
    item: CartItem;
    onUpdateQty: (cartId: string, delta: number) => void;
    onSetAbsoluteQty: (cartId: string, qty: number) => void;
    onOpenNote: (cartId: string) => void;
    onClearNote: (cartId: string) => void;
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
    <div className="border-border/80 hover:bg-muted/10 relative flex flex-col gap-2 border-b border-dashed py-4 transition-colors last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="line-clamp-2 text-sm leading-tight font-bold">
            {item.name}
          </span>
          <span className="text-muted-foreground mt-0.5 text-xs">
            {formatRupiah(item.price)} x {item.qty}
          </span>
        </div>
        <span className="text-foreground shrink-0 text-sm font-extrabold">
          {formatRupiah(item.price * item.qty)}
        </span>
      </div>

      {item.note && (
        <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md bg-orange-100/80 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
          <MessageSquare className="h-3.5 w-3.5 shrink-0" />
          <span className="max-w-35 truncate">{item.note}</span>
          <button
            onClick={() => onClearNote(item.cartId)}
            className="ml-1 rounded-sm transition-colors hover:text-red-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      )}

      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => onOpenNote(item.cartId)}
          className="text-primary text-xs font-bold hover:underline"
        >
          {item.note ? "Ubah Catatan" : "+ Catatan"}
        </button>
        <div className="bg-background flex h-9 items-center rounded-xl border shadow-sm sm:h-10">
          <button
            onClick={() => onUpdateQty(item.cartId, -1)}
            className="text-muted-foreground hover:text-destructive hover:bg-muted/50 flex h-full items-center justify-center rounded-l-xl px-3 transition-colors"
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
              className="w-10 bg-transparent text-center text-sm font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              autoFocus
              onFocus={(e) => e.target.select()}
              min={0}
              inputMode="numeric"
            />
          ) : (
            <button
              onClick={handleStartEdit}
              className="w-10 text-center text-sm font-bold hover:text-primary transition-colors cursor-text"
              title="Klik untuk ubah qty"
            >
              {item.qty}
            </button>
          )}
          <button
            onClick={() => onUpdateQty(item.cartId, 1)}
            className="text-muted-foreground hover:bg-muted/50 flex h-full items-center justify-center rounded-r-xl px-3 transition-colors hover:text-green-600"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
    );
  },
);

export const CartPanel = memo(
  ({
    cart,
    cartTotal,
    onUpdateQty,
    onSetAbsoluteQty,
    onOpenNote,
    onClearNote,
    onClear,
    onCheckout,
  }: CartPanelProps) => (
    <aside className="bg-background/95 z-10 flex h-full w-full flex-col border-l shadow-2xl backdrop-blur-xl">
      <div className="flex shrink-0 items-center justify-between border-b p-5 sm:p-6">
        <div>
          <h3 className="text-xl font-extrabold">Pesanan Aktif</h3>
          <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wider uppercase">
            Dine In • Meja Kasir
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10 rounded-full transition-colors"
          onClick={onClear}
          title="Kosongkan Keranjang"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-5 sm:px-6">
        {cart.length === 0 ? (
          <div className="animate-fade-in flex h-full flex-col items-center justify-center px-6 text-center opacity-50">
            <UtensilsCrossed className="text-muted-foreground mb-4 h-14 w-14 opacity-20" />
            <p className="text-muted-foreground text-sm font-semibold">
              Keranjang masih kosong
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Silakan pilih menu dari daftar produk
            </p>
          </div>
        ) : (
          <div className="animate-stagger py-2">
            {cart.map((item) => (
              <CartItemRow
                key={item.cartId}
                item={item}
                onUpdateQty={onUpdateQty}
                onSetAbsoluteQty={onSetAbsoluteQty}
                onOpenNote={onOpenNote}
                onClearNote={onClearNote}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-muted/10 shrink-0 border-t border-dashed p-5 sm:p-6">
        <div className="mb-5 space-y-2 text-sm">
          <div className="text-muted-foreground flex justify-between font-medium">
            <span>Subtotal</span>
            <span className="text-foreground font-bold">
              {formatRupiah(cartTotal)}
            </span>
          </div>
          <div className="text-muted-foreground flex justify-between font-medium">
            <span>Pajak (0%)</span>
            <span className="text-foreground font-bold">Rp 0</span>
          </div>
          <div className="border-border/70 mt-3 flex items-center justify-between border-t border-dashed pt-3">
            <span className="text-foreground text-lg font-extrabold">
              Total Tagihan
            </span>
            <span className="text-primary text-2xl font-extrabold tracking-tight">
              {formatRupiah(cartTotal)}
            </span>
          </div>
        </div>
        <Button
          className="shadow-primary/25 h-14 w-full rounded-xl text-base font-bold shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          disabled={cart.length === 0}
          onClick={onCheckout}
        >
          Bayar Sekarang <ChevronRight className="ml-1.5 h-5 w-5" />
        </Button>
      </div>
    </aside>
  ),
);
