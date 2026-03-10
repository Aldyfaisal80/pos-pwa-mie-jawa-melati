import { type PaymentMethod } from "@/server/validations";
import { api } from "@/trpc/react";

export const useTransactionReport = (
  startDate?: Date,
  endDate?: Date,
  search?: string,
  paymentMethod?: PaymentMethod | "ALL",
  limit = 25,
  page = 1,
) => {
  return api.transaction.getTransactionReport.useQuery({
    startDate,
    endDate,
    search: search || undefined,
    paymentMethod: paymentMethod === "ALL" ? undefined : paymentMethod,
    limit,
    page,
  });
};
