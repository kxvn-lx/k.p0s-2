import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import type { StockRow } from '@/features/stok/api/stock.service'

type Variation = { id: string; min_qty: number; harga_jual: number; satuan?: string }

type Props = {
    stock: StockRow
    options: Variation[]
    onSelectOriginal: () => void
    onSelectVariation: (v: Variation) => void
}

export default function VariationPopover({ stock, options, onSelectOriginal, onSelectVariation }: Props) {
    return (
        <View className="py-2">
            <Text className="font-medium mb-2">{stock.nama}</Text>
            <View className="py-1 border-t border-border" />

            <View className="flex-row justify-between items-center p-2">
                <View>
                    <Text className="text-xs text-muted-foreground">Minimal 1 {stock.satuan_utama ?? ''}</Text>
                    <Text className="font-medium">{stock.harga_jual?.toLocaleString() ?? '-'}</Text>
                </View>
                <Button size="sm" variant="outline" title="Pilih" onPress={onSelectOriginal} />
            </View>

            {options.map((v) => (
                <View key={v.id} className="flex-row justify-between items-center p-2">
                    <View>
                        <Text className="text-xs text-muted-foreground">Minimal {v.min_qty} {v.satuan ?? stock.satuan_utama ?? ''}</Text>
                        <View className="flex-row items-center gap-x-2">
                            <Text className="text-muted-foreground text-sm line-through">{stock.harga_jual?.toLocaleString()}</Text>
                            <Text className="text-sm text-green-600 font-medium">{v.harga_jual.toLocaleString()}</Text>
                        </View>
                    </View>

                    <Button size="sm" title={`Pilih ${v.min_qty}`} onPress={() => onSelectVariation(v)} />
                </View>
            ))}
        </View>
    )
}
