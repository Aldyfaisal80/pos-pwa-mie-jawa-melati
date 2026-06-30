import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PosLoading() {
  return (
    <div className="flex h-full gap-4 p-4">
      {/* Product catalog skeleton */}
      <div className="flex-1 space-y-3">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <Skeleton className="h-16 w-full rounded" />
                <Skeleton className="mt-2 h-3 w-20" />
                <Skeleton className="mt-1 h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Cart panel skeleton */}
      <Card className="hidden w-80 shrink-0 lg:block">
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
