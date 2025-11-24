import SearchInput from "@/components/shared/search-input"
import { Separator } from "@/components/ui/separator"
import { StatusMessage } from "@/components/shared/status-message"
import { useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { FlatList, RefreshControl, View, Keyboard } from "react-native"
import type { StockRow } from "./api/stock.service"
import StockListRow from "./components/stock-row"
import { useStocksQuery } from "./hooks/stock.queries"

export default function StockIndex() {
  const router = useRouter()
  // query contains debounced search values emitted from SearchInput
  const [query, setQuery] = useState("")

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useStocksQuery(query)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }, [refetch])

  const renderContent = () => {
    if (isLoading) {
      return <StatusMessage isLoading />
    }

    if (isError) {
      return <StatusMessage type="error" message="Gagal memuat stok" />
    }

    return (
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="never"
        onScrollBeginDrag={() => Keyboard.dismiss()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isFetching}
            onRefresh={onRefresh}
          />
        }
        data={data as StockRow[]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockListRow
            stock={item}
            onPress={() =>
              router.push(`/stok/${item.id}?stock=${encodeURIComponent(
                JSON.stringify(item)
              )}`)
            }
          />
        )}
        ItemSeparatorComponent={() => <Separator />}
        ListEmptyComponent={() => (
          <StatusMessage
            type="muted"
            message="Tidak ada hasil"
            className="mt-12"
          />
        )}
      />
    )
  }

  return (
    <View className="flex-1 bg-background">
      <View>
        <SearchInput placeholder="Cari nama atau kode stok..." onSearch={setQuery} />
      </View>
      {renderContent()}
    </View>
  )
}
