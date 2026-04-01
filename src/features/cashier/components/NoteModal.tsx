"use client";

import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X } from "lucide-react";

// ─── Tag Groups ───────────────────────────────────────────────────────────────
interface TagGroup {
  label: string;
  tags: string[];
  for: ("food" | "drink" | "universal")[];
}

const TAG_GROUPS: TagGroup[] = [
  {
    label: "Tingkat Kepedasan",
    tags: ["Tidak Pedas", "Sedang", "Pedas", "Pedas Banget"],
    for: ["food"],
  },
  {
    label: "Porsi",
    tags: ["Bungkus", "Pisah", "Kuah Sedikit", "Kuah Banyak"],
    for: ["food"],
  },
  {
    label: "Minuman",
    tags: ["Hangat", "Kurang Manis", "Tanpa Gula", "Extra Es", "Sedikit Es"],
    for: ["drink"],
  },
  {
    label: "Tambahan",
    tags: ["Sambal Extra", "Kecap Extra", "No Bawang", "No MSG"],
    for: ["food", "universal"],
  },
];

// Mutual exclusion pairs — selecting one removes the others
const EXCLUSIVE_CONFLICTS: Record<string, string[]> = {
  "Tidak Pedas": ["Sedang", "Pedas", "Pedas Banget"],
  Sedang: ["Tidak Pedas", "Pedas", "Pedas Banget"],
  Pedas: ["Tidak Pedas", "Sedang", "Pedas Banget"],
  "Pedas Banget": ["Tidak Pedas", "Sedang", "Pedas"],
  "Tanpa Gula": ["Kurang Manis"],
  "Kurang Manis": ["Tanpa Gula"],
  "Extra Es": ["Sedikit Es"],
  "Sedikit Es": ["Extra Es"],
};

const MAX_FREE_TEXT = 150;

const isDrinkCategory = (cat?: string) => {
  if (!cat) return false;
  const lower = cat.toLowerCase();
  return (
    lower.includes("minum") ||
    lower.includes("drink") ||
    lower.includes("es ") ||
    lower === "es" ||
    lower.includes("jus") ||
    lower.includes("teh") ||
    lower.includes("kopi") ||
    lower.includes("susu") ||
    lower.includes("air")
  );
};

// Build final note string from selected tags + free text
const buildNote = (selected: Set<string>, freeText: string): string => {
  const parts = [...selected];
  if (freeText.trim()) parts.push(freeText.trim());
  return parts.join(", ");
};

// Parse existing note string back into {selected, freeText}
const parseNote = (
  note: string,
  allTags: string[],
): { selected: Set<string>; freeText: string } => {
  if (!note.trim()) return { selected: new Set(), freeText: "" };

  const selected = new Set<string>();
  const remaining: string[] = [];

  const parts = note.split(",").map((p) => p.trim());
  for (const part of parts) {
    const matched = allTags.find((t) => t.toLowerCase() === part.toLowerCase());
    if (matched) {
      selected.add(matched);
    } else if (part) {
      remaining.push(part);
    }
  }

  return { selected, freeText: remaining.join(", ") };
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface NoteModalProps {
  open: boolean;
  initialNote: string;
  qty: number;
  productName?: string;
  categoryName?: string;
  onOpenChange: (open: boolean) => void;
  onSave: (note: string, applyQty: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NoteModal = ({
  open,
  initialNote,
  qty,
  productName,
  categoryName,
  onOpenChange,
  onSave,
}: NoteModalProps) => {
  const isMobile = useIsMobile();
  const isDrink = isDrinkCategory(categoryName);
  const isMulti = qty > 1;

  const relevantGroups = TAG_GROUPS.filter(
    (g) =>
      g.for.includes("universal") ||
      (isDrink ? g.for.includes("drink") : g.for.includes("food")),
  );
  const allRelevantTags = relevantGroups.flatMap((g) => g.tags);

  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [freeText, setFreeText] = useState("");
  const [applyQty, setApplyQty] = useState(qty);

  // Sync when modal opens
  useEffect(() => {
    if (!open) return;
    const parsed = parseNote(initialNote, allRelevantTags);
    setSelectedTags(parsed.selected);
    setFreeText(parsed.freeText);
    setApplyQty(qty); // Default to applying to the max available quantity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialNote, qty]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        // Apply mutual exclusion
        const conflicts = EXCLUSIVE_CONFLICTS[tag] ?? [];
        conflicts.forEach((c) => next.delete(c));
        next.add(tag);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setSelectedTags(new Set());
    setFreeText("");
  };

  const handleSave = () => {
    onSave(buildNote(selectedTags, freeText), applyQty);
    onOpenChange(false);
  };

  const handleDrawerOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Auto-save on swipe down or click outside
      handleSave();
    } else {
      onOpenChange(isOpen);
    }
  };

  const previewNote = buildNote(selectedTags, freeText);
  const charsLeft = MAX_FREE_TEXT - freeText.length;

  const InnerContent = (
    <>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
        {/* Stepper for "Apply to how many portions?" */}
        {isMulti && (
          <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-xl border p-3 shadow-sm">
            <div>
              <p className="text-primary text-sm font-semibold">
                Terapkan untuk berapa porsi?
              </p>
              <p className="text-muted-foreground mt-0.5 max-w-50 text-[11px] leading-tight">
                Jika angka kurang dari {qty}, keranjang akan{" "}
                <b>terpecah otomatis</b> menjadi 2 baris.
              </p>
            </div>
            <div className="bg-background flex shrink-0 items-center gap-2 rounded-lg border px-2 py-1 shadow-sm">
              <button
                onClick={() => setApplyQty(Math.max(1, applyQty - 1))}
                disabled={applyQty <= 1}
                className="bg-secondary/80 hover:bg-secondary disabled:hover:bg-secondary/80 flex h-8 w-8 items-center justify-center rounded transition-colors disabled:opacity-30"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-bold">
                {applyQty}
              </span>
              <button
                onClick={() => setApplyQty(Math.min(qty, applyQty + 1))}
                disabled={applyQty >= qty}
                className="bg-secondary/80 hover:bg-secondary disabled:hover:bg-secondary/80 flex h-8 w-8 items-center justify-center rounded transition-colors disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Active tag chips */}
        {(selectedTags.size > 0 || freeText) && (
          <div className="bg-muted/30 rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Hasil Catatan (Struk)
              </p>
              <button
                onClick={handleClearAll}
                className="text-destructive text-[10px] font-medium hover:underline"
              >
                Hapus semua
              </button>
            </div>
            <div className="text-foreground bg-background border-border/50 rounded border p-2 text-sm font-medium wrap-break-word">
              {previewNote || (
                <span className="text-muted-foreground font-normal italic">
                  Tidak ada catatan
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick tag groups */}
        <div className="space-y-4">
          {relevantGroups.map((group) => (
            <div key={group.label}>
              <p className="text-muted-foreground mb-2 text-[10px] font-bold tracking-wider uppercase">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => {
                  const isActive = selectedTags.has(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all select-none active:scale-95 ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-primary/20"
                          : "bg-background border-border text-foreground hover:bg-muted"
                      } `}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Free text */}
        <div className="mt-4 border-t pt-2">
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Catatan Bebas (Ketik Sendiri)
            </p>
            <span
              className={`text-[10px] ${charsLeft <= 20 ? "text-destructive font-bold" : "text-muted-foreground"}`}
            >
              {charsLeft} sisa
            </span>
          </div>
          <Textarea
            value={freeText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFreeText(e.target.value.slice(0, MAX_FREE_TEXT))
            }
            placeholder="Ketik request khusus tambahan (opsional)..."
            className="placeholder:text-muted-foreground/60 focus-visible:ring-primary/20 min-h-20 resize-none text-sm"
          />
        </div>
      </div>

      <div className="bg-background pb-safe shrink-0 gap-2 border-t px-4 py-3 sm:px-5">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12 flex-1 shadow-sm"
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            className="h-12 flex-1 font-semibold shadow-sm"
          >
            Simpan Catatan
          </Button>
        </div>
      </div>
    </>
  );

  const HeaderContent = (
    <>
      <div className="text-base leading-none font-semibold tracking-tight">
        Catatan Pesanan
        {productName && (
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            — {productName}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 sm:mt-0">
        {categoryName && (
          <p className="text-muted-foreground text-xs">
            Kategori: <span className="font-medium">{categoryName}</span>
          </p>
        )}
        <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[11px] font-medium">
          Total porsi baris ini: <b>{qty}</b>
        </span>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleDrawerOpenChange}>
        <DrawerContent className="bg-background flex max-h-[92dvh] flex-col">
          <DrawerHeader className="border-b px-4 py-3 text-left">
            <DrawerTitle className="sr-only">Catatan Pesanan</DrawerTitle>
            {HeaderContent}
          </DrawerHeader>
          {InnerContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleDrawerOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b px-4 py-4 text-left">
          <DialogTitle className="sr-only">Catatan Pesanan</DialogTitle>
          {HeaderContent}
        </DialogHeader>
        {InnerContent}
      </DialogContent>
    </Dialog>
  );
};
