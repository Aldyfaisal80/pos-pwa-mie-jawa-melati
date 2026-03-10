import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { errorFilter } from "@/server/filters/error.filter";
import { TRPCError } from "@trpc/server";
import { createCategorySchema } from "@/server/validations";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.category.findMany({ orderBy: { id: "asc" } });
    } catch (error) {
      errorFilter(error);
    }
  }),

  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.category.create({ data: { name: input.name } });
      } catch (error) {
        errorFilter(error);
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Validasi Manual: Cek apakah kategori dipakai
        const productCount = await ctx.db.product.count({
          where: { categoryId: input.id },
        });

        if (productCount > 0) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: `Gagal Hapus: Kategori ini masih memiliki ${productCount} produk aktif.`,
          });
        }

        return await ctx.db.category.delete({ where: { id: input.id } });
      } catch (error) {
        errorFilter(error);
      }
    }),
});
