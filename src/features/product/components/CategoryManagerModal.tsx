"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { useCategoryMutations } from "../hooks/useCategoryMutations";

interface CategoryManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoryManagerModal = ({
  open,
  onOpenChange,
}: CategoryManagerModalProps) => {
  const { data: categories, isLoading } = useCategories();
  const { createCategory, deleteCategory } = useCategoryMutations();
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    createCategory.mutate(
      { name: newName.trim() },
      { onSuccess: () => setNewName("") },
    );
  };

  const handleDelete = (id: number, name: string) => {
    toast(`Hapus kategori "${name}"?`, {
      description: "Tidak bisa dihapus jika masih ada produk di dalamnya.",
      action: {
        label: "Ya, Hapus",
        onClick: () => deleteCategory.mutate({ id }),
      },
      cancel: {
        label: "Batal",
        onClick: () => {},
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Kelola Kategori</DialogTitle>
        </DialogHeader>

        {/* Form Tambah Kategori */}
        <div className="flex gap-2">
          <Input
            placeholder="Nama kategori baru..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button
            size="icon"
            onClick={handleCreate}
            disabled={createCategory.isPending || !newName.trim()}
            title="Tambah kategori"
          >
            {createCategory.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Daftar Kategori */}
        <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md px-3 py-2"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            ))
          ) : !categories?.length ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              Belum ada kategori.
            </p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-md px-3 py-2"
              >
                <span className="text-sm font-medium">{cat.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-7 w-7"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={deleteCategory.isPending}
                  title={`Hapus "${cat.name}"`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
