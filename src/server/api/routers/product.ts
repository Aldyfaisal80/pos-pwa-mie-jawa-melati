import { z } from "zod";
import { type Prisma } from "../../../../generated/prisma";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { errorFilter } from "@/server/filters/error.filter";
import {
  createProductSchema,
  updateProductSchema,
  filterProductSchema,
} from "@/server/validations";

export const productRouter = createTRPCRouter({
  // 1. GET ALL
  getAll: protectedProcedure
    .input(filterProductSchema.optional())
    .query(async ({ ctx, input }) => {
      try {
        const whereClause: Prisma.ProductWhereInput = {};
        if (input?.onlyAvailable) whereClause.isAvailable = true;
        if (input?.categoryId) whereClause.categoryId = input.categoryId;
        if (input?.search) {
          whereClause.name = { contains: input.search, mode: "insensitive" };
        }

        return await ctx.db.product.findMany({
          where: whereClause,
          include: { category: true },
          orderBy: { name: "asc" },
        });
      } catch (error) {
        errorFilter(error);
      }
    }),

  // 2. CREATE
  create: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.product.create({ data: input });
      } catch (error) {
        errorFilter(error);
      }
    }),

  // 3. UPDATE
  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateProductSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Prisma throw P2025 jika ID tidak ketemu -> errorFilter handle jadi 404
        return await ctx.db.product.update({
          where: { id: input.id },
          data: input.data,
        });
      } catch (error) {
        errorFilter(error);
      }
    }),

  // 4. DELETE (Soft Delete)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.product.update({
          where: { id: input.id },
          data: { isAvailable: false },
        });
      } catch (error) {
        errorFilter(error);
      }
    }),
});
