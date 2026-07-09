import { api } from "@/trpc/react";

export const useDashboardStats = () => {
  return api.transaction.getDashboardStats.useQuery(undefined, {
    staleTime: 0,
    refetchOnMount: "always",
  });
};
