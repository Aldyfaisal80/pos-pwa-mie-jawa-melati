"use client";

import { DollarSign, Receipt, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/lib/format";
import type { PaymentMethod } from "@/server/validations";
import { useReportStats } from "../hooks/useReportStats";

interface ReportStatsCardsProps {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod | "ALL";
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconClass: string;
  isLoading: boolean;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  isLoading,
}: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-muted-foreground text-sm font-medium">
        {title}
      </CardTitle>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="mt-2 h-4 w-28" />
        </>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-muted-foreground mt-1 text-xs">{description}</div>
        </>
      )}
    </CardContent>
  </Card>
);

export const ReportStatsCards = ({
  startDate,
  endDate,
  paymentMethod,
}: ReportStatsCardsProps) => {
  const { data, isLoading } = useReportStats({ startDate, endDate, paymentMethod });

  const hasDateFilter = !!startDate || !!endDate;
  const periodLabel = hasDateFilter ? "Periode terpilih" : "Semua waktu";

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Total Pendapatan"
        value={formatRupiah(data?.totalOmzet ?? 0)}
        description={periodLabel}
        icon={DollarSign}
        iconClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        isLoading={isLoading}
      />
      <StatCard
        title="Jumlah Transaksi"
        value={String(data?.totalTransactions ?? 0)}
        description={`${data?.totalTransactions ?? 0} nota`}
        icon={Receipt}
        iconClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        isLoading={isLoading}
      />
      <StatCard
        title="Rata-rata / Transaksi"
        value={formatRupiah(data?.avgPerTransaction ?? 0)}
        description="Per nota"
        icon={TrendingUp}
        iconClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        isLoading={isLoading}
      />
    </div>
  );
};
