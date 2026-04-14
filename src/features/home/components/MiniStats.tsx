"use client";

import { Wallet, Receipt, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/lib/format";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";

const StatSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-7 w-32" />
      <Skeleton className="mt-2 h-3 w-20" />
    </CardContent>
  </Card>
);

export const MiniStats = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* Omzet — uses theme primary color */}
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-xs font-medium sm:text-sm">
            Omzet Hari Ini
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wallet className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold sm:text-2xl">
            {formatRupiah(stats?.totalOmzet ?? 0)}
          </p>
          <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            <TrendingUp className="h-3 w-3 text-primary" />
            Data real dari server
          </p>
        </CardContent>
      </Card>

      {/* Transaksi — uses theme secondary/accent */}
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-muted-foreground text-xs font-medium sm:text-sm">
            Total Transaksi
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Receipt className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold sm:text-2xl">
            {stats?.totalTransactions ?? 0}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">Transaksi hari ini</p>
        </CardContent>
      </Card>
    </div>
  );
};
