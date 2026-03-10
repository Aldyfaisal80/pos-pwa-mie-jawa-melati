import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useProductMutations = () => {
  const utils = api.useUtils();

  const refreshProducts = () => utils.product.getAll.invalidate();

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      toast.success("Produk berhasil ditambahkan!");
      void refreshProducts();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      toast.success("Produk berhasil diperbarui!");
      void refreshProducts();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Produk dihapus (tidak tersedia).");
      void refreshProducts();
    },
    onError: (err) => toast.error(err.message),
  });

  return { createProduct, updateProduct, deleteProduct };
};
