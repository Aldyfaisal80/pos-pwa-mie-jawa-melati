import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string({ message: "Nama produk wajib diisi" })
    .min(1, "Nama tidak boleh kosong")
    .max(100),
  description: z.string().max(255).optional().nullable(),
  price: z
    .number({ message: "Harga wajib diisi" })
    .min(0, "Harga tidak boleh negatif"),
  image: z.string().optional().nullable(),
  categoryId: z.number({ message: "Kategori wajib dipilih" }).int().positive(),
  isAvailable: z.boolean().default(true).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const filterProductSchema = z.object({
  categoryId: z.number().int().positive().optional(),
  search: z.string().optional(),
  onlyAvailable: z.boolean().optional(),
});
