"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

const getGreeting = (hour: number): string => {
  if (hour >= 5 && hour < 12) return "Selamat Pagi";
  if (hour >= 12 && hour < 15) return "Selamat Siang";
  if (hour >= 15 && hour < 19) return "Selamat Sore";
  return "Selamat Malam";
};

const formatDatetime = (date: Date): string => {
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const day = dayNames[date.getDay()];
  const dateNum = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}, ${dateNum} ${month} ${year} · ${hours}:${minutes} WIB`;
};

export const GreetingBanner = () => {
  const [now, setNow] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const { data: store } = api.store.getProfile.useQuery();

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const greeting = getGreeting(now.getHours());
  const storeName = store?.name ?? "Toko Anda";

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg sm:p-6"
      // theme-adaptive gradient: uses CSS vars so it works across light/dark/all themes
      style={{
        background:
          "linear-gradient(135deg, var(--primary), var(--chart-2, var(--primary)))",
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-6 right-16 h-24 w-24 rounded-full bg-white/10 blur-xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/80">{greeting},</p>
          <h1 className="mt-0.5 truncate text-xl font-bold tracking-tight sm:text-2xl">
            {storeName}
          </h1>
          <p className="mt-1 text-xs text-white/70 sm:text-sm">
            {formatDatetime(now)}
          </p>
        </div>

        <span
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            "transition-colors duration-300",
            isOnline
              ? "bg-white/20 text-white"
              : "bg-black/20 text-white/80",
          )}
        >
          {isOnline ? (
            <Wifi className="h-3 w-3" strokeWidth={2.5} />
          ) : (
            <WifiOff className="h-3 w-3" strokeWidth={2.5} />
          )}
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};
