"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { formatRupiah } from "@/lib/format";
import { PERIOD_OPTIONS, type PeriodDays } from "../constants/periodOptions";
import { useRevenueChart } from "../hooks/useRevenueChart";

const ChartTooltipContent = ({
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
};

const ChartSkeleton = ({ bars }: { bars: number }) => (
  <div className="flex h-full items-end gap-1 pb-2">
    {Array.from({ length: bars }).map((_, i) => (
      <Skeleton
        key={i}
        className="flex-1 rounded-t-sm"
        style={{ height: `${40 + (i % 3) * 15}%` }}
      />
    ))}
  </div>
);

export const RevenueChart = () => {
  const [selectedDays, setSelectedDays] = useState<PeriodDays>(7);
  const { data: chartData, isLoading } = useRevenueChart(selectedDays);

  const skeletonBars = selectedDays > 14 ? 10 : selectedDays;

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">
            Pendapatan {selectedDays} Hari Terakhir
          </CardTitle>
          <Select
            value={String(selectedDays)}
            onValueChange={(v) => setSelectedDays(Number(v) as PeriodDays)}
          >
            <SelectTrigger size="sm" className="w-40">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((opt) => (
                <SelectItem key={opt.days} value={String(opt.days)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          {isLoading ? (
            <ChartSkeleton bars={skeletonBars} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData ?? []}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={selectedDays > 14 ? 10 : 12}
                  tickLine={false}
                  axisLine={false}
                  interval={selectedDays > 14 ? 4 : 0}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `Rp ${v / 1000}k`}
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
