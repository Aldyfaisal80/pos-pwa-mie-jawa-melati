import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda — Mie Jawa Melati POS",
  description: "Akses cepat ke kasir, produk, laporan, dan statistik penjualan hari ini.",
};

export { HomePage as default } from "@/features/home/pages/HomePage";
