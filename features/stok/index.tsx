import SearchInput from "@/components/shared/search-input"
import { Separator } from "@/components/ui/separator"
import { StatusMessage } from "@/components/shared/status-message"
import { useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { FlatList, RefreshControl, View, Keyboard } from "react-native"
import type { StockRow } from "./api/stock.service"
import SwipeableStockRow from "./components/swipeable-stock-row"
import StockRowContent from "./components/stock-row"
import { useStocksQuery } from "./hooks/stock.queries"
import { useCloseSwipeableOnScroll } from "@/lib/hooks/use-close-swipeable-on-scroll"
import { useAuth } from "@/lib/auth-context"

export default function StockIndex() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const { user } = useAuth()
  const isAdmin = user?.app_metadata?.role === "Admin"
  const { handleSwipeOpen, closeOpenRow } = useCloseSwipeableOnScroll()

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

  const renderItem = useCallback(
    ({ item }: { item: StockRow }) => {
      if (isAdmin) {
        return (
          <SwipeableStockRow
            stock={item}
            onPress={() => {
              router.push(`/stok/${item.id}?stock=${encodeURIComponent(JSON.stringify(item))}`)
            }}
            onSwipeOpen={handleSwipeOpen}
          />
        )
      }

      return (
        <StockRowContent
          stock={item}
          onPress={() => {
            router.push(`/stok/${item.id}?stock=${encodeURIComponent(JSON.stringify(item))}`)
          }}
        />
      )
    },
    [router, handleSwipeOpen, isAdmin]
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
        onScrollBeginDrag={() => {
          Keyboard.dismiss()
          closeOpenRow()
        }}
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
