import { Text } from "@/components/ui/text"
import { SectionHeader } from "@/components/ui/section-header"
import { FlatList, View, Keyboard, RefreshControl } from "react-native"
import type { StockRow, StockLogRow } from "./api/stock.service"
import { useStockLogsQuery } from "./hooks/stock.queries"
import StockDetailHeader from "./components/detail/stock-detail-header"
import StockLogItem from "./components/detail/stock-log-item"
import { useCallback } from "react"

// ----- Stable Components -----
const ListEmpty = () => (
  <View className="items-center mt-12">
    <Text variant="muted" className="uppercase">Nd ada data</Text>
  </View>
)
const renderLogItem = ({ item }: { item: StockLogRow }) => <StockLogItem item={item} />

export default function StockDetail({ stock }: { stock: StockRow }) {
  const { data: logs = [], isLoading: loadingLogs, refetch, isRefetching } = useStockLogsQuery(
    stock.id
  )

  const onRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

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
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
          />
        }
        data={logs}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={
          <View>
            <StockDetailHeader stock={stock} />
            <SectionHeader title="PERGERAKAN STOK" className="mt-2" />
          </View>
        }
        renderItem={renderLogItem}
        ListEmptyComponent={ListEmpty}
      />
    </View>
  )
}
