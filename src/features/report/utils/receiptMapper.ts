import type { RouterOutputs } from "@/trpc/react";
import type { CartItem } from "@/features/cashier/types/cashier.types";

type TransactionItem = Exclude<
  RouterOutputs["transaction"]["getTransactionReport"],
  undefined
>["transactions"][number]["items"][number];

export const mapTransactionItemsToCart = (
  items: TransactionItem[],
): CartItem[] =>
  items.map((item) => ({
    cartId: item.id,
    productId: item.productId,
    name: item.productName,
    price: Number(item.unitPrice),
    qty: item.quantity,
    note: item.note ?? "",
  }));
