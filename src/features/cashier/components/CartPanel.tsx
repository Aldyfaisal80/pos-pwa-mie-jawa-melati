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
  onOpenNote: (cartId: string) => void;
  onClearNote: (cartId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

const CartItemRow = ({
  item,
  onUpdateQty,
  onOpenNote,
  onClearNote,
}: {
  item: CartItem;
  onUpdateQty: (cartId: string, delta: number) => void;
  onOpenNote: (cartId: string) => void;
  onClearNote: (cartId: string) => void;
}) => (
  <div className="bg-muted/30 flex gap-3 rounded-xl border p-3">
    <div className="bg-background text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold shadow-sm">
      {item.name.charAt(0)}
    </div>
    <div className="flex flex-1 flex-col">
      <div className="flex items-start justify-between">
        <span className="text-sm leading-none font-bold">{item.name}</span>
        <span className="text-sm font-bold">
          {formatRupiah(item.price * item.qty)}
        </span>
      </div>

      {item.note && (
        <span className="mt-1 inline-flex max-w-50 items-center gap-1 rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
          <MessageSquare className="h-3 w-3 shrink-0" />
          <span className="truncate">{item.note}</span>
          <button
            onClick={() => onClearNote(item.cartId)}
            className="ml-0.5 rounded hover:text-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => onOpenNote(item.cartId)}
          className="text-primary text-xs font-semibold hover:underline"
        >
          {item.note ? "Ubah Catatan" : "+ Catatan"}
        </button>
        <div className="bg-background flex h-8 items-center rounded-lg border shadow-sm">
          <button
            onClick={() => onUpdateQty(item.cartId, -1)}
            className="text-muted-foreground hover:text-destructive px-2"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
          <button
            onClick={() => onUpdateQty(item.cartId, 1)}
            className="text-muted-foreground px-2 hover:text-green-600"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const CartPanel = ({
  cart,
  cartTotal,
  onUpdateQty,
  onOpenNote,
  onClearNote,
  onClear,
  onCheckout,
}: CartPanelProps) => (
  <aside className="bg-background z-10 flex h-full w-full flex-col border-l shadow-xl">
    <div className="flex shrink-0 items-center justify-between border-b p-4">
      <div>
        <h3 className="text-lg font-bold">Pesanan Aktif</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Dine In • Meja Kasir
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        onClick={onClear}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>

    <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
      {cart.length === 0 ? (
        <div className="text-muted-foreground flex h-full flex-col items-center justify-center opacity-60">
          <UtensilsCrossed className="text-muted mb-3 h-12 w-12" />
          <p className="text-sm">Keranjang masih kosong</p>
        </div>
      ) : (
        cart.map((item) => (
          <CartItemRow
            key={item.cartId}
            item={item}
            onUpdateQty={onUpdateQty}
            onOpenNote={onOpenNote}
            onClearNote={onClearNote}
          />
        ))
      )}
    </div>

    <div className="bg-muted/20 shrink-0 border-t p-4">
      <div className="mb-4 space-y-1.5 text-sm">
        <div className="text-muted-foreground flex justify-between">
          <span>Subtotal</span>
          <span className="text-foreground font-semibold">
            {formatRupiah(cartTotal)}
          </span>
        </div>
        <div className="text-muted-foreground flex justify-between">
          <span>Pajak (0%)</span>
          <span className="text-foreground font-semibold">Rp 0</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-dashed pt-2">
          <span className="text-base font-bold">Total Tagihan</span>
          <span className="text-primary text-xl font-bold">
            {formatRupiah(cartTotal)}
          </span>
        </div>
      </div>
      <Button
        className="h-12 w-full text-sm font-bold shadow-md"
        disabled={cart.length === 0}
        onClick={onCheckout}
      >
        Bayar Sekarang <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  </aside>
);
