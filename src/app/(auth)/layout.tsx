// src/app/(auth)/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Masuk — Mie Jawa POS",
  description: "Masuk ke sistem kasir Mie Jawa POS",
};

/**
 * Auth layout — clean, no sidebar, no tab bar.
 * Automatically redirects authenticated users to the dashboard.
 */
export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already authenticated → redirect to home
  if (user) {
    redirect("/");
  }

  return <>{children}</>;
}
