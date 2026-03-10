"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useTransactionReport } from "../hooks/useTransactionReport";
import { TransactionTable } from "../components/TransactionTable";
import { exportToCSV } from "../utils/report.utils";
import { useLiveStats } from "@/features/dashboard/hooks/useLiveStats";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ReportPage = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Mengaktifkan sinkronisasi real-time hibrida (PWA Tab + PC Lain)
  useLiveStats();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useTransactionReport(
    startDate,
    endDate,
    search,
    undefined,
    limit,
    page,
  );

  const transactions = data?.transactions ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.currentPage ?? 1;
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Reset pagination when search/filter changes
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
    setter(value);
    setPage(1);
  };

  const handleExport = () => {
    if (!transactions.length) {
      toast.error("Tidak ada data untuk diekspor.");
      return;
    }
    exportToCSV(transactions);
    toast.success("Export Berhasil", {
      description: "File laporan.csv berhasil diunduh.",
    });
  };

  return (
    <PageContainer title="Laporan Pendapatan" withHeader>
      <SectionContainer padded>
        {/* Header Aksi */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-foreground text-lg font-bold md:text-xl">
            Riwayat Transaksi
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              size="sm"
              className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {/* Cari invoice */}
          <div className="relative min-w-50 flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              className="pl-9"
              placeholder="Cari no. nota..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
            />
          </div>

          {/* Limit / Items per page */}
          <div className="relative min-w-25">
            <Select
              value={limit.toString()}
              onValueChange={(val) => {
                setLimit(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-30">
                <SelectValue placeholder="Baris" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 baris</SelectItem>
                <SelectItem value="25">25 baris</SelectItem>
                <SelectItem value="50">50 baris</SelectItem>
                <SelectItem value="100">100 baris</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tanggal mulai */}
          <div className="relative">
            <Calendar className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="date"
              className="w-full pl-9 sm:w-40"
              onChange={(e) =>
                setStartDate(
                  e.target.value ? new Date(e.target.value) : undefined,
                )
              }
            />
          </div>

          {/* Tanggal akhir */}
          <div className="relative">
            <Calendar className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="date"
              className="w-full pl-9 sm:w-40"
              onChange={(e) =>
                handleFilterChange(
                  setEndDate,
                  e.target.value ? new Date(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>

        {/* Tabel */}
        <Card className="border-border overflow-hidden border shadow-sm relative">
          <TransactionTable transactions={transactions} isLoading={isLoading || isFetching} />

          {/* Footer info & Pagination Commands */}
          <div className="bg-muted/50 border-t px-4 py-3 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <span className="text-muted-foreground text-xs">
              Menampilkan {transactions.length} transaksi{" "}
              {totalCount > 0 && `dari total ${totalCount} transaksi`}
            </span>

            {totalPages > 1 && (
              <div className="flex gap-1 items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading || isFetching}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1 mx-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    // Tampilkan maksimal 5 tombol halaman berdekatan
                    if (
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8 text-xs"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isLoading || isFetching}
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="text-xs text-muted-foreground px-1">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading || isFetching}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
};
