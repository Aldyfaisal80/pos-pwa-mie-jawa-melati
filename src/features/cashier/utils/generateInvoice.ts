/**
 * Generate invoice number: INV-YYYYMMDD-XXXX (4 digit random)
 */
export const generateInvoiceNumber = (): string => {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const random = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV-${date}-${random}`;
};
