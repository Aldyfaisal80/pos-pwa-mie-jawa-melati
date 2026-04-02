import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { PrinterProvider } from "@/components/layouts/providers/PrinterProvider";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <PrinterProvider>{children}</PrinterProvider>
    </ThemeProvider>
  );
};
