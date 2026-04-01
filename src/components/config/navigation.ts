import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Settings2,
} from "lucide-react";

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "kasir", label: "Kasir", icon: ShoppingCart, href: "/cashier" },
  { id: "produk", label: "Produk", icon: Package, href: "/product" },
  { id: "laporan", label: "Laporan", icon: BarChart3, href: "/report" },
  {
    id: "pengaturan",
    label: "Pengaturan",
    icon: Settings2,
    href: "/store-settings",
  },
];
