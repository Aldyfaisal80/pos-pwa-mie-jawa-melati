// src/providers/AppProvider.tsx
"use client";

import React, { forwardRef, Suspense, useEffect, useState } from "react";
import { MainLoading } from "../elements";
import { Toaster as Sooner } from "sonner";
import { Providers } from "./providers/Providers";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../fragments/AppSidebar";

type AppProviderProps = React.ComponentProps<"main">;

const SIDEBAR_STATE_KEY = "pos:sidebar-state";

export const AppProvider = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & AppProviderProps
>(({ children, className, ...props }, ref) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    // Always force-close the sidebar on mobile — MobileMenu handles navigation there
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setIsSidebarOpen(false);
      return;
    }
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      setIsSidebarOpen(savedState === "true");
    }
  }, []);

  const handleSidebarChange = (open: boolean) => {
    setIsSidebarOpen(open);
    localStorage.setItem(SIDEBAR_STATE_KEY, String(open));
  };

  return (
    <main
      ref={ref}
      className={cn("flex min-h-dvh flex-col", className)}
      {...props}
    >
      <Providers>
        {!isMounted ? (
          <MainLoading />
        ) : (
          <>
            <Suspense fallback={<MainLoading />}>
              <SidebarProvider
                defaultOpen={isSidebarOpen}
                open={isSidebarOpen}
                onOpenChange={handleSidebarChange}
              >
                <AppSidebar />
                <div className="flex w-full min-w-0 flex-col overflow-hidden">
                  {children}
                </div>
              </SidebarProvider>
            </Suspense>
            <Sooner position="bottom-right" />
          </>
        )}
      </Providers>
    </main>
  );
});

AppProvider.displayName = "AppProvider";
