import React from "react";
import { Loader2 } from "lucide-react";

export const MainLoading = () => {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-medium">Memuat Aplikasi</h3>
          <p className="text-muted-foreground text-sm">
            Silakan tunggu sebentar
          </p>
        </div>
      </div>
    </div>
  );
};
