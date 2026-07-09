import { api } from "@/trpc/react";
import type { PaymentMethod } from "@/server/validations";

interface UseReportStatsParams {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod | "ALL";
}

export const useReportStats = ({
  startDate,
  endDate,
  paymentMethod,
}: UseReportStatsParams) => {
  const resolvedMethod = paymentMethod === "ALL" ? undefined : paymentMethod!;

  return api.transaction.getReportStats.useQuery(
    { startDate, endDate, paymentMethod: resolvedMethod },
    { staleTime: 0, refetchOnMount: "always" },
  );
};
