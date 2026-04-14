import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan — Mie Jawa POS",
  description: "Riwayat transaksi penjualan, filter laporan, dan ekspor CSV.",
};

export { ReportPage as default } from "@/features/report/pages/ReportPage";
