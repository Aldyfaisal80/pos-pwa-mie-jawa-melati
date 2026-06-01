export const PERIOD_OPTIONS = [
  { label: "7 Hari Terakhir", days: 7 },
  { label: "14 Hari Terakhir", days: 14 },
  { label: "30 Hari Terakhir", days: 30 },
  { label: "90 Hari Terakhir", days: 90 },
] as const;

export type PeriodDays = (typeof PERIOD_OPTIONS)[number]["days"];
