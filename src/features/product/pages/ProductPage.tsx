"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CategoryManagerModal } from "../components/CategoryManagerModal";
import { ProductTable } from "../components/ProductTable";
import { ProductFormModal } from "../components/ProductFormModal";
import type { Product } from "../types/product.types";

export const ProductPage = () => {
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

  const handleDeleteClick = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteProduct.mutate(
      { id: pendingDeleteId },
      {
        onSuccess: () => {
          toast.success("Produk dinonaktifkan");
          setPendingDeleteId(null);
        },
        onError: () => {
          toast.error("Gagal menonaktifkan produk");
          setPendingDeleteId(null);
        },
      },
    );
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) setEditingProduct(null);
  };

  return (
    <PageContainer title="Manajemen Produk" withHeader>
      <SectionContainer padded>
        <Card>
          <CardHeader className="flex flex-col gap-4 space-y-0 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-bold">Daftar Menu</CardTitle>
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
          </CardHeader>
          <CardContent>
            <ProductTable
              products={products}
              isLoading={productsLoading}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </CardContent>
        </Card>

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

        {/* Konfirmasi Nonaktifkan Produk */}
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
      </SectionContainer>
    </PageContainer>
  );
};
