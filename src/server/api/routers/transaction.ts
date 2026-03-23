import { z } from "zod";
import { Prisma, PaymentMethod } from "../../../../generated/prisma";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  syncTransactionSchema,
  reportFilterSchema,
  exportReportSchema,
  ReportSortBy,
} from "@/server/validations";
import { errorFilter } from "@/server/filters/error.filter";

const buildReportWhereClause = (
  input: {
    startDate?: Date;
    endDate?: Date;
    paymentMethod?: string;
    search?: string;
  },
): Prisma.TransactionWhereInput => {
  const whereClause: Prisma.TransactionWhereInput = {
    isSynced: true,
  };

  if (input.startDate || input.endDate) {
    const dateFilter: Prisma.DateTimeFilter = {};

    if (input.startDate) {
      const start = new Date(input.startDate);
      start.setHours(0, 0, 0, 0);
      dateFilter.gte = start;
    }

    if (input.endDate) {
      const end = new Date(input.endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }

    whereClause.date = dateFilter;
  }

  if (input.paymentMethod) {
    whereClause.paymentMethod = input.paymentMethod as PaymentMethod;
  }

  if (input.search) {
    whereClause.invoiceNumber = {
      contains: input.search,
      mode: "insensitive",
    };
  }

  return whereClause;
};

const buildReportOrderBy = (
  sortBy: ReportSortBy,
  sortOrder: "asc" | "desc",
): Prisma.TransactionOrderByWithRelationInput => {
  switch (sortBy) {
    case ReportSortBy.INVOICE_NUMBER:
      return { invoiceNumber: sortOrder };
    case ReportSortBy.PAYMENT_METHOD:
      return { paymentMethod: sortOrder };
    case ReportSortBy.TOTAL_AMOUNT:
      return { totalAmount: sortOrder };
    case ReportSortBy.ITEM_COUNT:
      return { items: { _count: sortOrder } };
    case ReportSortBy.DATE:
    default:
      return { date: sortOrder };
  }
};

export const transactionRouter = createTRPCRouter({
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

  getTransactionReport: publicProcedure
    .input(reportFilterSchema)
    .query(async ({ ctx, input }) => {
      try {
        const whereClause = buildReportWhereClause(input);
        const orderBy = buildReportOrderBy(input.sortBy, input.sortOrder);
        const skip = (input.page - 1) * input.limit;

        const [totalCount, transactions] = await Promise.all([
          ctx.db.transaction.count({ where: whereClause }),
          ctx.db.transaction.findMany({
            where: whereClause,
            include: { items: true },
            orderBy,
            skip,
            take: input.limit,
          }),
        ]);

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

  exportTransactionReport: publicProcedure
    .input(exportReportSchema)
    .query(async ({ ctx, input }) => {
      try {
        const whereClause = buildReportWhereClause(input);
        const orderBy = buildReportOrderBy(input.sortBy, input.sortOrder);

        return await ctx.db.transaction.findMany({
          where: whereClause,
          orderBy,
          select: {
            invoiceNumber: true,
            date: true,
            paymentMethod: true,
            totalAmount: true,
          },
        });
      } catch (error) {
        errorFilter(error);
      }
    }),

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
