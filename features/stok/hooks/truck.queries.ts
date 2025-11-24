import { useQuery } from '@tanstack/react-query'
import { stockKeys } from '../api/stock.keys'
import { StockService } from '../api/stock.service'

export function useTruckStocksQuery(search?: string) {
  return useQuery({
    queryKey: stockKeys.truck(search),
    queryFn: async () => {
      const { data, error } = await StockService.getTruckStocks(search)
      if (error) throw new Error(error.message || 'Gagal memuat stok di truk')
      return data || []
    },
    select: (data) => {
      if (!search?.trim()) return data

      const searchTerms = search.toLowerCase().split(/\s+/).filter(Boolean)
      return data.filter((stock) => {
        const searchableText = [stock.nama, stock.kode, stock.kategori]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchTerms.every((term) => searchableText.includes(term))
      })
    },
  })
}

export function useVariasiByStock(stockId?: string) {
  return useQuery({
    queryKey: stockId ? ['stock', 'variations', stockId] : ['stock-variations-disabled'],
    queryFn: async () => {
      if (!stockId) return []
      const { data, error } = await StockService.getVariasiByStock(stockId)
      if (error) throw new Error(error.message || 'Gagal memuat variasi')
      return data || []
    },
    enabled: !!stockId,
  })
}
