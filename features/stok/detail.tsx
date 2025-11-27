import { Text } from "@/components/ui/text"
import { FlatList, View, Keyboard } from "react-native"
import type { StockLogRow, StockRow } from "./api/stock.service"
import { useStockLogsQuery } from "./hooks/stock.queries"
import StockDetailHeader from "./components/detail/stock-detail-header"
import StockLogItem from "./components/detail/stock-log-item"

export default function StockDetail({ stock }: { stock: StockRow }) {
  const { data: logs = [], isLoading: loadingLogs } = useStockLogsQuery(
    stock.id
  )

  if (loadingLogs) {
    return (
      <View className="flex-1 bg-background">
        <StockDetailHeader stock={stock} />
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
        data={logs}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={<StockDetailHeader stock={stock} />}
        renderItem={({ item }) => <StockLogItem item={item} />}
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
