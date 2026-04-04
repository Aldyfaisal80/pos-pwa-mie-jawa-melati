import React from "react";
import { Text, Row, Line, Cut, Image } from "react-thermal-printer";
import { transforms } from "@react-thermal-printer/image";
import { formatRupiah } from "@/lib/format";
import type { CartItem, PaymentMethod } from "../types/cashier.types";

const stripAccents = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

interface ReceiptPrintTemplateProps {
  store: {
    name: string;
    address: string | null;
    phone: string | null;
    logoUrl: string | null;
  };
  cart: CartItem[];
  cartTotal: number;
  paymentMethod: PaymentMethod;
  paymentAmount: string;
  invoiceNumber: string;
  transactionDate: Date;
}

// Headless component — used only as argument to render(), never mounted to DOM
export const ReceiptPrintTemplate = ({
  store,
  cart,
  cartTotal,
  paymentMethod,
  paymentAmount,
  invoiceNumber,
  transactionDate,
}: ReceiptPrintTemplateProps) => {
  const changeAmount = Number(paymentAmount) - cartTotal;

  return (
    <>
      {store.logoUrl && (
        <>
          <Image
            src={store.logoUrl}
            align="center"
            transforms={[transforms.floydSteinberg]}
          />
          <Text> </Text>
        </>
      )}

      <Text align="center" bold={true} size={{ width: 2, height: 2 }}>
        {stripAccents(store.name.toUpperCase())}
      </Text>

      {store.address && (
        <Text align="center">{stripAccents(store.address)}</Text>
      )}
      {store.phone && <Text align="center">Telp: {store.phone}</Text>}
      <Text> </Text>

      <Row left={`No: #${invoiceNumber}`} right="Kasir: Admin" />
      <Row
        left={transactionDate.toLocaleDateString("id-ID")}
        right={transactionDate.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
      <Line />

      {cart.map((item) => (
        <React.Fragment key={item.cartId}>
          <Text bold={true}>{stripAccents(item.name)}</Text>
          <Row
            left={`  ${item.qty} x ${formatRupiah(item.price)}`}
            right={formatRupiah(item.price * item.qty)}
          />
          {item.note && <Text> * {stripAccents(item.note)}</Text>}
        </React.Fragment>
      ))}
      <Line />

      <Row left="Subtotal:" right={formatRupiah(cartTotal)} />
      <Row left="Pajak:" right="Rp 0" />
      <Line />
      <Text bold={true} align="center">
        TOTAL: {formatRupiah(cartTotal)}
      </Text>

      <Text> </Text>
      <Row
        left={paymentMethod === "CASH" ? "Tunai:" : `${paymentMethod}:`}
        right={formatRupiah(Number(paymentAmount || cartTotal))}
      />
      {paymentMethod === "CASH" && changeAmount >= 0 && (
        <Row left="Kembali:" right={formatRupiah(changeAmount)} />
      )}

      <Text> </Text>
      <Text align="center">*** TERIMA KASIH ***</Text>
      <Text align="center">Selamat Menikmati</Text>
      <Text> </Text>

      <Cut />
    </>
  );
};
