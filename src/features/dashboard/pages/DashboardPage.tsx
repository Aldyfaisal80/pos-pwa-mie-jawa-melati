"use client";

import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Wallet, Receipt, Star, TrendingUp } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { StatsCard } from "../components/StatsCard";
import { RevenueChart } from "../components/RevenueChart";
import { TopProducts } from "../components/TopProducts";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useLiveStats } from "../hooks/useLiveStats";

export const DashboardPage = () => {
  // Activate Supabase Realtime listener for live stat updates
  useLiveStats();

  const { data: stats, isLoading } = useDashboardStats();
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
          {/* ── Kartu Statistik Harian ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Omzet Hari Ini"
              icon={Wallet}
              iconColorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
              isLoading={isLoading}
              value={formatRupiah(stats?.totalOmzet ?? 0)}
              description={
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  Data real dari server
                </span>
              }
            />
            <StatsCard
              title="Total Transaksi"
              icon={Receipt}
              iconColorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              isLoading={isLoading}
              value={stats?.totalTransactions ?? 0}
              description="Transaksi hari ini"
            />
            <StatsCard
              title="Menu Terlaris"
              icon={Star}
              iconColorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
              isLoading={isLoading}
              value={topProductValue}
              description={topProductDescription}
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
