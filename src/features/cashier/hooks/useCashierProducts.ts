import { api } from "@/trpc/react";
import { useMemo } from "react";

export const useCashierProducts = () => {
  const { data: products, isLoading } = api.product.getAll.useQuery({
    onlyAvailable: true,
  });

  const { data: categories, isLoading: catLoading } =
    api.category.getAll.useQuery();

  const categoryNames = useMemo(
    () => ["Semua", ...(categories?.map((c) => c.name) ?? [])],
    [categories],
  );

  return { products, isLoading, categoryNames, catLoading };
};
