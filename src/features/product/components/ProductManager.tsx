"use client";

import { useState, useMemo } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Settings2, Search, X } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  // Client-side filter — fast enough for hundreds of products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q),
    );
  }, [products, searchQuery]);

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

  const totalCount = products?.length ?? 0;
  const filteredCount = filteredProducts.length;
  const isFiltering = searchQuery.trim().length > 0;

  const countLabel = productsLoading
    ? "Memuat..."
    : isFiltering
      ? `${filteredCount} dari ${totalCount} produk`
      : `${totalCount} produk`;

  return (
    <>
      {/* Action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-6 pb-4">
        <p className="text-muted-foreground text-sm">{countLabel}</p>
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

      {/* Search bar */}
      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="product-search"
            placeholder="Cari nama atau kategori produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
            aria-label="Cari produk"
          />
          {isFiltering && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Hapus pencarian"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <CardContent className="pt-0">
        <ProductTable
          products={filteredProducts}
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
