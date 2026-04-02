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
import { Loader2 } from "lucide-react";
import { useProductMutations } from "../hooks/useProductMutations";
import { ProductImageField } from "./ProductImageField";
import { CategorySelectField } from "./CategorySelectField";
import { productFormSchema, type ProductFormValues } from "../schemas";
import type { Category, Product } from "../types/product.types";

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
  const { createProduct, updateProduct } = useProductMutations();
  const isLoading = createProduct.isPending || updateProduct.isPending;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

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
      description: data.description ?? null,
      price: data.price,
      categoryId: Number(data.categoryId),
      image: data.image ?? null,
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
            <ProductImageField control={form.control} />

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

            <CategorySelectField
              control={form.control}
              categories={categories}
              onCategoryCreated={(id) =>
                form.setValue("categoryId", String(id))
              }
            />

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
  );
};
