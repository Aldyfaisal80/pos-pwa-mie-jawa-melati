// src/components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { navItems } from "../config/navigation";
import { api } from "@/trpc/react";

export const AppSidebar = () => {
  const pathname = usePathname();

  const { data: store } = api.store.getProfile.useQuery();

  return (
    <ShadcnSidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex h-16 justify-center border-b px-2">
        <div className="flex w-full items-center gap-3">
          {store?.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={store?.name}
              className="h-9 w-auto max-w-30 shrink-0 object-contain drop-shadow-sm"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white shadow-sm">
              <Store className="h-5 w-5" />
            </div>
          )}
          <span className="truncate font-bold tracking-tight group-data-[collapsible=icon]:hidden">
            {store?.name ?? "Memuat..."}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (pathname === undefined && item.id === "dashboard");

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={
                    isActive
                      ? "font-bold text-amber-700 dark:text-amber-400"
                      : "text-muted-foreground font-medium"
                  }
                >
                  <Link href={item.href}>
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <div className="flex items-center gap-3 overflow-hidden rounded-xl p-1">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
            alt="Profil Admin"
            className="border-background h-9 w-9 shrink-0 rounded-full border-2 shadow-sm"
          />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm leading-tight font-bold">Admin</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Administrator
            </p>
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};
