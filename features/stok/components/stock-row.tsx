// ----- Stock list row -----
import { Text } from "@/components/ui/text"
import { View } from "react-native"
import PressableRow from '@/components/shared/pressable-row'
import type { StockRow } from "../api/stock.service"
import { cn, getLokasiColor } from "@/lib/utils"
import { Icon } from '@/components/ui/icon'
import { ChevronRight } from 'lucide-react-native'

export default function StockRow({
  stock,
  onPress,
}: {
  stock: StockRow
  onPress?: () => void
}) {
  const qty = stock.jumlah_stok ?? 0
  const low = qty <= 0

  return (
    <PressableRow
      onPress={onPress}
      testID={`stock-row-${stock.id}`}
      className="flex-row items-center justify-between p-2 bg-background"
    >

      <View className="flex-1 flex-col pr-2">
        <Text>{stock.nama}</Text>
        {/* qty */}
        <View className="flex-row items-center gap-x-1">
          <Text
            className={`${low ? "text-destructive" : "text-foreground"
              }`}
          >
            {qty}
          </Text>
          <Text variant="muted" className="text-sm uppercase">
            {stock.satuan_utama ?? "-"}
          </Text>
        </View>
      </View>


      <View className="flex-row items-center gap-x-2">
        <View className="items-end">
          <Text>
            {stock.harga_jual ? `${stock.harga_jual.toLocaleString()}` : "-"}
          </Text>

          <View>
            <Text className={cn("text-sm uppercase", getLokasiColor(stock.lokasi))}>[{stock.lokasi}]</Text>
          </View>
        </View>

        <Icon as={ChevronRight} size={20} className="text-muted-foreground/50" />
      </View>
    </PressableRow>
  )
}
