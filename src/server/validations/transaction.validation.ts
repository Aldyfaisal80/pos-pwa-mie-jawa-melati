import { z } from "zod";
// import { PaymentMethod } from "@prisma/client";

export enum PaymentMethod {
  CASH = "CASH",
  QRIS = "QRIS",
  TRANSFER = "TRANSFER",
}

// Validasi Item dalam keranjang
const transactionItemSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string(), // Snapshot Nama
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0), // Snapshot Harga
  subTotal: z.number().min(0),
  note: z.string().optional().nullable(),
});

// Validasi Batch Sync (Array Transaksi)
export const syncTransactionSchema = z.array(
  z.object({
    invoiceNumber: z.string().min(1),
    date: z.date(),
    totalAmount: z.number(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    paidAmount: z.number(),
    change: z.number(),
    items: z.array(transactionItemSchema).min(1, "Minimal 1 item"),
  }),
);

// Validasi Filter Laporan
export const reportFilterSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(25),
  page: z.number().min(1).default(1),
});
