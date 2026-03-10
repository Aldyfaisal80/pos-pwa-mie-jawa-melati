import { api } from "@/trpc/react";

export const useCategories = () => {
  return api.category.getAll.useQuery();
};
