import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "../hooks/useDashboardStats";

const TopProductsSkeleton = () => (
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
);

export const TopProducts = () => {
  const { data: stats, isLoading } = useDashboardStats();
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
          stats.topProducts.map((product, index) => {
            const percentage = Math.round((product.sold / maxSold) * 100);
            return (
              <div key={index} className="space-y-2">
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
