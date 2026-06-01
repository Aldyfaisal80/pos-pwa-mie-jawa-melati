// src/app/(auth)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — Mie Jawa POS",
  description: "Masuk ke sistem kasir Mie Jawa POS",
};

/**
 * Auth layout — clean, no sidebar, no tab bar.
 * Middleware handles redirecting authenticated users away from /login.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
