import { View } from "react-native"
import { Stack, useLocalSearchParams } from "expo-router"
import { StatusMessage } from "@/components/shared/status-message"
import { PenjualanRingkasanDetail } from "@/features/ringkasan/components/penjualan-ringkasan-detail"
import { PembelianRingkasanDetail } from "@/features/ringkasan/components/pembelian-ringkasan-detail"
import { PengeluaranRingkasanDetail } from "@/features/ringkasan/components/pengeluaran-ringkasan-detail"
import { formatDateTime } from "@/lib/utils"
import type { TransactionItem } from "@/features/ringkasan/hooks/ringkasan.queries"
import type { PenjualanDetailRow, PembelianDetailRow, PengeluaranDetailRow } from "@/features/ringkasan/api/ringkasan.service"

export default function RincianPage() {
  const { transaction } = useLocalSearchParams<{
    transaction: string
  }>()

  // ----- Parse transaction data from route params -----
  let parsedTransaction: TransactionItem | null = null
  if (transaction) {
    try {
      parsedTransaction = JSON.parse(decodeURIComponent(transaction)) as TransactionItem
    } catch (_) {
      parsedTransaction = null
    }
  }

  // ----- Handle missing or invalid transaction data -----
  if (!parsedTransaction) {
    return (
      <View className="flex-1 bg-background">
        <StatusMessage type="error" message="Data transaksi tidak valid" />
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: formatDateTime(parsedTransaction.tanggal, true),
        }}
      />
      {parsedTransaction.type === "penjualan" && (
        <PenjualanRingkasanDetail
          penjualanId={parsedTransaction.id}
          staffName={parsedTransaction.staff_name}
          tanggal={parsedTransaction.tanggal}
          jumlahTotal={parsedTransaction.jumlah_total}
          keterangan={parsedTransaction.keterangan}
          details={parsedTransaction.details as PenjualanDetailRow[]}
        />
      )}
      {parsedTransaction.type === "pembelian" && (
        <PembelianRingkasanDetail
          staffName={parsedTransaction.staff_name}
          tanggal={parsedTransaction.tanggal}
          jumlahTotal={parsedTransaction.jumlah_total}
          details={parsedTransaction.details as PembelianDetailRow[]}
        />
      )}
      {parsedTransaction.type === "pengeluaran" && (
        <PengeluaranRingkasanDetail
          staffName={parsedTransaction.staff_name}
          tanggal={parsedTransaction.tanggal}
          jumlahTotal={parsedTransaction.jumlah_total}
          keterangan={parsedTransaction.keterangan}
          details={parsedTransaction.details as PengeluaranDetailRow[]}
        />
      )}
    </>
  )
}
