import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import * as Crypto from "expo-crypto"
import {
  RingkasanService,
  type PenjualanDetailRow,
  type PembelianDetailRow,
  type PengeluaranDetailRow,
} from "../api/ringkasan.service"
import { TimPenjualanService, type TimPenjualanHarianRow } from "../api/tim-penjualan.service"
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
  details: PenjualanDetailRow[] | PembelianDetailRow[] | PengeluaranDetailRow[]
}

export type RingkasanSummary = {
  grossPenjualan: number
  netPenjualan: number
  pengeluaran: number
  pembelian: number
}

export type RingkasanHeaderData = {
  summary: RingkasanSummary
  timPenjualan: TimPenjualanHarianRow | null
}

// ----- Main Ringkasan Hook -----
export function useRingkasanData(startDate: string, endDate: string, currentDate: Date) {
  const dateKey = startDate.split("T")[0]


  const penjualanQuery = useQuery({
    queryKey: ringkasanKeys.penjualan(startDate, endDate),
    queryFn: async () => {
      const { data, error } = await RingkasanService.getPenjualan(startDate, endDate)
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
      const { data, error } = await RingkasanService.getPembelian(startDate, endDate)
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
      const { data, error } = await RingkasanService.getPengeluaran(startDate, endDate)
      if (error) throw new Error(error.message || "Gagal memuat data pengeluaran")
      return data || []
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  const timPenjualanQuery = useQuery({
    queryKey: ringkasanKeys.timPenjualan(dateKey),
    queryFn: async () => {
      const { data, error } = await TimPenjualanService.getByDate(startDate)
      if (error) throw new Error(error.message || "Gagal memuat tim penjualan")
      return data
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  // ----- Derived: Summary -----
  const summary = useMemo<RingkasanSummary>(() => {
    const grossPenjualan = penjualanQuery.data?.reduce((sum, item) => sum + item.jumlah_total, 0) || 0
    const totalPengeluaran = pengeluaranQuery.data?.reduce((sum, item) => sum + item.jumlah_total, 0) || 0
    const totalPembelian = pembelianQuery.data?.reduce((sum, item) => sum + item.jumlah_total, 0) || 0

    return {
      grossPenjualan,
      netPenjualan: grossPenjualan - totalPengeluaran,
      pengeluaran: totalPengeluaran,
      pembelian: totalPembelian,
    }
  }, [penjualanQuery.data, pengeluaranQuery.data, pembelianQuery.data])

  // ----- Derived: Header Data -----
  const headerData = useMemo<RingkasanHeaderData>(() => ({
    summary,
    timPenjualan: timPenjualanQuery.data ?? null,
  }), [summary, timPenjualanQuery.data])

  // ----- Derived: Transactions -----
  const transactions = useMemo<TransactionItem[]>(() => {
    const allTransactions: TransactionItem[] = [
      ...(penjualanQuery.data?.map((item) => ({
        id: item.id,
        type: "penjualan" as const,
        tanggal: item.tanggal,
        jumlah_total: item.jumlah_total,
        keterangan: item.keterangan,
        staff_name: item.staff_name,
        details: item.penjualan_detail || [],
      })) || []),
      ...(pembelianQuery.data?.map((item) => ({
        id: item.id,
        type: "pembelian" as const,
        tanggal: item.tanggal,
        jumlah_total: item.jumlah_total,
        keterangan: item.keterangan,
        staff_name: item.staff_name,
        details: item.pembelian_detail || [],
      })) || []),
      ...(pengeluaranQuery.data?.map((item) => ({
        id: item.id,
        type: "pengeluaran" as const,
        tanggal: item.tanggal,
        jumlah_total: item.jumlah_total,
        keterangan: item.keterangan,
        staff_name: item.staff_name,
        details: item.pengeluaran_detail || [],
      })) || []),
    ]

    return allTransactions.sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    )
  }, [penjualanQuery.data, pembelianQuery.data, pengeluaranQuery.data])

  return {
    headerData,
    currentDate,
    transactions,
    isLoading:
      penjualanQuery.isLoading ||
      pembelianQuery.isLoading ||
      pengeluaranQuery.isLoading,
    isLoadingTimPenjualan: timPenjualanQuery.isLoading,
    isRefetching:
      penjualanQuery.isRefetching ||
      pembelianQuery.isRefetching ||
      pengeluaranQuery.isRefetching ||
      timPenjualanQuery.isRefetching,
    isError:
      penjualanQuery.isError ||
      pembelianQuery.isError ||
      pengeluaranQuery.isError,
    refetch: async () => {
      await Promise.all([
        penjualanQuery.refetch(),
        pembelianQuery.refetch(),
        pengeluaranQuery.refetch(),
        timPenjualanQuery.refetch(),
      ])
    },
  }
}

// ----- Tim Penjualan Mutations -----
export function useTimPenjualanMutations(dateKey: string, currentDate: Date) {
  const queryClient = useQueryClient()
  const queryKey = ringkasanKeys.timPenjualan(dateKey)


  const createMutation = useMutation({
    mutationFn: async (payload: { staffId: string; staffName: string; rekan: string }) => {
      const { data, error } = await TimPenjualanService.create({
        date: currentDate.toISOString(),
        ...payload,
      })
      if (error) throw error
      return data
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<TimPenjualanHarianRow | null>(queryKey)

      queryClient.setQueryData<TimPenjualanHarianRow | null>(queryKey, {
        id: Crypto.randomUUID(),
        created_at: currentDate.toISOString(),
        staff_id: payload.staffId,
        staff_name: payload.staffName,
        rekan: payload.rekan,
        updated_at: new Date().toISOString(),
      })

      return { previous }
    },
    onError: (_error, _payload, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; staffId: string; staffName: string; rekan: string }) => {
      const { data, error } = await TimPenjualanService.update(payload.id, {
        staffId: payload.staffId,
        staffName: payload.staffName,
        rekan: payload.rekan,
      })
      if (error) throw error
      return data
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<TimPenjualanHarianRow | null>(queryKey)

      queryClient.setQueryData<TimPenjualanHarianRow | null>(queryKey, (old) => ({
        ...old!,
        staff_id: payload.staffId,
        staff_name: payload.staffName,
        rekan: payload.rekan,
        updated_at: new Date().toISOString(),
      }))

      return { previous }
    },
    onError: (_error, _payload, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await TimPenjualanService.delete(id)
      if (error) throw error
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<TimPenjualanHarianRow | null>(queryKey)
      queryClient.setQueryData<TimPenjualanHarianRow | null>(queryKey, null)
      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  }
}

// ----- Detail Hooks -----
export function usePenjualanDetail(id: string) {
  return useQuery({
    queryKey: ringkasanKeys.penjualanDetail(id),
    queryFn: async () => {
      const { data, error } = await RingkasanService.getPenjualanDetail(id)
      if (error) throw new Error(error.message || "Gagal memuat detail penjualan")
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
      if (error) throw new Error(error.message || "Gagal memuat detail pembelian")
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
      if (error) throw new Error(error.message || "Gagal memuat detail pengeluaran")
      return data
    },
    enabled: !!id,
  })
}

// ----- Stock Variation Hooks -----
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
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}

export function useVariationInfo(
  stockId: string | null,
  currentPrice: number,
  variationData?: unknown,
  type?: "penjualan" | "pembelian"
) {
  const { data: stockData, isLoading } = useStockWithVariations(stockId)

  return useMemo(() => {
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

// Re-export types
export type { TimPenjualanHarianRow } from "../api/tim-penjualan.service"
