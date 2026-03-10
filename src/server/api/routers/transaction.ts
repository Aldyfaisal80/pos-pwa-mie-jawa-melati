import { z } from "zod";
import { Prisma } from "../../../../generated/prisma";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  syncTransactionSchema,
  reportFilterSchema,
} from "@/server/validations";
import { errorFilter } from "@/server/filters/error.filter";

export const transactionRouter = createTRPCRouter({
  // --- Sync Offline Transactions ---
  syncOfflineData: publicProcedure
    .input(syncTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.$transaction(
          input.map((trx) =>
            ctx.db.transaction.create({
              data: {
                invoiceNumber: trx.invoiceNumber,
                date: trx.date,
                totalAmount: trx.totalAmount,
                paymentMethod: trx.paymentMethod,
                paidAmount: trx.paidAmount,
                change: trx.change,
                isSynced: true,
                items: {
                  create: trx.items.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subTotal: item.subTotal,
                    note: item.note,
                  })),
                },
              },
            }),
          ),
        );
      } catch (error) {
        errorFilter(error);
      }
    }),

  // --- Delete Transaction ---
  deleteTransaction: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.transaction.delete({
          where: { id: input.id },
        });
      } catch (error) {
        errorFilter(error);
      }
    }),

  // --- Transaction Report (Paginated) ---
  getTransactionReport: publicProcedure
    .input(reportFilterSchema)
    .query(async ({ ctx, input }) => {
      try {
        const startBase = input.startDate ?? new Date();
        const start = new Date(startBase);
        start.setHours(0, 0, 0, 0);

        const endBase = input.endDate ?? new Date();
        const end = new Date(endBase);
        end.setHours(23, 59, 59, 999);

        const whereClause: Prisma.TransactionWhereInput = {
          isSynced: true,
          date: { gte: start, lte: end },
        };

        if (input.paymentMethod) {
          whereClause.paymentMethod = input.paymentMethod;
        }

        if (input.search) {
          whereClause.invoiceNumber = {
            contains: input.search,
            mode: "insensitive",
          };
        }

        const totalCount = await ctx.db.transaction.count({
          where: whereClause,
        });

        const skip = (input.page - 1) * input.limit;

        const transactions = await ctx.db.transaction.findMany({
          where: whereClause,
          include: { items: true },
          orderBy: { date: "desc" },
          skip,
          take: input.limit,
        });

        const totalPages = Math.ceil(totalCount / input.limit);

        return {
          transactions,
          totalCount,
          totalPages,
          currentPage: input.page,
        };
      } catch (error) {
        errorFilter(error);
      }
    }),

  // --- Dashboard Statistics (Today) ---
  getDashboardStats: publicProcedure.query(async ({ ctx }) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const stats = await ctx.db.transaction.aggregate({
        where: { date: { gte: today }, isSynced: true },
        _sum: { totalAmount: true },
        _count: { id: true },
      });

      const topProducts = await ctx.db.transactionItem.groupBy({
        by: ["productName"],
        where: { transaction: { date: { gte: today }, isSynced: true } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      });

      return {
        totalOmzet: stats._sum.totalAmount?.toNumber() ?? 0,
        totalTransactions: stats._count.id ?? 0,
        topProducts: topProducts.map((p) => ({
          name: p.productName,
          sold: p._sum.quantity ?? 0,
        })),
      };
    } catch (error) {
      errorFilter(error);
    }
  }),

  // --- Dynamic Revenue Chart ---
  getRevenueChart: publicProcedure
    .input(
      z.object({
        days: z.number().min(1).max(90).default(7),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

        const days = Array.from({ length: input.days }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (input.days - 1 - i));
          d.setHours(0, 0, 0, 0);
          return d;
        });

        const startDate = days[0]!;
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        const transactions = await ctx.db.transaction.findMany({
          where: {
            isSynced: true,
            date: { gte: startDate, lte: endDate },
          },
          select: { date: true, totalAmount: true },
        });

        const useDate = input.days > 14;

        const result = days.map((day) => {
          const dayTransactions = transactions.filter((trx) => {
            const trxDate = new Date(trx.date);
            trxDate.setHours(0, 0, 0, 0);
            return trxDate.getTime() === day.getTime();
          });

          const total = dayTransactions.reduce(
            (sum, trx) => sum + trx.totalAmount.toNumber(),
            0,
          );

          const label = useDate
            ? `${String(day.getDate()).padStart(2, "0")}/${String(day.getMonth() + 1).padStart(2, "0")}`
            : dayNames[day.getDay()]!;

          return { name: label, total };
        });

        return result;
      } catch (error) {
        errorFilter(error);
      }
    }),
});
