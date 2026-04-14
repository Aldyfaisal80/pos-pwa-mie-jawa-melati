"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Package,
  BarChart3,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  variant?: "primary" | "secondary";
}

const ActionCard = ({
  href,
  icon: Icon,
  label,
  description,
  variant = "secondary",
}: ActionCardProps) => {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={cn(
        "group flex cursor-pointer items-center gap-4 rounded-2xl p-4 transition-all duration-200",
        "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isPrimary
          ? [
              // Primary CTA: uses theme --primary token — adapts to all themes automatically
              "bg-primary text-primary-foreground",
              "shadow-lg hover:shadow-xl hover:opacity-90 hover:-translate-y-0.5",
              "active:translate-y-0",
            ]
          : [
              "bg-card border-border border hover:bg-accent hover:text-accent-foreground",
              "shadow-sm hover:shadow-md hover:-translate-y-0.5",
              "active:translate-y-0",
            ],
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
          isPrimary
            ? "bg-white/20 text-primary-foreground"
            : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-semibold",
            isPrimary ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "mt-0.5 truncate text-xs",
            isPrimary ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      </div>

      {/* Chevron */}
      <ChevronRight
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1",
          isPrimary ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      />
    </Link>
  );
};

const QUICK_ACTIONS: ActionCardProps[] = [
  {
    href: "/pos",
    icon: ShoppingCart,
    label: "Mulai Kasir",
    description: "Kelola transaksi & pembayaran",
    variant: "primary",
  },
  {
    href: "/products",
    icon: Package,
    label: "Kelola Produk",
    description: "Tambah atau ubah menu",
    variant: "secondary",
  },
  {
    href: "/reports",
    icon: BarChart3,
    label: "Lihat Laporan",
    description: "Riwayat & analitik penjualan",
    variant: "secondary",
  },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "Statistik lengkap & grafik",
    variant: "secondary",
  },
];

export const QuickActionGrid = () => (
  <div className="flex flex-col gap-3">
    {QUICK_ACTIONS.map((action) => (
      <ActionCard key={action.href} {...action} />
    ))}
  </div>
);
