"use client";

import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Wallet, Receipt, Star, TrendingUp, BarChart2, CloudUpload } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { StatsCard } from "../components/StatsCard";
import { RevenueChart } from "../components/RevenueChart";
import { TopProducts } from "../components/TopProducts";
import { useOfflineAwareDashboardStats } from "../hooks/useOfflineAwareDashboardStats";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { Button } from "@/components/ui/button";

export const DashboardPage = () => {
  const { data: stats, isLoading, pendingCount } = useOfflineAwareDashboardStats();
  const isOnline = useNetworkStatus();
  const { syncNow, isSyncing } = useOfflineSync();
  const topProduct = stats?.topProducts?.[0];

  // Extracted to keep StatsCard usage readable (avoids nested JSX in props)
  const topProductValue = (
    <span className="block truncate text-xl">
      {topProduct?.name ?? "-"}
    </span>
  );
  const topProductDescription = topProduct
    ? `Terjual ${topProduct.sold} porsi hari ini`
    : "Belum ada transaksi hari ini";

  return (
    <PageContainer title="Dashboard" withHeader>
      <SectionContainer padded>
        <div className="flex flex-col space-y-6">
          {/* ── Pending Offline Indicator ── */}
          {pendingCount > 0 && (
            <div className="flex animate-in fade-in slide-in-from-top-2 duration-300 items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-900/20 motion-reduce:animate-none">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                <CloudUpload className="h-4 w-4 motion-reduce:animate-none" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  {pendingCount} transaksi offline menunggu sinkronisasi
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                  Data dashboard sudah termasuk transaksi offline.
                </p>
              </div>
              {isOnline && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={syncNow}
                  disabled={isSyncing}
                  className="shrink-0 border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50"
                >
                  {isSyncing ? "Menyinkronkan..." : "Sync Sekarang"}
                </Button>
              )}
            </div>
          )}

          {/* ── Kartu Statistik Harian ── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatsCard
              title="Omzet Hari Ini"
              icon={Wallet}
              iconColorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
              isLoading={isLoading}
              value={formatRupiah(stats?.totalOmzet ?? 0)}
              description={
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  {pendingCount > 0 ? "Termasuk data offline" : "Data real dari server"}
                </span>
              }
              hasOffline={pendingCount > 0}
            />
            <StatsCard
              title="Total Transaksi"
              icon={Receipt}
              iconColorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              isLoading={isLoading}
              value={stats?.totalTransactions ?? 0}
              description={pendingCount > 0 ? `Termasuk ${pendingCount} offline` : "Transaksi hari ini"}
              hasOffline={pendingCount > 0}
            />
            <StatsCard
              title="Rata-rata/Transaksi"
              icon={BarChart2}
              iconColorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              isLoading={isLoading}
              value={formatRupiah(stats?.avgPerTransaction ?? 0)}
              description={pendingCount > 0 ? "Termasuk data offline" : "Per transaksi"}
              hasOffline={pendingCount > 0}
            />
            <StatsCard
              title="Menu Terlaris"
              icon={Star}
              iconColorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
              isLoading={isLoading}
              value={topProductValue}
              description={topProductDescription}
              hasOffline={pendingCount > 0}
            />
          </div>

          {/* ── Grafik Pendapatan + Produk Teratas ── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <RevenueChart />
            <TopProducts />
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};
