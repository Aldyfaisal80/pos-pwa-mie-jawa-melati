"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useBluetoothPrinter } from "@/hooks/useBluetoothPrinter";

type PrinterContextValue = ReturnType<typeof useBluetoothPrinter>;

const PrinterContext = createContext<PrinterContextValue | null>(null);

export const PrinterProvider = ({ children }: { children: ReactNode }) => {
  const printer = useBluetoothPrinter();
  return (
    <PrinterContext.Provider value={printer}>
      {children}
    </PrinterContext.Provider>
  );
};

export const usePrinter = (): PrinterContextValue => {
  const ctx = useContext(PrinterContext);
  if (!ctx) throw new Error("usePrinter must be used within <PrinterProvider>");
  return ctx;
};
