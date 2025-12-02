import SearchInput from "@/components/shared/search-input"
import { Separator } from "@/components/ui/separator"
import { StatusMessage } from "@/components/shared/status-message"
import { useRouter } from "expo-router"
import { useCallback, useRef, useState } from "react"
import { FlatList, RefreshControl, View, Keyboard } from "react-native"
import type { StockRow } from "./api/stock.service"
import SwipeableStockRowWrapper from "./components/swipeable-stock-row-wrapper"
import type { SwipeableStockRowRef } from "./components/swipeable-stock-row"
import { useStocksQuery } from "./hooks/stock.queries"

export default function StockIndex() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const openRowRef = useRef<SwipeableStockRowRef | null>(null)

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useStocksQuery(query)

  const onRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  const handleSwipeOpen = useCallback((rowRef: SwipeableStockRowRef | null) => {
    if (openRowRef.current && openRowRef.current !== rowRef) {
      openRowRef.current.close()
    }
    openRowRef.current = rowRef
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: StockRow }) => (
      <SwipeableStockRowWrapper
        stock={item}
        onPress={() =>
          router.push(`/stok/${item.id}?stock=${encodeURIComponent(JSON.stringify(item))}`)
        }
        onSwipeOpen={handleSwipeOpen}
      />
    ),
    [router, handleSwipeOpen]
  )

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
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
        data={data as StockRow[]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Separator />}
        ListEmptyComponent={() => (
          <StatusMessage type="muted" message="Tidak ada hasil" className="mt-12" />
        )}
      />
    )
  }

  return (
    <View className="flex-1 bg-background">
      <SearchInput placeholder="Cari nama atau kode stok..." onSearch={setQuery} />
      {renderContent()}
    </View>
  )
}
