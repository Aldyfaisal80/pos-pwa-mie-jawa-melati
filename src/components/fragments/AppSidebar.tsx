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

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useState } from "react";
import { UserCog, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountProfileForm } from "@/features/store-settings/components/AccountProfileForm";

export const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl p-1 hover:bg-muted/50 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:overflow-visible group-data-[collapsible=icon]:rounded-lg">
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
                <MoreVertical className="h-4 w-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={8}>
               <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="cursor-pointer">
                 <UserCog className="mr-2 h-4 w-4" />
                 <span>Edit Profil</span>
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                 <LogOut className="mr-2 h-4 w-4" />
                 <span>Keluar</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-106.25 md:max-w-150">
            <DialogHeader>
              <DialogTitle>Profil Akun</DialogTitle>
              <DialogDescription>
                Kelola informasi kredensial akun kasir Anda.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto px-1 py-2">
              <AccountProfileForm />
            </div>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};
