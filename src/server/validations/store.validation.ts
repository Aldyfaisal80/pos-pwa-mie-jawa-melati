import { z } from "zod";

export const updateStoreProfileSchema = z.object({
  name: z.string({ message: "Nama toko wajib diisi" }).min(1).max(100),
  address: z.string().max(255).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
});
