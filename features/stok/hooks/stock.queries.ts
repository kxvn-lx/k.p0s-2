import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { stockKeys } from "../api/stock.keys"
import {
  StockService,
  type StockLokasi,
  type StockLogRow,
  type StockRow,
} from "../api/stock.service"

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

export function useStockLogsQuery(stockId: string | undefined) {
  return useQuery<StockLogRow[]>({
    queryKey: stockId ? stockKeys.logsById(stockId) : ["stock-logs-disabled"],
    queryFn: async () => {
      if (!stockId) return []
      const { data, error } = await StockService.getLogsById(stockId)
      if (error)
        throw new Error(error.message || "Gagal memuat pergerakan stok")
      return data || []
    },
    enabled: !!stockId,
  })
}

// ----- Mutations -----
type UpdateLokasiParams = { stockId: string; lokasi: StockLokasi }
type MutationContext = {
  previousAllStocks: StockRow[] | undefined
  previousTruckStocks: StockRow[] | undefined
  previousDetail: StockRow | null | undefined
}

export function useUpdateStockLokasiMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ stockId, lokasi }: UpdateLokasiParams) => {
      const { data, error } = await StockService.updateLokasi(stockId, lokasi)
      if (error) throw new Error(error.message || "Gagal update lokasi")
      return data
    },

    onMutate: async ({ stockId, lokasi }): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["stocks"] })

      // Snapshot previous states
      const previousAllStocks = queryClient.getQueryData<StockRow[]>(stockKeys.all())
      const previousTruckStocks = queryClient.getQueryData<StockRow[]>(stockKeys.truck())
      const previousDetail = queryClient.getQueryData<StockRow | null>(stockKeys.detail(stockId))

      // Optimistically update all stocks
      queryClient.setQueryData<StockRow[]>(stockKeys.all(), (old) =>
        old?.map((s) => (s.id === stockId ? { ...s, lokasi } : s))
      )

      // Optimistically update truck stocks
      queryClient.setQueryData<StockRow[]>(stockKeys.truck(), (old) => {
        if (!old) return old
        if (lokasi === "TRUK") {
          const exists = old.some((s) => s.id === stockId)
          if (exists) return old.map((s) => (s.id === stockId ? { ...s, lokasi } : s))
          const stockFromAll = previousAllStocks?.find((s) => s.id === stockId)
          return stockFromAll ? [...old, { ...stockFromAll, lokasi }] : old
        }
        return old.filter((s) => s.id !== stockId)
      })

      // Optimistically update detail if cached
      if (previousDetail) {
        queryClient.setQueryData<StockRow | null>(stockKeys.detail(stockId), {
          ...previousDetail,
          lokasi,
        })
      }

      return { previousAllStocks, previousTruckStocks, previousDetail }
    },

    onError: (_err, { stockId }, context) => {
      if (context?.previousAllStocks) {
        queryClient.setQueryData(stockKeys.all(), context.previousAllStocks)
      }
      if (context?.previousTruckStocks) {
        queryClient.setQueryData(stockKeys.truck(), context.previousTruckStocks)
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(stockKeys.detail(stockId), context.previousDetail)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] })
    },
  })
}
