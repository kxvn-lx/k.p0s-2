import { Text } from "@/components/ui/text"
import { View } from "react-native"
import type { StockLogRow } from "../../api/stock.service"
import { formatDateTime } from "@/lib/utils"

// ----- Single stock log row (Bloomberg Style) -----
export function StockLogItem({ item }: { item: StockLogRow }) {
  const delta = (item.masuk ?? 0) - (item.keluar ?? 0)
  const isPositive = delta > 0
  const isNegative = delta < 0
  const dateStr = formatDateTime(item.tanggal, true)

  return (
    <View
      testID={`log-${item.id}`}
      className="border-b border-border p-2 bg-background"
    >
      <View className="flex-row justify-between items-center">
        {/* Left: Time & Type */}
        <View className="flex-row items-center gap-2">
          <Text variant="muted" className="text-sm">
            {dateStr}
          </Text>
          <Text
            className={`text-sm uppercase ${item.tipe_pergerakan === "PEMBELIAN"
              ? "text-green-500"
              : item.tipe_pergerakan === "PENJUALAN"
                ? "text-red-500"
                : "text-foreground"
              }`}
          >
            {item.tipe_pergerakan}
          </Text>
        </View>

        {/* Right: Delta */}
        <Text
          className={`text-sm font-bold ${isPositive
            ? "text-green-500"
            : isNegative
              ? "text-red-500"
              : "text-muted-foreground"
            }`}
        >
          {delta > 0 ? `+${delta}` : delta}
        </Text>
      </View>

      <View className="flex-row justify-between items-center mt-1">
        {/* Left: Staff & Ref */}
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-bold uppercase">
            {item.staff_name || "SYSTEM"}
          </Text>
          {item.reference_id && (
            <Text className="text-sm font-bold uppercase">
              #{item.reference_id}
            </Text>
          )}
        </View>

        {/* Right: Balance */}
        <Text className="text-sm font-bold">SISA: {item.stok_akhir}</Text>
      </View>
    </View>
  )
}

export default StockLogItem
