import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan — Mie Jawa POS",
  description: "Konfigurasi toko, printer termal, dan preferensi aplikasi.",
};

export { StoreSettingsPage as default } from "@/features/store-settings/pages/StoreSettingsPage";
