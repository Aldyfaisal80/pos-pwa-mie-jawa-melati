"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Plus, Loader2, Pencil, Check, X } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { useCategoryMutations } from "../../hooks/useCategoryMutations";

interface CategoryManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoryManagerModal = ({
  open,
  onOpenChange,
}: CategoryManagerModalProps) => {
  const { data: categories, isLoading } = useCategories();
  const { createCategory, updateCategory, deleteCategory } =
    useCategoryMutations();
  const [newName, setNewName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const isDeletingCategory = deleteCategory.isPending;
  const isUpdatingCategory = updateCategory.isPending;

  const handleCreate = () => {
    if (!newName.trim()) return;
    createCategory.mutate(
      { name: newName.trim() },
      { onSuccess: () => setNewName("") },
    );
  };

  const handleDelete = (id: number, name: string) => {
    setPendingDelete({ id, name });
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!pendingDelete) return;
    deleteCategory.mutate(
      { id: pendingDelete.id },
      { onSettled: () => setPendingDelete(null) },
    );
  };

  const handleStartEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditValue(name);
    // autoFocus via ref after state update
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleConfirmEdit = () => {
    if (!editingId || !editValue.trim()) return;
    updateCategory.mutate(
      { id: editingId, name: editValue.trim() },
      { onSuccess: handleCancelEdit },
    );
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirmEdit();
    if (e.key === "Escape") handleCancelEdit();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) handleCancelEdit();
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <>
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
              categories.map((cat) => {
                const isEditing = editingId === cat.id;
                const isAnotherEditing =
                  editingId !== null && editingId !== cat.id;

                return (
                  <div
                    key={cat.id}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors ${
                      isEditing
                        ? "bg-muted/60 ring-primary/30 ring-1"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {isEditing ? (
                      /* === MODE EDIT === */
                      <>
                        <Input
                          ref={editInputRef}
                          className="h-7 flex-1 text-sm"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          disabled={isUpdatingCategory}
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-emerald-500 hover:text-emerald-600"
                          onClick={handleConfirmEdit}
                          disabled={
                            isUpdatingCategory || !editValue.trim()
                          }
                          title="Simpan perubahan"
                        >
                          {isUpdatingCategory ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground h-7 w-7 shrink-0"
                          onClick={handleCancelEdit}
                          disabled={isUpdatingCategory}
                          title="Batal"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    ) : (
                      /* === MODE NORMAL === */
                      <>
                        <span className="flex-1 truncate text-sm font-medium">
                          {cat.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground h-7 w-7 shrink-0"
                          onClick={() => handleStartEdit(cat.id, cat.name)}
                          disabled={isAnotherEditing}
                          title={`Edit "${cat.name}"`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-7 w-7 shrink-0"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          disabled={
                            deleteCategory.isPending || isAnotherEditing
                          }
                          title={`Hapus "${cat.name}"`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>

        <AlertDialog
          open={pendingDelete !== null}
          onOpenChange={(open) => {
            if (!open && !isDeletingCategory) setPendingDelete(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Hapus kategori "{pendingDelete?.name}"?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tidak bisa dihapus jika masih ada produk di dalamnya.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingCategory}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeletingCategory}
                onClick={handleConfirmDelete}
              >
                {isDeletingCategory ? "Menghapus..." : "Ya, Hapus"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    </Dialog>
  );
};
