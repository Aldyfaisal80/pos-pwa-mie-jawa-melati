import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";

export const useCategoryMutations = () => {
  const utils = api.useUtils();
  const { postMessage } = useBroadcastChannel("pos-sync-channel");

  const refreshCategories = () => {
    void utils.category.getAll.invalidate();
    postMessage({ type: "CATEGORY_UPDATED" });
  };

  const createCategory = api.category.create.useMutation({
    onSuccess: () => {
      toast.success("Kategori berhasil ditambahkan!");
      refreshCategories();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateCategory = api.category.update.useMutation({
    onSuccess: () => {
      toast.success("Kategori berhasil diperbarui!");
      refreshCategories();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteCategory = api.category.delete.useMutation({
    onSuccess: () => {
      toast.success("Kategori berhasil dihapus!");
      refreshCategories();
    },
    onError: (err) => toast.error(err.message),
  });

  return { createCategory, updateCategory, deleteCategory };
};

