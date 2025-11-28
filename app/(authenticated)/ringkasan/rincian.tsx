import { View } from "react-native"
import { Stack, useLocalSearchParams } from "expo-router"
import { StatusMessage } from "@/components/shared/status-message"
import {
  usePenjualanDetail,
  usePembelianDetail,
  usePengeluaranDetail,
} from "@/features/ringkasan/hooks/ringkasan.queries"
import { PenjualanDetailContent } from "@/features/ringkasan/components/penjualan-detail-content"
import { PembelianDetailContent } from "@/features/ringkasan/components/pembelian-detail-content"
import { PengeluaranDetailContent } from "@/features/ringkasan/components/pengeluaran-detail-content"
import { formatDateTime } from "@/lib/utils"

type TransactionType = "penjualan" | "pembelian" | "pengeluaran"

export default function RincianPage() {
  const { id, type } = useLocalSearchParams<{
    id: string
    type: TransactionType
  }>()

  const penjualanQuery = usePenjualanDetail(type === "penjualan" ? id : "")
  const pembelianQuery = usePembelianDetail(type === "pembelian" ? id : "")
  const pengeluaranQuery = usePengeluaranDetail(
    type === "pengeluaran" ? id : ""
  )

  const query =
    type === "penjualan"
      ? penjualanQuery
      : type === "pembelian"
        ? pembelianQuery
        : pengeluaranQuery

  if (query.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <StatusMessage isLoading />
      </View>
    )
  }

  if (query.isError || !query.data) {
    return (
      <View className="flex-1 bg-background">
        <StatusMessage type="error" message="Gagal memuat rincian" />
      </View>
    )
  }

  if (type === "penjualan" && penjualanQuery.data) {
    return (
      <>
        <Stack.Screen
          options={{
            title: formatDateTime(penjualanQuery.data.header.tanggal, true),
          }}
        />
        <PenjualanDetailContent
          staffName={penjualanQuery.data.header.staff_name}
          tanggal={penjualanQuery.data.header.tanggal}
          jumlahTotal={penjualanQuery.data.header.jumlah_total}
          keterangan={penjualanQuery.data.header.keterangan}
          details={penjualanQuery.data.details}
        />
      </>
    )
  }

  if (type === "pembelian" && pembelianQuery.data) {
    return (
      <>
        <Stack.Screen
          options={{
            title: formatDateTime(pembelianQuery.data.header.tanggal, true),
          }}
        />
        <PembelianDetailContent
          staffName={pembelianQuery.data.header.staff_name}
          tanggal={pembelianQuery.data.header.tanggal}
          jumlahTotal={pembelianQuery.data.header.jumlah_total}
          details={pembelianQuery.data.details}
        />
      </>
    )
  }

  if (type === "pengeluaran" && pengeluaranQuery.data) {
    return (
      <>
        <Stack.Screen
          options={{
            title: formatDateTime(pengeluaranQuery.data.header.tanggal, true),
          }}
        />
        <PengeluaranDetailContent
          staffName={pengeluaranQuery.data.header.staff_name}
          tanggal={pengeluaranQuery.data.header.tanggal}
          jumlahTotal={pengeluaranQuery.data.header.jumlah_total}
          keterangan={pengeluaranQuery.data.header.keterangan}
          details={pengeluaranQuery.data.details}
        />
      </>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <StatusMessage type="error" message="Tipe transaksi tidak valid" />
    </View>
  )
}
