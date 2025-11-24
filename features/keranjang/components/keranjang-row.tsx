// ----- Keranjang row (read-only presentation) -----
import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import type { StockRow } from '@/features/stok/api/stock.service'

export default function KeranjangRow({
    stock,
    remaining,
    selectedQty,
    badgeNode,
}: {
    stock: StockRow
    remaining?: number
    selectedQty?: number
    badgeNode?: React.ReactNode
}) {
    const qty = remaining ?? stock.jumlah_stok ?? 0
    const low = qty <= 0
    const variasiCount = (stock as any).variasi_harga_barang?.length ?? 0

    return (
        <View
            testID={`keranjang-row-${stock.id}`}
            className="flex-row items-start justify-between p-2 bg-background"
        >
            <View className="flex-1 flex-col pr-2">
                <Text>{stock.nama}</Text>

                <View className="flex-row items-center gap-x-2">
                    <Text className={`font-medium ${low ? 'text-destructive' : 'text-foreground'}`}>
                        {qty}
                    </Text>
                    <Text className="text-muted-foreground text-xs uppercase">{stock.satuan_utama ?? '-'}</Text>
                    {variasiCount > 0 ? (
                        <Text className="text-xs text-muted-foreground ml-2">{variasiCount} variasi</Text>
                    ) : null}
                    {selectedQty ? (
                        badgeNode ?? (
                            <View className="ml-3 rounded-full bg-primary px-2 py-0.5">
                                <Text className="text-primary-foreground text-xs font-medium">{selectedQty}</Text>
                            </View>
                        )
                    ) : null}
                </View>
            </View>

            <View className="items-end">
                <Text className="font-medium">{stock.harga_jual ? `${stock.harga_jual.toLocaleString()}` : '-'}</Text>
            </View>
        </View>
    )
}
