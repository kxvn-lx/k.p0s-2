export const stockKeys = {
  // include search param in list key so different search results are cached separately
  all: (search?: string) =>
    search && search.trim()
      ? (["stocks", "search", search] as const)
      : (["stocks", "all"] as const),
  detail: (id: string) => [...stockKeys.all(), "detail", id] as const,
  logsById: (id: string) => [...stockKeys.all(), "logs", id] as const,
  truck: (search?: string) =>
    search && search.trim()
      ? (["stocks", "truck", "search", search] as const)
      : (["stocks", "truck", "all"] as const),
}
