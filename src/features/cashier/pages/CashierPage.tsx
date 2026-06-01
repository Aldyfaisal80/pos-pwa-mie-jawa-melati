"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronRight } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { useCart } from "../hooks/useCart";
import { useCashierProducts } from "../hooks/useCashierProducts";
import { useSyncTransaction } from "../hooks/useSyncTransaction";

import { ProductCatalog } from "../components/ProductCatalog";
import { CartPanel } from "../components/CartPanel";
import { NoteModal } from "../components/NoteModal";
import { CheckoutModal } from "../components/CheckoutModal";
import { ReceiptModal } from "../components/ReceiptModal";

import type { PaymentMethod } from "../types/cashier.types";

export const CashierPage = () => {
  // Data
  const { products, isLoading, categoryNames } = useCashierProducts();
  const {
    cart,
    cartTotal,
    cartQty,
    hasNotes,
    addToCart,
    updateQty,
    setAbsoluteQty,
    updateNote,
    clearCart,
  } = useCart();
  const { syncTransaction, isPending } = useSyncTransaction();

  // UI state
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Modal states
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Note form
  const [activeNoteCartId, setActiveNoteCartId] = useState<string | null>(null);
  const activeNoteItem = cart.find((i) => i.cartId === activeNoteCartId);

  // Payment form
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [paymentAmount, setPaymentAmount] = useState("");

  // Receipt data (frozen at transaction time)
  const [receiptData, setReceiptData] = useState({
    invoiceNumber: "",
    transactionDate: new Date(),
    cart: structuredClone(cart),
    cartTotal: 0,
    paymentMethod: "CASH" as PaymentMethod,
    paymentAmount: "",
    wasOffline: false,
  });

  // --- handlers ---
  const handleOpenNote = useCallback((cartId: string) => {
    setActiveNoteCartId(cartId);
    setIsNoteOpen(true);
  }, []);

  const handleSaveNote = useCallback(
    (note: string, splitQty: number) => {
      if (activeNoteCartId) updateNote(activeNoteCartId, note, splitQty);
    },
    [activeNoteCartId, updateNote],
  );

  const handleClearNote = useCallback(
    (cartId: string) => {
      updateNote(cartId, "");
    },
    [updateNote],
  );

  const handleClearCart = useCallback(() => setIsClearConfirmOpen(true), []);
  const handleOpenCheckout = useCallback(() => setIsCheckoutOpen(true), []);

  const handleProcess = useCallback(() => {
    syncTransaction({
      cart,
      cartTotal,
      paymentMethod,
      paymentAmount,
      onSuccess: (invoiceNumber, wasOffline) => {
        setReceiptData({
          invoiceNumber,
          transactionDate: new Date(),
          cart: structuredClone(cart),
          cartTotal,
          paymentMethod,
          paymentAmount,
          wasOffline,
        });
        setIsCheckoutOpen(false);
        setIsReceiptOpen(true);
      },
    });
  }, [cart, cartTotal, paymentMethod, paymentAmount, syncTransaction]);

  // Auto-close checkout modal when cart becomes empty
  useEffect(() => {
    if (cart.length === 0 && isCheckoutOpen) {
      setIsCheckoutOpen(false);
    }
  }, [cart.length, isCheckoutOpen]);

  const handleFinish = useCallback(() => {
    setIsReceiptOpen(false);
    clearCart();
    setPaymentAmount("");
    setPaymentMethod("CASH");
    if (receiptData.wasOffline) {
      toast.info("Transaksi Tersimpan Lokal", {
        description: "Akan otomatis dikirim ke server saat koneksi kembali.",
      });
    } else {
      toast.success("Transaksi Berhasil!", {
        description: "Data pesanan telah disimpan ke server.",
      });
    }
  }, [clearCart, receiptData.wasOffline]);

  return (
    <PageContainer title="Kasir" withHeader>
      <SectionContainer>
        <div className="bg-muted/30 relative flex h-[calc(100dvh-4rem)] flex-col overflow-hidden lg:flex-row">
          {/* Katalog Produk */}
          <ProductCatalog
            products={products}
            isLoading={isLoading}
            activeCategory={activeCategory}
            categoryNames={categoryNames}
            onCategoryChange={setActiveCategory}
            onAddToCart={addToCart}
          />

          {/* Panel Keranjang (Desktop) */}
          <div className="hidden h-full w-80 shrink-0 lg:flex xl:w-96">
            <CartPanel
              cart={cart}
              cartTotal={cartTotal}
              onUpdateQty={updateQty}
              onSetAbsoluteQty={setAbsoluteQty}
              onOpenNote={handleOpenNote}
              onClearNote={handleClearNote}
              onClear={handleClearCart}
              onCheckout={handleOpenCheckout}
            />
          </div>

          {/* Keranjang Melayang (Mobile) */}
          {cartTotal > 0 && (
            <div
              className="animate-in slide-in-from-bottom-5 fixed right-4 left-4 z-40 lg:hidden"
              style={{
                bottom: "calc(env(safe-area-inset-bottom, 0px) + 4.5rem)",
              }}
            >
              <Button
                className="flex h-auto w-full items-center justify-between rounded-2xl border border-white/10 p-4 shadow-2xl"
                size="lg"
                onClick={handleOpenCheckout}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary-foreground/20 text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-bold">
                    {cartQty}
                  </div>
                  <div className="text-primary-foreground flex flex-col items-start">
                    <span className="mb-0.5 text-xs opacity-80">
                      Total Tagihan
                    </span>
                    <span className="text-lg leading-none font-bold">
                      {formatRupiah(cartTotal)}
                    </span>
                    {hasNotes && (
                      <span className="bg-background/20 mt-1 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium">
                        <MessageSquare className="h-3 w-3" /> Ada Catatan
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-background text-foreground flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold">
                  Bayar <ChevronRight className="h-4 w-4" />
                </div>
              </Button>
            </div>
          )}

          {/* Modal Catatan */}
          <NoteModal
            open={isNoteOpen}
            initialNote={activeNoteItem?.note ?? ""}
            qty={activeNoteItem?.qty ?? 1}
            productName={activeNoteItem?.name}
            categoryName={activeNoteItem?.categoryName}
            onOpenChange={setIsNoteOpen}
            onSave={handleSaveNote}
          />

          {/* Modal Checkout */}
          <CheckoutModal
            open={isCheckoutOpen}
            onOpenChange={setIsCheckoutOpen}
            cart={cart}
            cartTotal={cartTotal}
            paymentMethod={paymentMethod}
            paymentAmount={paymentAmount}
            onPaymentMethodChange={setPaymentMethod}
            onPaymentAmountChange={setPaymentAmount}
            onUpdateQty={updateQty}
            onSetAbsoluteQty={setAbsoluteQty}
            onOpenNote={handleOpenNote}
            onProcess={handleProcess}
            isPending={isPending}
          />

          {/* Modal Struk */}
          <ReceiptModal
            open={isReceiptOpen}
            cart={receiptData.cart}
            cartTotal={receiptData.cartTotal}
            paymentMethod={receiptData.paymentMethod}
            paymentAmount={receiptData.paymentAmount}
            invoiceNumber={receiptData.invoiceNumber}
            transactionDate={receiptData.transactionDate}
            onFinish={handleFinish}
          />
        </div>
      </SectionContainer>

      {/* Konfirmasi Kosongkan Keranjang */}
      <AlertDialog
        open={isClearConfirmOpen}
        onOpenChange={setIsClearConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kosongkan semua pesanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua item di keranjang akan dihapus. Tindakan ini tidak bisa
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                clearCart();
                setIsClearConfirmOpen(false);
              }}
            >
              Ya, Kosongkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};
