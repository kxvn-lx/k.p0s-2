// ----- Stock list row -----
import { Text } from "@/components/ui/text"
import { View } from "react-native"
import PressableRow from '@/components/shared/pressable-row'
import type { StockRow } from "../api/stock.service"

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
      className="flex-row items-start justify-between p-2 bg-background active:bg-accent/10"
    >

      <View className="flex-1 flex-col pr-2">
        <Text>{stock.nama}</Text>
        {/* qty */}
        <View className="flex-row items-center gap-x-1">
          <Text
            className={`font-medium ${low ? "text-destructive" : "text-foreground"
              }`}
          >
            {qty}
          </Text>
          <Text className="text-muted-foreground text-xs uppercase">
            {stock.satuan_utama ?? "-"}
          </Text>
        </View>
      </View>


      <View className="items-end">
        <Text className="font-medium">
          {stock.harga_jual ? `${stock.harga_jual.toLocaleString()}` : "-"}
        </Text>
        <View>
          <Text className="text-xs uppercase">[{stock.lokasi}]</Text>
        </View>
      </View>
    </PressableRow>
  )
}
