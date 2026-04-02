import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  PaymentMethod,
  ReportSortBy,
  ReportSortOrder,
  type PaymentMethod as ServerPaymentMethod,
} from "@/server/validations";
import { api } from "@/trpc/react";
import { useTransactionReport } from "./useTransactionReport";
import { exportToCSV } from "../utils/reportUtils";

export const useReportFilters = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<
    ServerPaymentMethod | "ALL"
  >("ALL");
  const [sortBy, setSortBy] = useState<ReportSortBy>(ReportSortBy.DATE);
  const [sortOrder, setSortOrder] = useState<ReportSortOrder>(
    ReportSortOrder.DESC,
  );
  const [isExporting, setIsExporting] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const utils = api.useUtils();

  const { data, isLoading, isFetching } = useTransactionReport(
    startDate,
    endDate,
    search,
    paymentMethod,
    sortBy,
    sortOrder,
    limit,
    page,
  );

  const transactions = data?.transactions ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // Clamp page when totalPages shrinks
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Reset pagination on any filter change
  const withReset =
    <T>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  const handleSortChange = (column: ReportSortBy) => {
    setPage(1);
    if (sortBy === column) {
      setSortOrder((prev) =>
        prev === ReportSortOrder.ASC
          ? ReportSortOrder.DESC
          : ReportSortOrder.ASC,
      );
      return;
    }
    setSortBy(column);
    setSortOrder(
      column === ReportSortBy.DATE ? ReportSortOrder.DESC : ReportSortOrder.ASC,
    );
  };

  const handleExport = async () => {
    if (!totalCount) {
      toast.error("Tidak ada data untuk diekspor.");
      return;
    }
    setIsExporting(true);
    try {
      const exportRows =
        (await utils.transaction.exportTransactionReport.fetch({
          startDate,
          endDate,
          search: search || undefined,
          paymentMethod: paymentMethod === "ALL" ? undefined : paymentMethod,
          sortBy,
          sortOrder,
        })) ?? [];

      if (!exportRows.length) {
        toast.error("Tidak ada data untuk diekspor.");
        return;
      }
      exportToCSV(exportRows);
      toast.success("Export Berhasil", {
        description: `${exportRows.length} baris laporan berhasil diunduh.`,
      });
    } catch (error) {
      toast.error("Gagal export laporan.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    // filter state
    search,
    startDate,
    endDate,
    paymentMethod,
    sortBy,
    sortOrder,
    limit,
    page,
    // setters with auto-reset
    setSearch: withReset(setSearch),
    setStartDate: withReset(setStartDate),
    setEndDate: withReset(setEndDate),
    setPaymentMethod: withReset(setPaymentMethod),
    setLimit: (v: number) => {
      setLimit(v);
      setPage(1);
    },
    // handlers
    handleSortChange,
    handlePageChange,
    handleExport,
    // query state
    transactions,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    isExporting,
    // enums re-exported for convenience
    PaymentMethod,
  };
};
