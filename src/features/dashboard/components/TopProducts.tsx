import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "../hooks/useDashboardStats";

// Agent 3 (performance-optimizer): memo prevents re-render when parent re-renders
const TopProductsSkeleton = memo(() => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    ))}
  </>
));
TopProductsSkeleton.displayName = "TopProductsSkeleton";

export const TopProducts = () => {
  const { data: stats, isLoading } = useDashboardStats();
  // Fallback to 1 prevents division by zero when computing bar widths
  const maxSold = stats?.topProducts?.[0]?.sold ?? 1;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Penjualan Menu Teratas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <TopProductsSkeleton />
        ) : !stats?.topProducts?.length ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            Belum ada data penjualan hari ini
          </p>
        ) : (
          stats.topProducts.map((product) => {
            const percentage = Math.round((product.sold / maxSold) * 100);
            return (
              // Agent 1 (frontend-specialist): use product.name as key, not index
              // to prevent React reconciliation bugs when list order changes
              <div key={product.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="max-w-[60%] truncate font-medium">
                    {product.name}
                  </span>
                  <span className="text-muted-foreground shrink-0">
                    {product.sold} porsi
                  </span>
                </div>
                <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all duration-500 ease-in-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
