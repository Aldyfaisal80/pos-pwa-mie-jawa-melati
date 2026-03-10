import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  syncTransactionSchema,
  reportFilterSchema,
} from "@/server/validations";
import { errorFilter } from "@/server/filters/error.filter";

export const transactionRouter = createTRPCRouter({
  // SINKRONISASI PWA (Batch Upload dari Offline)
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
                isSynced: true, // Masuk server = synced
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
        // Jika invoice kembar, errorFilter akan deteksi P2002 dan return 409 CONFLICT
        errorFilter(error);
      }
    }),

  // MENGHAPUS TRANSAKSI
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

  // LAPORAN KEUANGAN
  getTransactionReport: publicProcedure
    .input(reportFilterSchema)
    .query(async ({ ctx, input }) => {
      try {
        const start =
          input.startDate ?? new Date(new Date().setHours(0, 0, 0, 0));
        const end =
          input.endDate ?? new Date(new Date().setHours(23, 59, 59, 999));

        const whereClause: any = {
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
          delete whereClause.date;
        }

        // Hitung total data kesuluruhan untuk kriteria filter ini
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

  // STATISTIK DASHBOARD
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

  // GRAFIK PENDAPATAN (Periode Dinamis)
  getRevenueChart: publicProcedure
    .input(
      z.object({
        days: z.number().min(1).max(90).default(7),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

        // Buat array N hari terakhir (D-(N-1) sampai hari ini)
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

        // Untuk 30 hari, tampilkan label tanggal (dd/MM), selain itu nama hari
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
