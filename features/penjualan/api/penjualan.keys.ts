export const penjualanKeys = {
  all: () => ["penjualan"] as const,
  lists: () => [...penjualanKeys.all(), "list"] as const,
  detail: (id: string) => [...penjualanKeys.all(), "detail", id] as const,
}
