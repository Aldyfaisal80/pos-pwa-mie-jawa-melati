"use client";

import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings2 } from "lucide-react";
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
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useProductMutations } from "../hooks/useProductMutations";
import { CategoryManagerModal } from "./CategoryManagerModal";
import { ProductTable } from "./ProductTable";
import { ProductFormModal } from "./ProductFormModal";
import type { Product } from "../types/product.types";

export const ProductManager = () => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { deleteProduct } = useProductMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) setEditingProduct(null);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteProduct.mutate(
      { id: pendingDeleteId },
      // Toast handled by useProductMutations — only close dialog here
      {
        onSuccess: () => setPendingDeleteId(null),
        onError: () => setPendingDeleteId(null),
      },
    );
  };

  return (
    <>
      {/* Action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-6 pb-4">
        <p className="text-muted-foreground text-sm">
          {productsLoading ? "Memuat..." : `${products?.length ?? 0} produk`}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCategoryManagerOpen(true)}
          >
            <Settings2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Kelola Kategori</span>
          </Button>
          <Button onClick={handleAddClick} size="sm">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Tambah Produk</span>
          </Button>
        </div>
      </div>

      <CardContent className="pt-0">
        <ProductTable
          products={products}
          isLoading={productsLoading}
          onEdit={handleEditClick}
          onDelete={(id) => setPendingDeleteId(id)}
        />
      </CardContent>

      <ProductFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        editingProduct={editingProduct}
        categories={categories}
      />

      <CategoryManagerModal
        open={isCategoryManagerOpen}
        onOpenChange={setIsCategoryManagerOpen}
      />

      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open && !deleteProduct.isPending) setPendingDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan produk ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Produk tidak akan muncul di halaman kasir. Kamu bisa
              mengaktifkannya kembali kapan saja.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProduct.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteProduct.isPending}
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
            >
              {deleteProduct.isPending ? "Memproses..." : "Ya, Nonaktifkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
