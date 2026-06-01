import { z } from "zod";

export const storeSettingsSchema = z.object({
  name: z
    .string()
    .min(1, "Nama toko wajib diisi")
    .max(100, "Maksimal 100 karakter"),
  address: z.string().max(255, "Maksimal 255 karakter").optional().nullable(),
  phone: z.string().max(20, "Maksimal 20 karakter").optional().nullable(),
  // Empty string is allowed (treated as no logo); non-empty must be a valid URL
  logoUrl: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      { message: "URL tidak valid" },
    ),
});
