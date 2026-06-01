"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "printer-settings";

export interface PrinterPrefs {
  autoPrint: boolean;
  showLogo: boolean;
  showFooter: boolean;
}

export const DEFAULT_PRINTER_PREFS: PrinterPrefs = {
  autoPrint: true,
  showLogo: true,
  showFooter: true,
};

export const loadPrinterPrefs = (): PrinterPrefs => {
  if (typeof window === "undefined") return DEFAULT_PRINTER_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PrinterPrefs) : DEFAULT_PRINTER_PREFS;
  } catch {
    return DEFAULT_PRINTER_PREFS;
  }
};

export const savePrinterPrefs = (prefs: PrinterPrefs): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};

export const usePrinterPrefs = () => {
  const [prefs, setPrefs] = useState<PrinterPrefs>(DEFAULT_PRINTER_PREFS);

  useEffect(() => {
    setPrefs(loadPrinterPrefs());
  }, []);

  const togglePref = (key: keyof PrinterPrefs) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      savePrinterPrefs(next);
      return next;
    });
  };

  return { prefs, togglePref };
};
