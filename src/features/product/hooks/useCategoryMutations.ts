import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useCategoryMutations = () => {
  const utils = api.useUtils();

  const refreshCategories = () => utils.category.getAll.invalidate();

  const createCategory = api.category.create.useMutation({
    onSuccess: () => {
      toast.success("Kategori berhasil ditambahkan!");
      void refreshCategories();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteCategory = api.category.delete.useMutation({
    onSuccess: () => {
      toast.success("Kategori berhasil dihapus!");
      void refreshCategories();
    },
    onError: (err) => toast.error(err.message),
  });

  return { createCategory, deleteCategory };
};
