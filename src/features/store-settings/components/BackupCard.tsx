"use client";

import { useState } from "react";
import { Database, Download, Clock, AlertTriangle, Check } from "lucide-react";

type ExportStatus = "idle" | "loading" | "success" | "error";

const LAST_BACKUP_KEY = "pos_last_backup";

function getLastBackupLabel(): string | null {
  try {
    const raw = localStorage.getItem(LAST_BACKUP_KEY);
    if (!raw) return null;
    const date = new Date(raw);
    return date.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return null;
  }
}

export function BackupCard() {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [lastBackup, setLastBackup] = useState<string | null>(() =>
    typeof window !== "undefined" ? getLastBackupLabel() : null,
  );

  const handleExport = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/backup/export");

      if (!res.ok) throw new Error("Export gagal");

      // Trigger download dari response
      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition") ?? "";
      const filenameMatch = /filename="(.+)"/.exec(contentDisposition);
      const filename = filenameMatch?.[1] ?? "backup.json";

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      // Simpan timestamp
      const now = new Date().toISOString();
      localStorage.setItem(LAST_BACKUP_KEY, now);
      setLastBackup(getLastBackupLabel());

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="space-y-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
          <Database className="text-primary h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Backup Data</p>
          <p className="text-muted-foreground text-xs">
            Ekspor semua data toko ke file JSON
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-muted/50 rounded-lg border p-3">
        <p className="text-muted-foreground text-xs leading-relaxed">
          File backup berisi <strong>semua kategori, produk, dan transaksi</strong>.
          Simpan di tempat aman (Google Drive, email, dll.) agar bisa di-restore
          jika terjadi masalah.
        </p>
      </div>

      {/* Last backup info */}
      {lastBackup && (
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Backup terakhir: {lastBackup}</span>
        </div>
      )}

      {/* Warning if no backup yet */}
      {!lastBackup && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Belum ada backup. Disarankan backup rutin sebelum ada perubahan besar.
          </p>
        </div>
      )}

      {/* Export button */}
      <button
        id="btn-export-backup"
        onClick={handleExport}
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[hsl(var(--primary))] bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" && (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Mengekspor...
          </>
        )}
        {status === "success" && (
          <>
            <Check className="h-4 w-4" />
            Berhasil Diunduh!
          </>
        )}
        {status === "error" && (
          <>
            <AlertTriangle className="h-4 w-4" />
            Gagal — Coba Lagi
          </>
        )}
        {status === "idle" && (
          <>
            <Download className="h-4 w-4" />
            Ekspor Backup Sekarang
          </>
        )}
      </button>

      {/* GitHub Actions note */}
      <p className="text-muted-foreground text-center text-[11px]">
        🔄 Backup otomatis juga berjalan tiap malam pukul 01:00 WIB via GitHub Actions
      </p>
    </div>
  );
}
