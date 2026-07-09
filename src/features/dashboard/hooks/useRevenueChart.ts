import { api } from "@/trpc/react";
import type { PeriodDays } from "../constants/periodOptions";

export const useRevenueChart = (days: PeriodDays) => {
  return api.transaction.getRevenueChart.useQuery({ days }, {
    staleTime: 0,
  });
};
