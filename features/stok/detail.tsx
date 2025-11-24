import { Text } from "@/components/ui/text"
import { ActivityIndicator, FlatList, View, Keyboard } from "react-native"
import type { StockLogRow, StockRow } from "./api/stock.service"
import { useStockLogsQuery } from "./hooks/stock.queries"
import StockDetailHeader from "./components/detail/stock-detail-header"
import StockLogItem from "./components/detail/stock-log-item"

export default function StockDetail({
  id,
  initialStock,
}: {
  id: string
  initialStock?: StockRow
}) {
  const stock = initialStock
  const { data: logs = [], isLoading: loadingLogs } = useStockLogsQuery(stock?.kode)

  // Mock data for preview.
  const MOCK_STOCK_LOGS: typeof logs = [
    { id: "log-001", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-24 09:15", tipe_pergerakan: "PEMBELIAN", masuk: 50, keluar: 0, stok_akhir: 150, nama_stock: stock?.nama ?? "Produk A", keterangan: "Restock lewat supplier A", reference_id: "pemb-01", reference_table: "pembelian", staff_id: "stf1", staff_name: "Andi", created_at: "2025-11-24T09:15:00Z" },
    { id: "log-002", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-23 16:42", tipe_pergerakan: "PENJUALAN", masuk: 0, keluar: 12, stok_akhir: 100, nama_stock: stock?.nama ?? "Produk A", keterangan: "Penjualan counter", reference_id: "penj-01", reference_table: "penjualan", staff_id: "stf2", staff_name: "Budi", created_at: "2025-11-23T16:42:00Z" },
    { id: "log-003", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-23 09:00", tipe_pergerakan: "MANUAL_MASUK", masuk: 25, keluar: 0, stok_akhir: 112, nama_stock: stock?.nama ?? "Produk A", keterangan: "Koreksi inventori", reference_id: null, reference_table: null, staff_id: "stf3", staff_name: "Cici", created_at: "2025-11-23T09:00:00Z" },
    { id: "log-004", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-22 14:10", tipe_pergerakan: "PENJUALAN", masuk: 0, keluar: 8, stok_akhir: 87, nama_stock: stock?.nama ?? "Produk A", keterangan: "Penjualan online", reference_id: "penj-02", reference_table: "penjualan", staff_id: "stf4", staff_name: "Dewi", created_at: "2025-11-22T14:10:00Z" },
    { id: "log-005", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-21 11:05", tipe_pergerakan: "PEMBELIAN", masuk: 100, keluar: 0, stok_akhir: 95, nama_stock: stock?.nama ?? "Produk A", keterangan: "Pengiriman drop ship", reference_id: "pemb-02", reference_table: "pembelian", staff_id: "stf1", staff_name: "Andi", created_at: "2025-11-21T11:05:00Z" },
    { id: "log-006", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-20 08:12", tipe_pergerakan: "MANUAL_KELUAR", masuk: 0, keluar: 5, stok_akhir: 10, nama_stock: stock?.nama ?? "Produk A", keterangan: "Sample keluar", reference_id: null, reference_table: null, staff_id: "stf5", staff_name: "Erik", created_at: "2025-11-20T08:12:00Z" },
    { id: "log-007", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-19 18:43", tipe_pergerakan: "PENJUALAN", masuk: 0, keluar: 20, stok_akhir: 15, nama_stock: stock?.nama ?? "Produk A", keterangan: "Bulk sale", reference_id: "penj-03", reference_table: "penjualan", staff_id: "stf2", staff_name: "Budi", created_at: "2025-11-19T18:43:00Z" },
    { id: "log-008", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-19 10:15", tipe_pergerakan: "PEMBELIAN", masuk: 40, keluar: 0, stok_akhir: 35, nama_stock: stock?.nama ?? "Produk A", keterangan: "Supplier B", reference_id: "pemb-03", reference_table: "pembelian", staff_id: "stf3", staff_name: "Cici", created_at: "2025-11-19T10:15:00Z" },
    { id: "log-009", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-18 12:00", tipe_pergerakan: "MANUAL_MASUK", masuk: 10, keluar: 0, stok_akhir: 5, nama_stock: stock?.nama ?? "Produk A", keterangan: "Adjust stock", reference_id: null, reference_table: null, staff_id: "stf6", staff_name: "Fajar", created_at: "2025-11-18T12:00:00Z" },
    { id: "log-010", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-17 09:33", tipe_pergerakan: "PENJUALAN", masuk: 0, keluar: 3, stok_akhir: -5, nama_stock: stock?.nama ?? "Produk A", keterangan: "Return processing", reference_id: "penj-04", reference_table: "penjualan", staff_id: "stf4", staff_name: "Dewi", created_at: "2025-11-17T09:33:00Z" },
    { id: "log-011", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-16 17:50", tipe_pergerakan: "PEMBELIAN", masuk: 200, keluar: 0, stok_akhir: 55, nama_stock: stock?.nama ?? "Produk A", keterangan: "Suplemen stok", reference_id: "pemb-04", reference_table: "pembelian", staff_id: "stf1", staff_name: "Andi", created_at: "2025-11-16T17:50:00Z" },
    { id: "log-012", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-15 13:25", tipe_pergerakan: "PENJUALAN", masuk: 0, keluar: 17, stok_akhir: 255, nama_stock: stock?.nama ?? "Produk A", keterangan: "Promo weekend", reference_id: "penj-05", reference_table: "penjualan", staff_id: "stf7", staff_name: "Gita", created_at: "2025-11-15T13:25:00Z" },
    { id: "log-013", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-14 08:00", tipe_pergerakan: "MANUAL_MASUK", masuk: 5, keluar: 0, stok_akhir: 272, nama_stock: stock?.nama ?? "Produk A", keterangan: "Tally correction", reference_id: null, reference_table: null, staff_id: "stf8", staff_name: "Hadi", created_at: "2025-11-14T08:00:00Z" },
    { id: "log-014", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-13 19:18", tipe_pergerakan: "PENJUALAN", masuk: 0, keluar: 30, stok_akhir: 267, nama_stock: stock?.nama ?? "Produk A", keterangan: "Event sale", reference_id: "penj-06", reference_table: "penjualan", staff_id: "stf2", staff_name: "Budi", created_at: "2025-11-13T19:18:00Z" },
    { id: "log-015", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-12 10:10", tipe_pergerakan: "PEMBELIAN", masuk: 100, keluar: 0, stok_akhir: 297, nama_stock: stock?.nama ?? "Produk A", keterangan: "Replenish mid-month", reference_id: "pemb-05", reference_table: "pembelian", staff_id: "stf1", staff_name: "Andi", created_at: "2025-11-12T10:10:00Z" },
    { id: "log-016", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-11 07:59", tipe_pergerakan: "MANUAL_KELUAR", masuk: 0, keluar: 2, stok_akhir: 197, nama_stock: stock?.nama ?? "Produk A", keterangan: "Sample for QA", reference_id: null, reference_table: null, staff_id: "stf5", staff_name: "Erik", created_at: "2025-11-11T07:59:00Z" },
    { id: "log-017", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-10 15:44", tipe_pergerakan: "PENJUALAN", masuk: 0, keluar: 9, stok_akhir: 195, nama_stock: stock?.nama ?? "Produk A", keterangan: "POS sale", reference_id: "penj-07", reference_table: "penjualan", staff_id: "stf9", staff_name: "Ika", created_at: "2025-11-10T15:44:00Z" },
    { id: "log-018", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-09 12:12", tipe_pergerakan: "PEMBELIAN", masuk: 60, keluar: 0, stok_akhir: 204, nama_stock: stock?.nama ?? "Produk A", keterangan: "Topup", reference_id: "pemb-06", reference_table: "pembelian", staff_id: "stf1", staff_name: "Andi", created_at: "2025-11-09T12:12:00Z" },
    { id: "log-019", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-08 09:18", tipe_pergerakan: "PENJUALAN", masuk: 0, keluar: 7, stok_akhir: 144, nama_stock: stock?.nama ?? "Produk A", keterangan: "Retail sale", reference_id: "penj-08", reference_table: "penjualan", staff_id: "stf2", staff_name: "Budi", created_at: "2025-11-08T09:18:00Z" },
    { id: "log-020", kode_stock: stock?.kode ?? "TEST01", tanggal: "2025-11-07 06:00", tipe_pergerakan: "MANUAL_MASUK", masuk: 1, keluar: 0, stok_akhir: 137, nama_stock: stock?.nama ?? "Produk A", keterangan: "Small correction", reference_id: null, reference_table: null, staff_id: "stf8", staff_name: "Hadi", created_at: "2025-11-07T06:00:00Z" },
  ]

  const previewLogs = (logs && logs.length) ? (logs as typeof logs) : MOCK_STOCK_LOGS

  if (!stock) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text>Tidak ditemukan</Text>
      </View>
    )
  }

  const header = <StockDetailHeader stock={stock} />

  if (loadingLogs)
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    )

  return (
    <View className="flex-1 bg-background">
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="never"
        onScrollBeginDrag={() => Keyboard.dismiss()}
        data={previewLogs as StockLogRow[]}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => <StockLogItem item={item as StockLogRow} />}
        ListEmptyComponent={() => (
          <View className="items-center mt-12">
            <Text className="text-muted-foreground">Belum ada pergerakan</Text>
          </View>
        )}
      />
    </View>
  )
}
