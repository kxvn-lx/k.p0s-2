// ----- Keys -----
export const ringkasanKeys = {
  all: ["ringkasan"] as const,
  penjualan: (start: string, end: string) =>
    [...ringkasanKeys.all, "penjualan", start, end] as const,
  pembelian: (start: string, end: string) =>
    [...ringkasanKeys.all, "pembelian", start, end] as const,
  pengeluaran: (start: string, end: string) =>
    [...ringkasanKeys.all, "pengeluaran", start, end] as const,
  penjualanDetail: (id: string) =>
    [...ringkasanKeys.all, "penjualan-detail", id] as const,
  pembelianDetail: (id: string) =>
    [...ringkasanKeys.all, "pembelian-detail", id] as const,
  pengeluaranDetail: (id: string) =>
    [...ringkasanKeys.all, "pengeluaran-detail", id] as const,
  timPenjualan: (date: string) =>
    [...ringkasanKeys.all, "tim-penjualan", date] as const,
}
