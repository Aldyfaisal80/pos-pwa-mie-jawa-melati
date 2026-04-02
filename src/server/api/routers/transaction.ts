import { z } from "zod";
import { type Prisma, type PaymentMethod } from "../../../../generated/prisma";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  syncTransactionSchema,
  reportFilterSchema,
  exportReportSchema,
  ReportSortBy,
} from "@/server/validations";
import { errorFilter } from "@/server/filters/error.filter";
import { ErrorTRPCService } from "@/server/services/error.service";
import { toWIBStartOfDay, toWIBEndOfDay, todayWIBStart } from "@/lib/timezone";

const buildReportWhereClause = (input: {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: string;
  search?: string;
}): Prisma.TransactionWhereInput => {
  const whereClause: Prisma.TransactionWhereInput = {
    isSynced: true,
    deletedAt: null, // exclude soft-deleted records
  };

  if (input.startDate || input.endDate) {
    const dateFilter: Prisma.DateTimeFilter = {};

    // Use WIB (UTC+7) boundaries so date filtering is accurate for Indonesian users
    if (input.startDate)
      dateFilter.gte = toWIBStartOfDay(new Date(input.startDate));
    if (input.endDate) dateFilter.lte = toWIBEndOfDay(new Date(input.endDate));

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
        // The `date` column is `timestamp WITHOUT time zone`.
        // PostgreSQL treats stored values as "local" time.
        // Client sends UTC ISO strings (new Date().toISOString()), which Prisma
        // passes through as-is. We must shift to WIB (UTC+7) before storing
        // so that DATE(date AT TIME ZONE 'Asia/Jakarta') computes the correct day.
        const toWIBLocal = (utcDate: Date): Date =>
          new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

        return await ctx.db.$transaction(
          input.map((trx) =>
            ctx.db.transaction.create({
              data: {
                invoiceNumber: trx.invoiceNumber,
                date: toWIBLocal(trx.date),
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
        const trx = await ctx.db.transaction.findUnique({
          where: { id: input.id },
          select: { deletedAt: true },
        });

        if (!trx) ErrorTRPCService.throw("NOT_FOUND");
        if (trx.deletedAt) ErrorTRPCService.throw("CONFLICT", "sudah dihapus");

        return await ctx.db.transaction.update({
          where: { id: input.id },
          data: { deletedAt: new Date() },
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
      // Use WIB start-of-day so "today" is correct for Indonesian users
      const today = todayWIBStart();

      const stats = await ctx.db.transaction.aggregate({
        where: { date: { gte: today }, isSynced: true, deletedAt: null },
        _sum: { totalAmount: true },
        _count: { id: true },
      });

      const topProducts = await ctx.db.transactionItem.groupBy({
        by: ["productName"],
        where: {
          transaction: {
            date: { gte: today },
            isSynced: true,
            deletedAt: null,
          },
        },
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
        const useDate = input.days > 14;

        // Build the WIB-aware date range for the query
        const now = new Date();
        const startDate = toWIBStartOfDay(
          new Date(now.getTime() - (input.days - 1) * 24 * 60 * 60 * 1000),
        );
        const endDate = toWIBEndOfDay(now);

        // Single SQL GROUP BY query — avoids fetching all rows into JS memory.
        // DATE() with AT TIME ZONE ensures day boundaries are calculated in WIB.
        // We use TO_CHAR to force Prisma to return a String instead of a misleading Date object.
        type RevenueRow = { day_str: string; total: number };
        const rows = await ctx.db.$queryRaw<RevenueRow[]>`
          SELECT
            TO_CHAR(DATE(date AT TIME ZONE 'Asia/Jakarta'), 'YYYY-MM-DD') AS day_str,
            COALESCE(SUM("totalAmount"), 0)::float   AS total
          FROM "Transaction"
          WHERE
            "isSynced" = true
            AND "deletedAt" IS NULL
            AND date >= ${startDate}
            AND date <= ${endDate}
          GROUP BY day_str
          ORDER BY day_str ASC
        `;

        // Build every day in range so days with 0 revenue are still included
        const result = Array.from({ length: input.days }, (_, i) => {
          const d = new Date(
            now.getTime() - (input.days - 1 - i) * 24 * 60 * 60 * 1000,
          );
          // Shift to WIB to get the correct local date for label/lookup
          const wibD = new Date(d.getTime() + 7 * 60 * 60 * 1000);

          const label = useDate
            ? `${String(wibD.getUTCDate()).padStart(2, "0")}/${String(wibD.getUTCMonth() + 1).padStart(2, "0")}`
            : dayNames[wibD.getUTCDay()]!;

          const wibDString = `${wibD.getUTCFullYear()}-${String(wibD.getUTCMonth() + 1).padStart(2, "0")}-${String(wibD.getUTCDate()).padStart(2, "0")}`;

          // Match the SQL `day_str` column directly bypasses any Node.js Date timezone pitfalls
          const match = rows.find((r) => r.day_str === wibDString);

          return { name: label, total: match?.total ?? 0 };
        });

        return result;
      } catch (error) {
        errorFilter(error);
      }
    }),
});
