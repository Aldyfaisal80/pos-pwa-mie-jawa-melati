"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

interface UseSupabaseUploadReturn {
  uploadImage: (file: File, bucket?: string) => Promise<string | null>;
  isUploading: boolean;
  progress: number;
}

export const useSupabaseUpload = (): UseSupabaseUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (
    file: File,
    bucket = "pos-assets",
  ): Promise<string | null> => {
    try {
      setIsUploading(true);
      setProgress(0);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Format file tidak didukung. Harap upload gambar.");
        return null;
      }

      // Validate file size (e.g. max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 5MB.");
        return null;
      }

      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        toast.error(`Gagal upload gambar: ${error.message}`);
        return null;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      setProgress(100);
      return publicUrl;
    } catch (err: unknown) {
      console.error("Unexpected upload error:", err);
      toast.error("Terjadi kesalahan saat mengunggah gambar.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, progress };
};
