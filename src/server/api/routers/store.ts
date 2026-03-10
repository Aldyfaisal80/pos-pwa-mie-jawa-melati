import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { errorFilter } from "@/server/filters/error.filter";
import { updateStoreProfileSchema } from "@/server/validations";

export const storeRouter = createTRPCRouter({
  getProfile: publicProcedure.query(async ({ ctx }) => {
    try {
      const profile = await ctx.db.storeConfig.findFirst({
        where: { id: 1 },
      });

      return (
        profile ?? {
          name: "Mie Jawa Melati",
          address: "Jl. Nasional III, Blitar",
          phone: "-",
          logoUrl: null,
        }
      );
    } catch (error) {
      errorFilter(error);
    }
  }),

  updateProfile: publicProcedure
    .input(updateStoreProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.storeConfig.upsert({
          where: { id: 1 },
          update: input,
          create: { id: 1, ...input },
        });
      } catch (error) {
        errorFilter(error);
      }
    }),
});
