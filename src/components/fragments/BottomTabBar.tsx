"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/config/navigation";
import {
  CircleUserRound,
  LogOut,
  Settings2,
  UserCog,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/features/auth";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AccountProfileForm } from "@/features/store-settings/components/AccountProfileForm";

export const BottomTabBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState<"menu" | "edit-profile">("menu");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => setActiveView("menu"), 300);
    }
  };

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const mainNavItems = navItems.slice(0, 4);

  return (
    <>
      {/* ─── Bottom Navigation Bar ─── */}
      <nav
        className={cn(
          "lg:hidden",
          "fixed right-0 bottom-0 left-0 z-50",
          "bg-background/95 backdrop-blur-md",
          "border-border/60 border-t",
          "flex items-stretch",
          "pb-[env(safe-area-inset-bottom,0px)]",
          "shadow-[0_-1px_12px_0_rgb(0,0,0,0.06)]",
        )}
        aria-label="Navigasi Utama"
      >
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (pathname?.startsWith(item.href) && item.href !== "/");

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5",
                "min-h-14 px-1 py-2",
                "transition-all duration-200 ease-out",
                "active:scale-95",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "relative flex h-8 w-12 items-center justify-center rounded-full",
                  "transition-all duration-200 ease-out",
                  isActive ? "bg-primary/15" : "bg-transparent",
                )}
              >
                <Icon
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "h-5 w-5 scale-110" : "h-5 w-5 scale-100",
                  )}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
              </span>
              <span
                className={cn(
                  "text-[10px] leading-none font-medium tracking-wide",
                  "transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-70",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* ─── Account Tab Drawer Trigger ─── */}
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerTrigger asChild>
            <button
              type="button"
              id="mobile-account-tab"
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5",
                "min-h-14 px-1 py-2",
                "transition-all duration-200 ease-out",
                "active:scale-95",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                "text-muted-foreground hover:text-foreground",
              )}
              aria-label="Buka menu akun"
            >
              <span
                className={cn(
                  "relative flex h-8 w-12 items-center justify-center rounded-full",
                  "transition-all duration-200 ease-out bg-transparent",
                )}
              >
                <CircleUserRound
                  className="h-5 w-5 scale-100 transition-all duration-200"
                  strokeWidth={1.75}
                />
              </span>
              <span
                className={cn(
                  "text-[10px] leading-none font-medium tracking-wide",
                  "opacity-70 transition-all duration-200",
                )}
              >
                Akun
              </span>
            </button>
          </DrawerTrigger>

          <DrawerContent className="lg:hidden">
            {activeView === "menu" ? (
              <div className="flex flex-col pb-6">
                <DrawerHeader className="border-b border-border/60 text-left">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm">
                      <span className="text-primary-foreground text-lg font-bold">
                        {(user?.email ?? "A")[0]!.toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <DrawerTitle className="truncate text-base font-bold">
                        {user?.email ?? "—"}
                      </DrawerTitle>
                      <DrawerDescription className="text-sm">
                        Administrator
                      </DrawerDescription>
                    </div>
                  </div>
                </DrawerHeader>

                <div className="px-2 py-4 space-y-1">
                  <button
                    onClick={() => setActiveView("edit-profile")}
                    id="mobile-sheet-edit-profile"
                    className="hover:bg-muted/60 flex w-full items-center gap-3 rounded-lg px-4 py-3.5 transition-colors"
                  >
                    <span className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]">
                      <UserCog className="text-muted-foreground h-4 w-4" />
                    </span>
                    <span className="text-foreground text-sm font-medium">
                      Edit Profil
                    </span>
                  </button>

                  <Link
                    href="/settings"
                    id="mobile-sheet-store-settings"
                    onClick={() => setOpen(false)}
                    className="hover:bg-muted/60 flex items-center gap-3 rounded-lg px-4 py-3.5 transition-colors"
                  >
                    <span className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]">
                      <Settings2 className="text-muted-foreground h-4 w-4" />
                    </span>
                    <span className="text-foreground text-sm font-medium">
                      Pengaturan Toko
                    </span>
                  </Link>

                  <button
                    type="button"
                    id="mobile-sheet-logout"
                    onClick={handleLogout}
                    className="hover:bg-destructive/8 text-destructive flex w-full items-center gap-3 rounded-lg px-4 py-3.5 transition-colors"
                  >
                    <span className="bg-destructive/8 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]">
                      <LogOut className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">
                      Keluar
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[85vh]">
                <DrawerHeader className="border-b border-border/60 flex flex-col items-start gap-1 justify-center shrink-0">
                  <button 
                    onClick={() => setActiveView("menu")}
                    className="flex text-muted-foreground hover:text-foreground items-center gap-1 -ml-2 mb-2 p-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Kembali</span>
                  </button>
                  <DrawerTitle className="text-left w-full">Profil Akun</DrawerTitle>
                  <DrawerDescription className="text-left">
                    Kelola informasi kredensial akun kasir Anda.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="overflow-y-auto px-4 py-6 flex-1 bg-muted/10">
                  <AccountProfileForm />
                </div>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </nav>
    </>
  );
};
