"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useProductMutations } from "../hooks/useProductMutations";
import { CategoryFormModal } from "./CategoryFormModal";
import type {
  Category,
  Product,
  ProductFormData,
} from "../types/product.types";
import { defaultProductFormData } from "../types/product.types";
import { ImageUpload } from "@/components/ui/image-upload";

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  categories: Category[];
}

export const ProductFormModal = ({
  open,
  onOpenChange,
  editingProduct,
  categories,
}: ProductFormModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>(() =>
    editingProduct
      ? {
          name: editingProduct.name,
          description: editingProduct.description ?? "",
          categoryId: String(editingProduct.categoryId),
          price: String(editingProduct.price),
          image: editingProduct.image ?? "",
          isAvailable: editingProduct.isAvailable,
        }
      : defaultProductFormData,
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const { createProduct, updateProduct } = useProductMutations();
  const isLoading = createProduct.isPending || updateProduct.isPending;

  // Sync form ketika editingProduct berubah
  const [lastEditingId, setLastEditingId] = useState<string | null>(null);
  if ((editingProduct?.id ?? null) !== lastEditingId) {
    setLastEditingId(editingProduct?.id ?? null);
    setFormData(
      editingProduct
        ? {
            name: editingProduct.name,
            description: editingProduct.description ?? "",
            categoryId: String(editingProduct.categoryId),
            price: String(editingProduct.price),
            image: editingProduct.image ?? "",
            isAvailable: editingProduct.isAvailable,
          }
        : defaultProductFormData,
    );
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.categoryId || !formData.price) {
      return;
    }
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      categoryId: Number(formData.categoryId),
      price: Number(formData.price),
      image: formData.image?.trim() || null,
      isAvailable: formData.isAvailable,
    };

    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, data: payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => {
          setFormData(defaultProductFormData);
          onOpenChange(false);
        },
      });
    }
  };

  const set = (field: keyof ProductFormData) => (value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Image Upload */}
            <div className="relative mt-2 mb-6 flex flex-col items-center justify-center">
              <ImageUpload
                value={formData.image}
                onChange={(url) => set("image")(url || "")}
                shape="square"
                className="ring-background shadow-sm ring-4 transition-shadow hover:shadow-md"
                placeholderText="Upload Foto"
              />
              <p className="text-muted-foreground mt-3 px-4 text-center text-xs">
                Format 1:1 direkomendasikan. Foto akan tampil di katalog.
              </p>
            </div>

            {/* Nama */}
            <div className="space-y-2">
              <Label htmlFor="prod-name">Nama Produk</Label>
              <Input
                id="prod-name"
                placeholder="Contoh: Nasi Goreng Spesial"
                value={formData.name}
                onChange={(e) => set("name")(e.target.value)}
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="prod-desc">Deskripsi (opsional)</Label>
              <Input
                id="prod-desc"
                placeholder="Contoh: Pedas, tanpa MSG"
                value={formData.description}
                onChange={(e) => set("description")(e.target.value)}
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label>Kategori</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.categoryId}
                  onValueChange={set("categoryId")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Tambah Kategori Baru"
                  onClick={() => setIsCategoryModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Harga */}
            <div className="space-y-2">
              <Label htmlFor="prod-price">Harga (Rp)</Label>
              <Input
                id="prod-price"
                type="number"
                min={0}
                placeholder="Contoh: 15000"
                value={formData.price}
                onChange={(e) => set("price")(e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status Ketersediaan</Label>
              <Select
                value={formData.isAvailable ? "true" : "false"}
                onValueChange={(v) => set("isAvailable")(v === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Tersedia</SelectItem>
                  <SelectItem value="false">Tidak Tersedia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Produk"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Kategori Baru  */}
      <CategoryFormModal
        open={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
        onCreated={(id) => set("categoryId")(String(id))}
      />
    </>
  );
};
