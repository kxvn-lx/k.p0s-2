import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { useRouter } from "expo-router"
import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text as RNText,
  View,
} from "react-native"
import type { StockRow } from "./api/stock.service"
import StockListRow from "./components/StockRow"
import { useStocksQuery } from "./hooks/stock.queries"
import { useDebounce } from "./hooks/use-debounce"

export default function StockIndex() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 320)

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useStocksQuery(debouncedSearch)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }, [refetch])

  return (
    <View className="flex-1 bg-background p-4">
      <View className="mb-3">
        <Input
          placeholder="Cari nama atau kode stok"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center">
          <RNText className="text-destructive">Gagal memuat stok</RNText>
        </View>
      ) : (
        <FlatList
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
              onPress={() => router.push(`/stok/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View />}
          ListEmptyComponent={() => (
            <View className="items-center mt-12">
              <Text className="text-muted-foreground">Tidak ada hasil</Text>
            </View>
          )}
        />
      )}
    </View>
  )
}
