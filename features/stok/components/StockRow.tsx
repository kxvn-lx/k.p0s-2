// ----- Stock list row -----
import { Text } from "@/components/ui/text"
import { Pressable, View } from "react-native"
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
    <Pressable
      onPress={onPress}
      testID={`stock-row-${stock.id}`}
      className="bg-card border-b border-border px-3 py-3 flex-row items-center"
    >
      {/* left: identity */}
      <View className="flex-1">
        <Text className="text-xs text-muted-foreground uppercase tracking-tight">
          {stock.kode}
        </Text>
        <Text
          className="font-mono font-semibold text-sm mt-0.5"
          numberOfLines={1}
        >
          {stock.nama.toUpperCase()}
        </Text>
      </View>

      {/* center: quantity */}
      <View className="items-center px-3">
        <Text
          className={`text-lg ${low ? "text-destructive" : "text-foreground"} font-mono font-semibold`}
        >
          {qty}
        </Text>
        <Text className="text-xs text-muted-foreground mt-0.5">
          {stock.satuan_utama ?? ""}
        </Text>
      </View>

      {/* right: location + price */}
      <View className="items-end pl-2">
        <View className="px-2 py-0.5 rounded-full border border-border">
          <Text className="text-xs uppercase">{stock.lokasi ?? "TOKO"}</Text>
        </View>
        <Text className="text-xs text-muted-foreground mt-2">
          Rp {stock.harga_jual?.toLocaleString() ?? "-"}
        </Text>
      </View>
    </Pressable>
  )
}
