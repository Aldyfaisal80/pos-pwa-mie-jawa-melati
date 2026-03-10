/**
 * Badge class untuk metode pembayaran
 */
export const getPaymentMethodBadge = (method: string) => {
  switch (method) {
    case "CASH":
      return "bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400";
    case "QRIS":
      return "bg-purple-50 text-purple-700 hover:bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400";
    case "TRANSFER":
      return "bg-amber-50 text-amber-700 hover:bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getPaymentMethodLabel = (method: string) => {
  const map: Record<string, string> = {
    CASH: "Tunai",
    QRIS: "QRIS",
    TRANSFER: "Transfer",
  };
  return map[method] ?? method;
};

/**
 * Format tanggal ke format Indonesia
 */
export const formatDateTime = (date: Date | string) => {
  const d = new Date(date);
  return {
    date: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
    time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
  };
};

/**
 * Export transaksi ke CSV sederhana
 */
export const exportToCSV = (
  transactions: {
    invoiceNumber: string;
    date: Date | string;
    paymentMethod: string;
    totalAmount: { toString: () => string };
  }[],
) => {
  const header = "No. Nota,Tanggal,Waktu,Metode,Total\n";
  const rows = transactions.map((t) => {
    const { date, time } = formatDateTime(t.date);
    return `${t.invoiceNumber},${date},${time},${getPaymentMethodLabel(t.paymentMethod)},${t.totalAmount.toString()}`;
  });
  const csv = header + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `laporan_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
