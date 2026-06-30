"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { formatRupiah, formatRupiahShort } from "@/lib/format";
import type { PaymentMethod } from "@/server/validations";
import { useOfflineAwareReportChart } from "../../hooks/useOfflineAwareReportChart";

interface ReportChartProps {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod | "ALL";
}

const ChartTooltipContent = memo(
  ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (!active || !payload?.length || !payload[0]) return null;
    return (
      <div className="border-border bg-background rounded-lg border p-3 shadow-md">
        <p className="text-foreground mb-1 text-sm font-medium">{label}</p>
        <p className="text-primary text-sm font-bold">
          {formatRupiah(payload[0].value)}
        </p>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ReportChartTooltipContent";

const ChartSkeleton = memo(() => (
  <div className="flex h-full items-end gap-1 pb-2">
    {Array.from({ length: 10 }).map((_, i) => (
      <Skeleton
        key={i}
        className="flex-1 rounded-t-sm"
        style={{ height: `${40 + (i % 3) * 20}%` }}
      />
    ))}
  </div>
));
ChartSkeleton.displayName = "ReportChartSkeleton";

export const ReportChart = ({
  startDate,
  endDate,
  paymentMethod,
}: ReportChartProps) => {
  const { data: chartData, isLoading } = useOfflineAwareReportChart({
    startDate,
    endDate,
    paymentMethod,
  });

  const hasData = chartData && chartData.length > 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Tren Pendapatan Harian
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full">
          {isLoading ? (
            <ChartSkeleton />
          ) : !hasData ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Belum ada data untuk periode ini
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatRupiahShort}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
