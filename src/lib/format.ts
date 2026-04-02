export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

/** Compact format for chart axis labels, e.g. 150000 → "Rp 150k" */
export const formatRupiahShort = (value: number) =>
  `Rp ${value / 1000}k`;
