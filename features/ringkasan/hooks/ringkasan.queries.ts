import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import {
  RingkasanService,
  type PenjualanRow,
  type PembelianRow,
  type PengeluaranRow,
} from "../api/ringkasan.service"
import { ringkasanKeys } from "../api/ringkasan.keys"

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
      penjualanQuery.data?.reduce((sum, item) => sum + item.jumlah_total, 0) || 0
    const totalPengeluaran =
      pengeluaranQuery.data?.reduce((sum, item) => sum + item.jumlah_total, 0) || 0
    const totalPembelian =
      pembelianQuery.data?.reduce((sum, item) => sum + item.jumlah_total, 0) || 0

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
    isError:
      penjualanQuery.isError ||
      pembelianQuery.isError ||
      pengeluaranQuery.isError,
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
