export const stockKeys = {
  all: () => ["stocks"] as const,
  detail: (id: string) => [...stockKeys.all(), "detail", id] as const,
  logsByKode: (kode: string) => [...stockKeys.all(), "logs", kode] as const,
}
