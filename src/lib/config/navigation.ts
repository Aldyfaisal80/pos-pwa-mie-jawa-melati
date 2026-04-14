import {
  Home,
  ShoppingCart,
  Package,
  BarChart3,
  Settings2,
} from "lucide-react";

export const navItems = [
  { id: "home", label: "Beranda", icon: Home, href: "/" },
  { id: "kasir", label: "Kasir", icon: ShoppingCart, href: "/pos" },
  { id: "produk", label: "Produk", icon: Package, href: "/products" },
  { id: "laporan", label: "Laporan", icon: BarChart3, href: "/reports" },
  { id: "pengaturan", label: "Pengaturan", icon: Settings2, href: "/settings" },
];
