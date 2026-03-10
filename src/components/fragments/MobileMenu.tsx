// src/components/layout/MobileMenu.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Menu } from "lucide-react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { navItems } from "../config/navigation";

export const MobileMenu = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: store } = api.store.getProfile.useQuery();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle className="flex items-center gap-3">
            {(store as any)?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={(store as any).logoUrl}
                alt={store?.name || "Logo"}
                className="h-8 w-auto max-w-24 shrink-0 object-contain drop-shadow-sm"
              />
            ) : (
              <Store className="h-6 w-6 shrink-0 text-amber-600" />
            )}
            <span className="truncate">{store?.name || "Mie Jawa"}</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.id}
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive
                      ? "font-bold text-amber-700 dark:text-amber-400"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
