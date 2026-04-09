import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { PrinterProvider } from "@/components/layouts/providers/PrinterProvider";
import { AuthProvider } from "@/components/layouts/providers/AuthProvider";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PrinterProvider>{children}</PrinterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
