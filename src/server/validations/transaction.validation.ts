import { z } from "zod";
// import { PaymentMethod } from "@prisma/client";

export enum PaymentMethod {
  CASH = "CASH",
  QRIS = "QRIS",
  TRANSFER = "TRANSFER",
}

export enum ReportSortBy {
  INVOICE_NUMBER = "invoiceNumber",
  DATE = "date",
  PAYMENT_METHOD = "paymentMethod",
  TOTAL_AMOUNT = "totalAmount",
  ITEM_COUNT = "itemCount",
}

export enum ReportSortOrder {
  ASC = "asc",
  DESC = "desc",
}

// Validasi Item dalam keranjang
const transactionItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string().min(1).max(100), // Snapshot Nama
  quantity: z.number().int().min(1).max(999),
  unitPrice: z.number().min(0).max(999_999_999), // Snapshot Harga
  subTotal: z.number().min(0).max(999_999_999),
  note: z.string().max(255).optional().nullable(),
});

// Validasi Batch Sync (Array Transaksi) — max 50 mencegah DoS
export const syncTransactionSchema = z.array(
  z.object({
    invoiceNumber: z.string().min(1).max(50),
    date: z.date(),
    totalAmount: z.number().min(0).max(999_999_999),
    paymentMethod: z.nativeEnum(PaymentMethod),
    paidAmount: z.number().min(0).max(999_999_999),
    change: z.number().min(0).max(999_999_999),
    items: z.array(transactionItemSchema).min(1, "Minimal 1 item").max(100),
  }),
).min(1).max(50);

// Validasi Filter Laporan
export const reportFilterSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  search: z.string().optional(),
  sortBy: z.nativeEnum(ReportSortBy).default(ReportSortBy.DATE),
  sortOrder: z.nativeEnum(ReportSortOrder).default(ReportSortOrder.DESC),
  limit: z.number().min(1).max(100).default(25),
  page: z.number().min(1).default(1),
});

export const exportReportSchema = reportFilterSchema.omit({
  limit: true,
  page: true,
});

// Validasi untuk statistik & chart halaman laporan
export const reportStatsSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
});
