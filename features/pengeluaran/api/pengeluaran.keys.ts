export const pengeluaranKeys = {
  all: () => ["pengeluaran"] as const,
  lists: () => [...pengeluaranKeys.all(), "list"] as const,
  detail: (id: string) => [...pengeluaranKeys.all(), "detail", id] as const,
}
