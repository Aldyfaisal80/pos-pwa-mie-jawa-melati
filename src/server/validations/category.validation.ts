import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({ message: "Nama kategori wajib diisi" })
    .min(1, "Nama kategori minimal 1 karakter")
    .max(50),
});

export const updateCategorySchema = createCategorySchema.partial();
