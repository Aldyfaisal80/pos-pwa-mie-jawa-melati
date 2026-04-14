"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useCategoryMutations } from "../../hooks/useCategoryMutations";

interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (categoryId: number, categoryName: string) => void;
}

export const CategoryFormModal = ({
  open,
  onOpenChange,
  onCreated,
}: CategoryFormModalProps) => {
  const [name, setName] = useState("");
  const { createCategory } = useCategoryMutations();

  const handleSubmit = () => {
    if (!name.trim()) return;
    createCategory.mutate(
      { name: name.trim() },
      {
        onSuccess: (data) => {
          if (data) onCreated?.(data.id, data.name);
          setName("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-75">
        <DialogHeader>
          <DialogTitle>Kategori Baru</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="newCategory">Nama Kategori</Label>
          <Input
            id="newCategory"
            placeholder="Contoh: Dessert"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={createCategory.isPending}>
            {createCategory.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Tambahkan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
