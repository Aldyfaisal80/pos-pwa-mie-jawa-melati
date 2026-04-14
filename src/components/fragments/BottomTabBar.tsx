"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/config/navigation";

export const BottomTabBar = () => {
  const pathname = usePathname();

  return (
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
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (pathname === undefined && item.id === "dashboard");

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
                ? "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={cn(
                "relative flex h-8 w-12 items-center justify-center rounded-full",
                "transition-all duration-200 ease-out",
                isActive
                  ? "bg-amber-100 dark:bg-amber-900/30"
                  : "bg-transparent",
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
    </nav>
  );
};
