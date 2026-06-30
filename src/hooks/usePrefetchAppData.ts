"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useAuth } from "@/features/auth";
import { navItems } from "@/lib/config/navigation";
import { ReportSortBy, ReportSortOrder } from "@/server/validations";

/**
 * Post-login prefetch: warm all route RSC payloads + tRPC queries.
 * Uses requestIdleCallback to avoid blocking first paint.
 */
export const usePrefetchAppData = () => {
  const router = useRouter();
  const utils = api.useUtils();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const prefetch = () => {
      // Warm tRPC queries (React Query cache) — fire immediately
      void utils.transaction.getDashboardStats.prefetch();
      void utils.transaction.getRevenueChart.prefetch({ days: 7 });
      void utils.product.getAll.prefetch();
      void utils.product.getAll.prefetch({ onlyAvailable: true }); // cashier page
      void utils.category.getAll.prefetch();
      void utils.store.getProfile.prefetch();
      // Report queries with default params (must match ReportPage defaults exactly)
      void utils.transaction.getReportStats.prefetch({});
      void utils.transaction.getReportChart.prefetch({});
      void utils.transaction.getTransactionReport.prefetch({
        search: "",
        limit: 10,
        page: 1,
        sortBy: ReportSortBy.DATE,
        sortOrder: ReportSortOrder.DESC,
      });

      // Warm route RSC payloads (Next.js client cache for instant navigation)
      navItems.forEach((item) => router.prefetch(item.href));
    };

    // Fire immediately — user may go offline before idle callback fires
    prefetch();
  }, [user, utils, router]);
};
