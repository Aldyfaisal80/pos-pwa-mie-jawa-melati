"use client";

import { useIsMobile } from "@/hooks/useMobile";
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
import { useNoteDraft } from "../hooks/useNoteDraft";
import { MAX_FREE_TEXT } from "../utils/noteLogic";
import { TagGroupList } from "./note/TagGroupList";
import { QuantityStepper } from "./note/QuantityStepper";
import { NotePreview } from "./note/NotePreview";

interface NoteModalProps {
  open: boolean;
  initialNote: string;
  qty: number;
  productName?: string;
  categoryName?: string;
  onOpenChange: (open: boolean) => void;
  onSave: (note: string, applyQty: number) => void;
}

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
  const {
    relevantGroups,
    selectedTags,
    freeText,
    applyQty,
    previewNote,
    setFreeText,
    setApplyQty,
    toggleTag,
    clearAll,
    buildCurrentNote,
  } = useNoteDraft({ open, initialNote, qty, categoryName });

  const charsLeft = MAX_FREE_TEXT - freeText.length;

  const handleSave = () => {
    onSave(buildCurrentNote(), applyQty);
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) handleSave();
    else onOpenChange(isOpen);
  };

  const Header = (
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

  const Body = (
    <>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
        {qty > 1 && (
          <QuantityStepper
            qty={qty}
            applyQty={applyQty}
            onChange={setApplyQty}
          />
        )}

        <NotePreview previewNote={previewNote} onClearAll={clearAll} />

        <TagGroupList
          groups={relevantGroups}
          selectedTags={selectedTags}
          onToggle={toggleTag}
        />

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

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="bg-background flex max-h-[92dvh] flex-col">
          <DrawerHeader className="border-b px-4 py-3 text-left">
            <DrawerTitle className="sr-only">Catatan Pesanan</DrawerTitle>
            {Header}
          </DrawerHeader>
          {Body}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b px-4 py-4 text-left">
          <DialogTitle className="sr-only">Catatan Pesanan</DialogTitle>
          {Header}
        </DialogHeader>
        {Body}
      </DialogContent>
    </Dialog>
  );
};
