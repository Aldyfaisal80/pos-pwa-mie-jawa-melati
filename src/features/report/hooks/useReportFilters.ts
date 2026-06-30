import { useEffect, useMemo, useState } from "react";
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
import { useOfflinePending } from "@/hooks/useOfflinePending";

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
  const { pending } = useOfflinePending();

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

  // Merge pending transactions into the report on page 1
  const { transactions, totalCount, totalPages } = useMemo(() => {
    const serverTrx = data?.transactions ?? [];
    const serverCount = data?.totalCount ?? 0;
    const serverPages = data?.totalPages ?? 1;

    if (pending.length === 0) {
      return { transactions: serverTrx, totalCount: serverCount, totalPages: serverPages };
    }

    // Filter pending by active filters
    const filtered = pending.filter((trx) => {
      const d = new Date(trx.date);
      if (startDate && d < startDate) return false;
      if (endDate) {
        const eod = new Date(endDate);
        eod.setHours(23, 59, 59, 999);
        if (d > eod) return false;
      }
      if (paymentMethod !== "ALL" && trx.paymentMethod !== (paymentMethod as string)) return false;
      if (search && !trx.invoiceNumber.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    if (filtered.length === 0) {
      return { transactions: serverTrx, totalCount: serverCount, totalPages: serverPages };
    }

    // Convert pending to match Transaction shape (for table rendering).
    // SuperJSON deserializes Prisma Decimal → number on the client,
    // so using plain numbers here matches the deserialized shape.
    const pendingRows = filtered.map((trx) => ({
      id: `pending-${trx.invoiceNumber}`,
      invoiceNumber: trx.invoiceNumber,
      date: new Date(trx.date),
      totalAmount: trx.totalAmount,
      paymentMethod: trx.paymentMethod as unknown as ServerPaymentMethod,
      paidAmount: trx.paidAmount,
      change: trx.change,
      isSynced: false,
      deletedAt: null,
      items: trx.items.map((item) => ({
        id: `pending-item-${trx.invoiceNumber}-${item.productId}`,
        transactionId: `pending-${trx.invoiceNumber}`,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subTotal: item.subTotal,
        note: item.note ?? null,
      })),
    }));

    const mergedCount = serverCount + filtered.length;
    const mergedPages = Math.ceil(mergedCount / limit);

    // Only prepend pending rows on page 1
    const mergedTrx = page === 1
      ? [...pendingRows, ...serverTrx]
      : serverTrx;

    return {
      transactions: mergedTrx as typeof serverTrx,
      totalCount: mergedCount,
      totalPages: mergedPages,
    };
  }, [data, pending, startDate, endDate, paymentMethod, search, page, limit]);

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
    stablePage: data?.currentPage ?? page,
    // enums re-exported for convenience
    PaymentMethod,
  };
};
