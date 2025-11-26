import StockDetail from "@/features/stok/detail"
import { useLocalSearchParams } from "expo-router"
import type { StockRow } from "@/features/stok/api/stock.service"

export default function StockDetailRoute() {
  const params = useLocalSearchParams()

  let initialStock: StockRow | undefined
  if (params.stock) {
    try {
      initialStock = JSON.parse(String(params.stock)) as StockRow
    } catch (_) {
      initialStock = undefined
    }
  }

  return <StockDetail initialStock={initialStock} />
}
