// src/features/auth/pages/LoginPage.tsx
import { Suspense } from "react";
import { Store } from "lucide-react";
import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center px-4">
      {/* Card */}
      <div className="border-border bg-card w-full max-w-sm rounded-2xl border p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600 shadow-md">
            <Store className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Mie Jawa POS</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Masuk untuk melanjutkan
            </p>
          </div>
        </div>

        {/* Form */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>

      {/* Footer */}
      <p className="text-muted-foreground mt-6 text-center text-xs">
        &copy; {new Date().getFullYear()} Mie Jawa POS. All rights reserved.
      </p>
    </div>
  );
};
