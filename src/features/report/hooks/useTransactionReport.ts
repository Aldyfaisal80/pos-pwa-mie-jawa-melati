import {
  type PaymentMethod,
  type ReportSortBy,
  type ReportSortOrder,
} from "@/server/validations";
import { api } from "@/trpc/react";

export const useTransactionReport = (
  startDate?: Date,
  endDate?: Date,
  search?: string,
  paymentMethod?: PaymentMethod | "ALL",
  sortBy?: ReportSortBy,
  sortOrder?: ReportSortOrder,
  limit = 25,
  page = 1,
) => {
  return api.transaction.getTransactionReport.useQuery(
    {
      startDate,
      endDate,
      search: search || undefined,
      paymentMethod: paymentMethod === "ALL" ? undefined : paymentMethod,
      sortBy,
      sortOrder,
      limit,
      page,
    },
    {
      placeholderData: (previousData) => previousData,
    },
  );
};
