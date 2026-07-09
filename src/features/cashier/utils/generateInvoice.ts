/**
 * Generate invoice number: INV-YYYYMMDD-HHMMSS-XXXX (4 digit crypto-random)
 *
 * Format includes time component for near-zero collision probability.
 * Uses crypto.getRandomValues for cryptographically secure randomness.
 */
export const generateInvoiceNumber = (): string => {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const time = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  // Crypto-safe random: 4 digits (0000-9999)
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  const random = String(arr[0]! % 10000).padStart(4, "0");

  return `INV-${date}-${time}-${random}`;
};
