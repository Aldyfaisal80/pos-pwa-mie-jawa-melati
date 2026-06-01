import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  qty: number;
  applyQty: number;
  onChange: (value: number) => void;
}

export const QuantityStepper = ({
  qty,
  applyQty,
  onChange,
}: QuantityStepperProps) => (
  <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-xl border p-3 shadow-sm">
    <div>
      <p className="text-primary text-sm font-semibold">
        Terapkan untuk berapa porsi?
      </p>
      <p className="text-muted-foreground mt-0.5 max-w-50 text-[11px] leading-tight">
        Jika angka kurang dari {qty}, keranjang akan <b>terpecah otomatis</b>{" "}
        menjadi 2 baris.
      </p>
    </div>
    <div className="bg-background flex shrink-0 items-center gap-2 rounded-lg border px-2 py-1 shadow-sm">
      <button
        onClick={() => onChange(Math.max(1, applyQty - 1))}
        disabled={applyQty <= 1}
        className="bg-secondary/80 hover:bg-secondary disabled:hover:bg-secondary/80 flex h-8 w-8 items-center justify-center rounded transition-colors disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center text-sm font-bold">{applyQty}</span>
      <button
        onClick={() => onChange(Math.min(qty, applyQty + 1))}
        disabled={applyQty >= qty}
        className="bg-secondary/80 hover:bg-secondary disabled:hover:bg-secondary/80 flex h-8 w-8 items-center justify-center rounded transition-colors disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </div>
);
