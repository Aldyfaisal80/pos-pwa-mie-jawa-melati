import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk wajib diisi")
    .max(100, "Maksimal 100 karakter"),
  description: z.string().max(255, "Maksimal 255 karakter").optional(),
  // e.target.valueAsNumber passes number directly — no coerce needed
  price: z.number().min(1, "Harga wajib diisi"),
  // Select returns string — converted to number in onSubmit
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  image: z.string().optional().nullable(),
  isAvailable: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
