"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import { useProductMutations } from "../hooks/useProductMutations";
import { CategoryFormModal } from "./CategoryFormModal";
import { ImageUpload } from "@/components/ui/image-upload";
import { productFormSchema, type ProductFormValues } from "../schemas";
import type { Category, Product } from "../types/product.types";
import { useState } from "react";

const PRODUCT_FORM_ID = "product-form";

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
  image: "",
  isAvailable: true,
};

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
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { createProduct, updateProduct } = useProductMutations();
  const isLoading = createProduct.isPending || updateProduct.isPending;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Sync form with editingProduct whenever dialog opens
  useEffect(() => {
    if (!open) return;
    form.reset(
      editingProduct
        ? {
            name: editingProduct.name,
            description: editingProduct.description ?? "",
            price: Number(editingProduct.price),
            categoryId: String(editingProduct.categoryId),
            image: editingProduct.image ?? "",
            isAvailable: editingProduct.isAvailable,
          }
        : DEFAULT_VALUES,
    );
  }, [editingProduct, open, form]);

  const onSubmit = (data: ProductFormValues) => {
    const payload = {
      name: data.name,
      description: data.description || null,
      price: data.price,
      categoryId: Number(data.categoryId),
      image: data.image || null,
      isAvailable: data.isAvailable,
    };

    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, data: payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id={PRODUCT_FORM_ID}
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="relative mt-2 mb-6 flex flex-col items-center justify-center">
                    <ImageUpload
                      value={field.value ?? ""}
                      onChange={(url) => field.onChange(url || "")}
                      shape="square"
                      className="ring-background shadow-sm ring-4 transition-shadow hover:shadow-md"
                      placeholderText="Upload Foto"
                    />
                    <p className="text-muted-foreground mt-3 px-4 text-center text-xs">
                      Format 1:1 direkomendasikan. Foto akan tampil di katalog.
                    </p>
                  </div>
                )}
              />

              {/* Nama Produk */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Produk</FormLabel>
                    <FormControl>
                      <Input
                        id="prod-name"
                        placeholder="Contoh: Nasi Goreng Spesial"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deskripsi */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (opsional)</FormLabel>
                    <FormControl>
                      <Input
                        id="prod-desc"
                        placeholder="Contoh: Pedas, tanpa MSG"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kategori */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <div className="flex gap-2">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                        </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Harga */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        id="prod-price"
                        type="number"
                        min={0}
                        placeholder="Contoh: 15000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Ketersediaan */}
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Ketersediaan</FormLabel>
                    <Select
                      value={field.value ? "true" : "false"}
                      onValueChange={(v) => field.onChange(v === "true")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Tersedia</SelectItem>
                        <SelectItem value="false">Tidak Tersedia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" form={PRODUCT_FORM_ID} disabled={isLoading}>
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

      <CategoryFormModal
        open={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
        onCreated={(id) => form.setValue("categoryId", String(id))}
      />
    </>
  );
};
