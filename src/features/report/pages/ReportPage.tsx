"use client";

import { Download } from "lucide-react";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReportFilters } from "../hooks/useReportFilters";
import { TransactionTable } from "../components/TransactionTable";
import { ReportFilterBar } from "../components/ReportFilterBar";
import { ReportPagination } from "../components/ReportPagination";
import { ReportStatsCards } from "../components/ReportStatsCards";
import { useLiveStats } from "@/features/dashboard/hooks/useLiveStats";

export const ReportPage = () => {
  useLiveStats();

  const {
    search,
    startDate,
    endDate,
    paymentMethod,
    sortBy,
    sortOrder,
    limit,
    page,
    setSearch,
    setStartDate,
    setEndDate,
    setPaymentMethod,
    setLimit,
    handleSortChange,
    handlePageChange,
    handleExport,
    transactions,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    isExporting,
    stablePage,
  } = useReportFilters();

  const startItem = (stablePage - 1) * limit + 1;
  const paginationLabel = totalCount > 0
    ? `Menampilkan ${startItem}–${startItem + transactions.length - 1} dari ${totalCount} transaksi`
    : "Tidak ada transaksi";

  return (
    <PageContainer title="Laporan Pendapatan" withHeader>
      <SectionContainer padded>
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-foreground text-lg font-bold md:text-xl">
            Laporan Penjualan
          </h2>
          <Button
            onClick={handleExport}
            size="sm"
            disabled={isExporting || isFetching || isLoading}
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">
              {isExporting ? "Mengekspor..." : "Export CSV"}
            </span>
          </Button>
        </div>

        {/* Filter */}
        <ReportFilterBar
          search={search}
          limit={limit}
          paymentMethod={paymentMethod}
          onSearchChange={setSearch}
          onLimitChange={setLimit}
          onPaymentMethodChange={setPaymentMethod}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {/* Summary Cards */}
        <ReportStatsCards
          startDate={startDate}
          endDate={endDate}
          paymentMethod={paymentMethod}
        />

        {/* Tabel + Footer */}
        <Card className="border-border relative overflow-hidden border shadow-sm">
          <TransactionTable
            transactions={transactions}
            isLoading={isLoading}
            sortColumn={sortBy}
            sortOrder={sortOrder}
            onSort={handleSortChange}
          />

          <div className="bg-muted/50 flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
            <span className="text-muted-foreground text-xs">{paginationLabel}</span>
            <ReportPagination
              currentPage={page}
              totalPages={totalPages}
              isLoading={isLoading}
              isFetching={isFetching}
              onPageChange={handlePageChange}
            />
          </div>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
};
