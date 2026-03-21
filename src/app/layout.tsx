import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { AppProvider } from "@/components/layouts/AppProvider";

export const metadata: Metadata = {
  title: "Mie Jawa POS",
  description: "Aplikasi POS Offline-First",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icon-192x192.svg" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mie Jawa",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#fafaf9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // enables safe-area-inset env() on iOS & Android
};

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable}`}
      suppressHydrationWarning={true}
    >
      <body suppressHydrationWarning={true}>
        <TRPCReactProvider>
          <AppProvider>{children}</AppProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
