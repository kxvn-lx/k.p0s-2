import StockDetail from '@/features/stok/detail'
import { useLocalSearchParams } from 'expo-router'

export default function StockDetailRoute() {
    const params = useLocalSearchParams()
    const id = String(params.id ?? '')

    return <StockDetail id={id} />
}
