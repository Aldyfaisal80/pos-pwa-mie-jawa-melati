import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk — Mie Jawa POS",
  description: "Kelola daftar produk, kategori, harga, dan stok toko.",
};

export { ProductPage as default } from "@/features/product/pages/ProductPage";
