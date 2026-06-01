import { api } from "@/trpc/react";

export const useDashboardStats = () => {
  return api.transaction.getDashboardStats.useQuery();
};
