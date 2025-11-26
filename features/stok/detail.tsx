import { Text } from "@/components/ui/text"
import { FlatList, View, Keyboard } from "react-native"
import type { StockLogRow, StockRow } from "./api/stock.service"
import { useStockLogsQuery } from "./hooks/stock.queries"
import StockDetailHeader from "./components/detail/stock-detail-header"
import StockLogItem from "./components/detail/stock-log-item"
import { generateMockLogs } from "./utils/generate-mock-logs"

export default function StockDetail({
  initialStock,
}: {
  initialStock?: StockRow
}) {
  // ----- Early return if no stock data -----
  if (!initialStock) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-destructive uppercase">Stok nd dapa</Text>
      </View>
    )
  }

  const { data: logs = [], isLoading: loadingLogs } = useStockLogsQuery(
    initialStock.kode
  )

  // ----- Use mock logs if DB is empty -----
  const displayLogs =
    logs.length > 0 ? logs : generateMockLogs(100, initialStock)

  const header = <StockDetailHeader stock={initialStock} />

  if (loadingLogs) {
    return (
      <View className="flex-1 bg-background">
        {header}
        <View className="flex-1 items-center justify-center">
          <Text className="animate-pulse uppercase">
            Mo ambe data pergerakan...
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="never"
        onScrollBeginDrag={() => Keyboard.dismiss()}
        data={displayLogs as StockLogRow[]}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => <StockLogItem item={item as StockLogRow} />}
        ListEmptyComponent={() => (
          <View className="items-center mt-12">
            <Text variant="muted" className="uppercase">
              Nd ada data
            </Text>
          </View>
        )}
      />
    </View>
  )
}
