"use client";

import { useState, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export const useAccountProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useRef(createSupabaseBrowserClient()).current;

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    void fetchUser();
  }, [supabase]);

  return { user, loading };
};

export const useUpdateDisplayName = () => {
  const [isPending, setIsPending] = useState(false);
  const supabase = useRef(createSupabaseBrowserClient()).current;

  const mutate = async (displayName: string) => {
    setIsPending(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });
      if (error) throw error;
      toast.success("Nama Berhasil Diubah", {
        description: `Display name diperbarui menjadi "${displayName}".`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memperbarui nama";
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};

export const useChangePassword = () => {
  const [isPending, setIsPending] = useState(false);
  const supabase = useRef(createSupabaseBrowserClient()).current;

  const mutate = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsPending(true);
    try {
      // Verify current password first
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("Email pengguna tidak ditemukan");

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        toast.error("Password saat ini salah", {
          description: "Periksa kembali password yang kamu masukkan.",
        });
        return false;
      }

      // Set new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      toast.success("Password Berhasil Diubah", {
        description: "Gunakan password baru untuk login selanjutnya.",
      });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengubah password";
      toast.error(message);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};
