import StockDetail from '@/features/stok/detail'
import { useLocalSearchParams } from 'expo-router'
import type { StockRow } from '@/features/stok/api/stock.service'

export default function StockDetailRoute() {
    const params = useLocalSearchParams()
    const id = String(params.id ?? '')

    let initialStock: StockRow | undefined
    if (params.stock) {
        try {
            initialStock = JSON.parse(String(params.stock)) as StockRow
        } catch (_) {
            initialStock = undefined
        }
    }

    return <StockDetail id={id} initialStock={initialStock} />
}
