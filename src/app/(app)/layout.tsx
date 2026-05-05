// src/app/(app)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/features/auth";
import { AppProvider } from "@/components/layouts/AppProvider";
import { MainLoading } from "@/components/elements";

/**
 * Protected layout — client-side content guard.
 * Server-side redirect is handled by proxy.ts.
 * If user state becomes null (session expired), redirects to /login.
 */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) return <MainLoading />;

  // Show loading while redirecting (instead of blank page)
  if (!user) return <MainLoading />;

  return <AppProvider>{children}</AppProvider>;
}
