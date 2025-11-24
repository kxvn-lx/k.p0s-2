import { useQuery } from "@tanstack/react-query"
import { stockKeys } from "../api/stock.keys"
import { StockService, type StockLogRow, type StockRow } from "../api/stock.service"

export function useStocksQuery(search?: string) {
  return useQuery<StockRow[]>({
    queryKey: stockKeys.all(search),
    queryFn: async () => {
      const { data, error } = await StockService.getAll(search)
      if (error) throw new Error(error.message || "Gagal memuat stok")
      return data || []
    },
    select: (data) => {
      if (!search?.trim()) return data

      const searchTerms = search.toLowerCase().split(/\s+/).filter(Boolean)
      return data.filter((stock) => {
        const searchableText = [stock.nama, stock.kode, stock.kategori]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        return searchTerms.every((term) => searchableText.includes(term))
      })
    },
  })
}

export function useStockQuery(id: string) {
  return useQuery<StockRow | null>({
    queryKey: stockKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await StockService.getById(id)
      if (error) throw new Error(error.message || "Gagal memuat detail stok")
      return data
    },
    enabled: !!id,
  })
}

export function useStockLogsQuery(kode: string | undefined) {
  return useQuery<StockLogRow[]>({
    queryKey: kode ? stockKeys.logsByKode(kode) : ["stock-logs-disabled"],
    queryFn: async () => {
      if (!kode) return []
      const { data, error } = await StockService.getLogsByCode(kode)
      if (error)
        throw new Error(error.message || "Gagal memuat pergerakan stok")
      return data || []
    },
    enabled: !!kode,
  })
}
