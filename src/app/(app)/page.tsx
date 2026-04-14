import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Mie Jawa POS",
  description: "Pantau ringkasan penjualan hari ini, stok terendah, dan performa toko.",
};

export { DashboardPage as default } from "@/features/dashboard/pages/DashboardPage";
