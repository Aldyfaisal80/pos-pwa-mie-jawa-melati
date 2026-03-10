import type { RouterOutputs } from "@/trpc/react";

export type ProductFromServer = NonNullable<
  RouterOutputs["product"]["getAll"]
>[number];

export type StoreProfile = NonNullable<RouterOutputs["store"]["getProfile"]>;

export type PaymentMethod = "CASH" | "QRIS" | "TRANSFER";

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  categoryName?: string;
  price: number;
  qty: number;
  note: string;
}

export interface CheckoutData {
  cart: CartItem[];
  cartTotal: number;
  paymentMethod: PaymentMethod;
  paymentAmount: string;
  invoiceNumber: string;
}
