import { api } from "@/trpc/react";
import type { PaymentMethod } from "@/server/validations";

interface UseReportChartParams {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod | "ALL";
}

export const useReportChart = ({
  startDate,
  endDate,
  paymentMethod,
}: UseReportChartParams) => {
  const resolvedMethod =
    paymentMethod === "ALL" ? undefined : paymentMethod!;

  return api.transaction.getReportChart.useQuery(
    { startDate, endDate, paymentMethod: resolvedMethod },
    { staleTime: 30_000 },
  );
};
