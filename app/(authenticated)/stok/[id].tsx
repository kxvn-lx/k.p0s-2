import StockDetail from "@/features/stok/detail"
import { useLocalSearchParams, useNavigation } from "expo-router"
import type { StockRow } from "@/features/stok/api/stock.service"
import { Text } from "@/components/ui/text"
import { View } from "react-native"
import { useLayoutEffect } from "react"

export default function StockDetailRoute() {
  const params = useLocalSearchParams()
  const navigation = useNavigation()

  // ----- Parse stock data from route params -----
  let stock: StockRow | undefined
  if (params.stock) {
    try {
      stock = JSON.parse(String(params.stock)) as StockRow
    } catch (_) {
      stock = undefined
    }
  }

  // ----- Set navigation title to stock kode -----
  useLayoutEffect(() => {
    if (stock?.kode) {
      navigation.setOptions({
        title: stock.kode.toUpperCase(),
      })
    }
  }, [stock?.kode, navigation])

  // ----- Handle missing or invalid stock data -----
  if (!stock) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-destructive uppercase">Stok nd dapa</Text>
      </View>
    )
  }

  return <StockDetail stock={stock} />
}
