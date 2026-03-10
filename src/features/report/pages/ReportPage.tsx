"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { useTransactionReport } from "../hooks/useTransactionReport";
import { TransactionTable } from "../components/TransactionTable";
import { exportToCSV } from "../utils/report.utils";
import { useLiveStats } from "@/features/dashboard/hooks/useLiveStats";

export const ReportPage = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Mengaktifkan sinkronisasi real-time hibrida (PWA Tab + PC Lain)
  useLiveStats();

  const { data: transactions, isLoading } = useTransactionReport(
    startDate,
    endDate,
    search,
  );

  const handleExport = () => {
    if (!transactions?.length) {
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
              onChange={(e) => setSearch(e.target.value)}
            />
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
                setEndDate(
                  e.target.value ? new Date(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>

        {/* Tabel */}
        <Card className="border-border overflow-hidden border shadow-sm">
          <TransactionTable transactions={transactions} isLoading={isLoading} />

          {/* Footer info */}
          {!isLoading && !!transactions?.length && (
            <div className="bg-muted/50 border-t px-4 py-3">
              <span className="text-muted-foreground text-xs">
                Menampilkan {transactions.length} transaksi
              </span>
            </div>
          )}
        </Card>
      </SectionContainer>
    </PageContainer>
  );
};
