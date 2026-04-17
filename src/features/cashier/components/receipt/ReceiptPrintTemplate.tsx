import React from "react";
import { Text, Row, Line, Image } from "react-thermal-printer";
import { formatRupiah } from "@/lib/format";
import type { CartItem, PaymentMethod } from "../../types/cashier.types";

/**
 * Custom image reader for react-thermal-printer.
 * The library's default reader uses `img.crossOrigin = ""` (invalid string)
 * which taints the canvas and causes a SecurityError in getImageData().
 * Since store.logoUrl is already a base64 data URL when passed here,
 * we can load it without any CORS concerns.
 */
const base64ImageReader = async (
  elem: React.ReactElement,
): Promise<{ data: Uint8Array; width: number; height: number }> => {
  const src = (elem.props as { src: string }).src;
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    // Do NOT set crossOrigin for data: URLs — it causes onerror in Chrome.
    // src here is always a base64 data: URL (converted by getBase64ImageFromUrl),
    // so there are no CORS concerns anyway.
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Cannot get 2D canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, img.width, img.height);
      resolve({ data: new Uint8Array(data), width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src.slice(0, 40)}...`));
    img.src = src; // base64 data: URL — no CORS, no tainted canvas
  });
};

const stripAccents = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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
  showLogo?: boolean;
  showFooter?: boolean;
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
  showLogo = true,
  showFooter = true,
}: ReceiptPrintTemplateProps) => {
  const changeAmount = Number(paymentAmount) - cartTotal;

  return (
    <>
      {showLogo && store.logoUrl && (
        <Image src={store.logoUrl} align="center" reader={base64ImageReader} />
      )}
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

      {showFooter && (
        <>
          <Text align="center">*** TERIMA KASIH ***</Text>
          <Text align="center">Selamat Menikmati</Text>
        </>
      )}

      {/* Provide exact space for mobile POS manual tear, avoiding waste from <Cut /> */}
      <Text>{"\n"}</Text>
    </>
  );
};
