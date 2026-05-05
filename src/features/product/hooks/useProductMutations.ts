import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";

export const useProductMutations = () => {
  const utils = api.useUtils();
  const { postMessage } = useBroadcastChannel("pos-sync-channel");

  const refreshProducts = () => {
    void utils.product.getAll.invalidate();
    postMessage({ type: "PRODUCT_UPDATED" });
  };

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      toast.success("Produk berhasil ditambahkan!");
      refreshProducts();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      toast.success("Produk berhasil diperbarui!");
      refreshProducts();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Produk dinonaktifkan.");
      refreshProducts();
    },
    onError: (err) => toast.error(err.message),
  });

  return { createProduct, updateProduct, deleteProduct };
};

