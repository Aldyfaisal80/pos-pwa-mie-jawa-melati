import React from "react";
import { Text, Row, Line, Image } from "react-thermal-printer";
import { formatRupiah } from "@/lib/format";
import type { CartItem, PaymentMethod } from "../types/cashier.types";

const stripAccents = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getAbsoluteUrl = (url: string) => {
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
  }
  return url;
};

const splitText = (text: string, maxLength: number) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > maxLength) {
      if (currentLine.trim()) lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());
  return lines;
};

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
      <Text align="center" bold={true}>================================</Text>
      <Text align="center" bold={true} size={{ width: 2, height: 2 }}>
        {stripAccents(store.name.toUpperCase())}
      </Text>
      <Text align="center" bold={true}>================================</Text>

      {store.address &&
        splitText(stripAccents(store.address), 32).map((line, i) => (
          <Text key={i} align="center">
            {line}
          </Text>
        ))}

      {store.phone && <Text align="center">Telp: {store.phone}</Text>}

      <Text>{`No: #${invoiceNumber}`}</Text>
      <Row
        left={`${transactionDate.toLocaleDateString("id-ID")} ${transactionDate.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}`}
        right="Kasir: Admin"
      />
      <Line />

      {cart.map((item) => (
        <React.Fragment key={item.cartId}>
          <Text>{stripAccents(item.name)}</Text>
          <Row
            left={`  ${item.qty} x ${formatRupiah(item.price)}`}
            right={formatRupiah(item.price * item.qty)}
          />
          {item.note && <Text>   * {stripAccents(item.note)}</Text>}
        </React.Fragment>
      ))}
      <Line />

      <Row left="Subtotal:" right={formatRupiah(cartTotal)} />
      <Row left="Pajak:" right="Rp 0" />
      <Line />
      <Text bold={true} align="center">
        TOTAL: {formatRupiah(cartTotal)}
      </Text>
      <Row
        left={paymentMethod === "CASH" ? "Tunai:" : `${paymentMethod}:`}
        right={formatRupiah(Number(paymentAmount || cartTotal))}
      />
      {paymentMethod === "CASH" && changeAmount >= 0 && (
        <Row left="Kembali:" right={formatRupiah(changeAmount)} />
      )}

      <Text align="center">*** TERIMA KASIH ***</Text>
      <Text align="center">Selamat Menikmati</Text>

      {/* Provide exact space for mobile POS manual tear, avoiding waste from <Cut /> */}
      <Text>{"\n"}</Text>
    </>
  );
};
