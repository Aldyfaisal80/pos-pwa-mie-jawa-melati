import type { RouterOutputs } from "@/trpc/react";

export type Product = NonNullable<RouterOutputs["product"]["getAll"]>[number];

export type Category = NonNullable<RouterOutputs["category"]["getAll"]>[number];

export interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  image: string;
  isAvailable: boolean;
}

export const defaultProductFormData: ProductFormData = {
  name: "",
  description: "",
  categoryId: "",
  price: "",
  image: "",
  isAvailable: true,
};
