"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";

export const useLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const supabase = useRef(createSupabaseBrowserClient()).current;

  const rawRedirect = searchParams.get("redirect") ?? "/";
  const redirectTo =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) {
        setServerError("Email atau password salah. Silakan coba lagi.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setServerError("Terjadi kesalahan. Silakan coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, onSubmit, serverError };
};
