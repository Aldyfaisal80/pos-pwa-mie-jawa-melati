// src/components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Store } from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { navItems } from "@/lib/config/navigation";
import { api } from "@/trpc/react";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const { data: store } = api.store.getProfile.useQuery();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };


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
            <div className="bg-primary text-primary-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm">
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
              (pathname === undefined && item.id === "home");

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={
                    isActive
                      ? "text-primary font-bold"
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
          <Avatar className="border-background h-9 w-9 shrink-0 border-2 shadow-sm">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {(user?.email ?? "A")[0]!.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm leading-tight font-bold">
              {user?.email ?? "Admin"}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">Administrator</p>
          </div>
          <Button
            id="sidebar-logout"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0 group-data-[collapsible=icon]:hidden"
            onClick={handleLogout}
            title="Keluar"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};
