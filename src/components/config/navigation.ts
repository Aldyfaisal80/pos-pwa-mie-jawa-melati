import { LayoutGrid, Home, Box, FileText, Settings } from "lucide-react";

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, href: "/" },
  { id: "kasir", label: "Kasir", icon: Home, href: "/cashier" },
  { id: "produk", label: "Produk", icon: Box, href: "/product" },
  { id: "laporan", label: "Laporan", icon: FileText, href: "/report" },
  {
    id: "pengaturan",
    label: "Pengaturan Toko",
    icon: Settings,
    href: "/store-settings",
  },
];
