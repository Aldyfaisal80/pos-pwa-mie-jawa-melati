import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { PrinterProvider } from "@/components/layouts/providers/PrinterProvider";
import { AuthProvider } from "@/features/auth";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PrinterProvider>{children}</PrinterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
