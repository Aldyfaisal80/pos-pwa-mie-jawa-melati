import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  icon: LucideIcon;
  iconColorClass: string;
  isLoading: boolean;
  value: React.ReactNode;
  description: React.ReactNode;
  hasOffline?: boolean;
}

export const StatsCard = ({
  title,
  icon: Icon,
  iconColorClass,
  isLoading,
  value,
  description,
  hasOffline,
}: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
          {title}
          {hasOffline && (
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 motion-reduce:animate-none"
              title="Termasuk data offline"
            />
          )}
        </CardTitle>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconColorClass}`}
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
            <div className="text-muted-foreground mt-1 text-xs">
              {description}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
