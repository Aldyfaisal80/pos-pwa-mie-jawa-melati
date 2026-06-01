import { z } from "zod";

export const displayNameSchema = z.object({
  displayName: z
    .string()
    .min(2, "Minimal 2 karakter")
    .max(50, "Maksimal 50 karakter"),
});

export type DisplayNameFormValues = z.infer<typeof displayNameSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z
      .string()
      .min(8, "Password baru minimal 8 karakter")
      .max(72, "Maksimal 72 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
