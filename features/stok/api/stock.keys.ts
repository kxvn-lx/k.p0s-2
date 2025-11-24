export const stockKeys = {
  // include search param in list key so different search results are cached separately
  all: (search?: string) =>
    search && search.trim()
      ? (["stocks", "search", search] as const)
      : (["stocks", "all"] as const),
  detail: (id: string) => [...stockKeys.all(), "detail", id] as const,
  logsByKode: (kode: string) => [...stockKeys.all(), "logs", kode] as const,
}
