"use client";

import { useState, useMemo, useCallback } from "react";
import type { CartItem, ProductFromServer } from "../types/cashier.types";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart],
  );
  const cartQty = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart],
  );
  const hasNotes = cart.some((item) => item.note.trim() !== "");

  const addToCart = useCallback((product: ProductFromServer) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.note === "",
      );
      if (existing) {
        return prev.map((item) =>
          item.cartId === existing.cartId
            ? { ...item, qty: item.qty + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          cartId: Date.now().toString(),
          productId: product.id,
          name: product.name,
          categoryName: product.category?.name,
          price: Number(product.price),
          qty: 1,
          note: "",
        },
      ];
    });
  }, []);

  const updateQty = useCallback((cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId ? { ...item, qty: item.qty + delta } : item,
        )
        .filter((item) => item.qty > 0),
    );
  }, []);

  const setAbsoluteQty = useCallback((cartId: string, qty: number) => {
    const safeQty = Math.max(0, Math.floor(qty));
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId ? { ...item, qty: safeQty } : item,
        )
        .filter((item) => item.qty > 0),
    );
  }, []);

  const updateNote = useCallback(
    (cartId: string, note: string, splitQty?: number) => {
      setCart((prev) => {
        const idx = prev.findIndex((item) => item.cartId === cartId);
        if (idx === -1) return prev;

        const item = prev[idx]!;
        const qtyToApply = splitQty ?? item.qty;

        // If applying to all, just update the note
        if (qtyToApply >= item.qty) {
          const next = [...prev];
          next[idx] = { ...item, note };
          return next;
        }

        // ─── ITEM SPLITTING ───
        const originalReduced = { ...item, qty: item.qty - qtyToApply };
        const newSplitItem = {
          ...item,
          cartId:
            Date.now().toString() + Math.random().toString(36).slice(2, 6),
          qty: qtyToApply,
          note: note,
        };

        const next = [...prev];
        next.splice(idx, 1, originalReduced, newSplitItem);
        return next;
      });
    },
    [],
  );

  const clearCart = useCallback(() => setCart([]), []);

  return {
    cart,
    cartTotal,
    cartQty,
    hasNotes,
    addToCart,
    updateQty,
    setAbsoluteQty,
    updateNote,
    clearCart,
  };
};
