import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import {
  RingkasanService,
  type PenjualanRow,
  type PembelianRow,
  type PengeluaranRow,
} from "../api/ringkasan.service"
import { ringkasanKeys } from "../api/ringkasan.keys"
import { StockService } from "@/features/stok/api/stock.service"
import type { Database } from "@/lib/types/supabase-types"

type VariasiHargaRow =
  Database["public"]["Tables"]["variasi_harga_barang"]["Row"]
type StockRow = Database["public"]["Tables"]["stock"]["Row"]

export type StockWithVariations = StockRow & {
  variasi_harga_barang?: VariasiHargaRow[] | null
}

export type VariationInfo = {
  hasVariation: boolean
  appliedVariation?: VariasiHargaRow
  basePrice: number
  appliedPrice: number
  savings?: number
  savingsPercentage?: number
}

export type TransactionItem = {
  id: string
  type: "penjualan" | "pembelian" | "pengeluaran"
  tanggal: string
  jumlah_total: number
  keterangan: string | null
  staff_name: string
}

export type RingkasanSummary = {
  grossPenjualan: number
  netPenjualan: number
  pengeluaran: number
  pembelian: number
}

export function useRingkasanData(startDate: string, endDate: string) {
  const penjualanQuery = useQuery({
    queryKey: ringkasanKeys.penjualan(startDate, endDate),
    queryFn: async () => {
      const { data, error } = await RingkasanService.getPenjualan(
        startDate,
        endDate
      )
      if (error) throw new Error(error.message || "Gagal memuat data penjualan")
      return data || []
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const pembelianQuery = useQuery({
    queryKey: ringkasanKeys.pembelian(startDate, endDate),
    queryFn: async () => {
      const { data, error } = await RingkasanService.getPembelian(
        startDate,
        endDate
      )
      if (error) throw new Error(error.message || "Gagal memuat data pembelian")
      return data || []
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const pengeluaranQuery = useQuery({
    queryKey: ringkasanKeys.pengeluaran(startDate, endDate),
    queryFn: async () => {
      const { data, error } = await RingkasanService.getPengeluaran(
        startDate,
        endDate
      )
      if (error)
        throw new Error(error.message || "Gagal memuat data pengeluaran")
      return data || []
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const summary = useMemo<RingkasanSummary>(() => {
    const grossPenjualan =
      penjualanQuery.data?.reduce((sum, item) => sum + item.jumlah_total, 0) ||
      0
    const totalPengeluaran =
      pengeluaranQuery.data?.reduce(
        (sum, item) => sum + item.jumlah_total,
        0
      ) || 0
    const totalPembelian =
      pembelianQuery.data?.reduce((sum, item) => sum + item.jumlah_total, 0) ||
      0

    return {
      grossPenjualan,
      netPenjualan: grossPenjualan - totalPengeluaran,
      pengeluaran: totalPengeluaran,
      pembelian: totalPembelian,
    }
  }, [penjualanQuery.data, pengeluaranQuery.data, pembelianQuery.data])

  const transactions = useMemo<TransactionItem[]>(() => {
    const allTransactions: TransactionItem[] = [
      ...(penjualanQuery.data?.map((item: PenjualanRow) => ({
        id: item.id,
        type: "penjualan" as const,
        tanggal: item.tanggal,
        jumlah_total: item.jumlah_total,
        keterangan: item.keterangan,
        staff_name: item.staff_name,
      })) || []),
      ...(pembelianQuery.data?.map((item: PembelianRow) => ({
        id: item.id,
        type: "pembelian" as const,
        tanggal: item.tanggal,
        jumlah_total: item.jumlah_total,
        keterangan: item.keterangan,
        staff_name: item.staff_name,
      })) || []),
      ...(pengeluaranQuery.data?.map((item: PengeluaranRow) => ({
        id: item.id,
        type: "pengeluaran" as const,
        tanggal: item.tanggal,
        jumlah_total: item.jumlah_total,
        keterangan: item.keterangan,
        staff_name: item.staff_name,
      })) || []),
    ]

    return allTransactions.sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    )
  }, [penjualanQuery.data, pembelianQuery.data, pengeluaranQuery.data])

  return {
    summary,
    transactions,
    isLoading:
      penjualanQuery.isLoading ||
      pembelianQuery.isLoading ||
      pengeluaranQuery.isLoading,
    isRefetching:
      penjualanQuery.isRefetching ||
      pembelianQuery.isRefetching ||
      pengeluaranQuery.isRefetching,
    isError:
      penjualanQuery.isError ||
      pembelianQuery.isError ||
      pengeluaranQuery.isError,
    refetch: async () => {
      await Promise.all([
        penjualanQuery.refetch(),
        pembelianQuery.refetch(),
        pengeluaranQuery.refetch(),
      ])
    },
  }
}

export function usePenjualanDetail(id: string) {
  return useQuery({
    queryKey: ringkasanKeys.penjualanDetail(id),
    queryFn: async () => {
      const { data, error } = await RingkasanService.getPenjualanDetail(id)
      if (error)
        throw new Error(error.message || "Gagal memuat detail penjualan")
      return data
    },
    enabled: !!id,
  })
}

export function usePembelianDetail(id: string) {
  return useQuery({
    queryKey: ringkasanKeys.pembelianDetail(id),
    queryFn: async () => {
      const { data, error } = await RingkasanService.getPembelianDetail(id)
      if (error)
        throw new Error(error.message || "Gagal memuat detail pembelian")
      return data
    },
    enabled: !!id,
  })
}

export function usePengeluaranDetail(id: string) {
  return useQuery({
    queryKey: ringkasanKeys.pengeluaranDetail(id),
    queryFn: async () => {
      const { data, error } = await RingkasanService.getPengeluaranDetail(id)
      if (error)
        throw new Error(error.message || "Gagal memuat detail pengeluaran")
      return data
    },
    enabled: !!id,
  })
}

// Hook for fetching stock with variations using TanStack Query best practices
export function useStockWithVariations(stockId: string | null) {
  const isValidId = !!stockId && /^[0-9a-fA-F-]{36}$/.test(stockId)

  return useQuery({
    queryKey: ["stock", "with-variations", stockId],
    queryFn: async () => {
      if (!stockId) return null
      const { data, error } = await StockService.getByIdWithVariations(stockId)
      if (error) throw new Error(error.message || "Gagal memuat data stock")
      if (!data) return null

      return data as StockWithVariations
    },
    enabled: isValidId,
    staleTime: 1000 * 60 * 10, // 10 minutes - stock data doesn't change frequently
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for computing variation information for display
export function useVariationInfo(
  stockId: string | null,
  currentPrice: number,
  variationData?: any,
  type?: "penjualan" | "pembelian"
) {
  const { data: stockData, isLoading } = useStockWithVariations(stockId)

  return useMemo(() => {
    // Return early if still loading or no data
    if (isLoading || !stockData) {
      return {
        hasVariation: false,
        basePrice: currentPrice,
        appliedPrice: currentPrice,
        isLoading: true,
      } as VariationInfo & { isLoading?: boolean }
    }

    const basePrice =
      type === "pembelian"
        ? stockData.harga_beli || 0
        : stockData.harga_jual || 0

    const hasVariation = currentPrice !== basePrice

    // Find the applied variation
    const appliedVariation = stockData.variasi_harga_barang?.find(
      (v) => v.harga_jual === currentPrice
    )

    return {
      hasVariation,
      appliedVariation,
      basePrice,
      appliedPrice: currentPrice,
    } as VariationInfo
  }, [stockData, currentPrice, variationData, type, isLoading])
}
