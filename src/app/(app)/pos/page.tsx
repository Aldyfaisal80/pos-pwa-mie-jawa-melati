import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kasir — Mie Jawa POS",
  description: "Transaksi penjualan, keranjang belanja, dan proses pembayaran.",
  robots: "noindex",
};

export { CashierPage as default } from "@/features/cashier/pages/CashierPage";
