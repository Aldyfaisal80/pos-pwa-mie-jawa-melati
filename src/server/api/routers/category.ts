import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { errorFilter } from "@/server/filters/error.filter";
import { TRPCError } from "@trpc/server";
import { createCategorySchema } from "@/server/validations";

const ARCHIVED_CATEGORY_NAME = "Arsip Produk";

export const categoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.category.findMany({ orderBy: { id: "asc" } });
    } catch (error) {
      errorFilter(error);
    }
  }),

  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.category.create({ data: { name: input.name } });
      } catch (error) {
        errorFilter(error);
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.$transaction(async (tx) => {
          const activeProductCount = await tx.product.count({
            where: { categoryId: input.id, isAvailable: true },
          });

          if (activeProductCount > 0) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: `Gagal Hapus: Kategori ini masih memiliki ${activeProductCount} produk aktif.`,
            });
          }

          const inactiveProductCount = await tx.product.count({
            where: { categoryId: input.id, isAvailable: false },
          });

          if (inactiveProductCount > 0) {
            const archivedCategory =
              (await tx.category.findFirst({
                where: { name: ARCHIVED_CATEGORY_NAME },
              })) ??
              (await tx.category.create({
                data: { name: ARCHIVED_CATEGORY_NAME },
              }));

            if (archivedCategory.id === input.id) {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message:
                  "Gagal Hapus: Kategori arsip masih digunakan oleh produk nonaktif.",
              });
            }

            await tx.product.updateMany({
              where: { categoryId: input.id, isAvailable: false },
              data: { categoryId: archivedCategory.id },
            });
          }

          return await tx.category.delete({ where: { id: input.id } });
        });
      } catch (error) {
        errorFilter(error);
      }
    }),
});
