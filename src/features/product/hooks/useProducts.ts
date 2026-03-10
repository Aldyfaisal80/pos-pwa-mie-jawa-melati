import { api } from "@/trpc/react";

export const useProducts = () => {
  return api.product.getAll.useQuery();
};
