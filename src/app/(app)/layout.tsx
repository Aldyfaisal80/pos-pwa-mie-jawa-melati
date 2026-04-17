// src/app/(app)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { AppProvider } from "@/components/layouts/AppProvider";
import { MainLoading } from "@/components/elements";

/**
 * Protected layout — runs client-side auth guard as defense-in-depth.
 * The server-side gate is in middleware.ts. This is the second line of defense.
 */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Show loading while validating session
  if (loading) return <MainLoading />;

  // Return null while redirecting (middleware already handles the redirect)
  if (!user) return null;

  return <AppProvider>{children}</AppProvider>;
}
