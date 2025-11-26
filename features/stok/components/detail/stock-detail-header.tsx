import { Text } from "@/components/ui/text"
import { StockRow } from "@/features/keranjang/types/keranjang.types"
import { View } from "react-native"

export function StockDetailHeader({ stock }: { stock: StockRow }) {
  const isLowStock = (stock.jumlah_stok ?? 0) <= 0
  const margin =
    stock.harga_beli && stock.harga_jual
      ? ((stock.harga_jual - stock.harga_beli) / stock.harga_beli) * 100
      : 0

  return (
    <View className="bg-background border-b border-border">
      {/* ----- Top Banner: Name & Status ----- */}
      <View className="p-2 border-b border-border">
        <Text className="text-accent text-xs uppercase">{stock.kategori}</Text>
        <Text variant={"h3"}>{stock.nama}</Text>
      </View>

      {/* ----- Main Metrics Grid ----- */}
      <View className="flex-row border-b border-border">
        {/* Price Panel */}
        <View className="flex-1 p-2 border-r border-border">
          <Text variant="muted" className="text-xs uppercase">
            HARGA JUAL (IDR)
          </Text>
          <Text variant={"h3"}>
            {stock.harga_jual?.toLocaleString() ?? "0"}
          </Text>
        </View>

        {/* Qty Panel */}
        <View className="flex-1 p-2">
          <Text variant="muted" className="text-xs uppercase">
            Jumlah qty
          </Text>
          <View className="flex-row gap-x-2 items-center">
            <Text
              variant="h3"
              className={`${isLowStock ? "text-destructive" : "text-foreground"}`}
            >
              {stock.jumlah_stok ?? 0}
            </Text>
            <Text className="text-sm text-muted-foreground ">
              {stock.satuan_utama}
            </Text>
          </View>
        </View>
      </View>

      {/* ----- Secondary Metrics Grid (3 Columns) ----- */}
      <View className="flex-row border-b border-border">
        {/* Col 1: Buy Price */}
        <View className="flex-1 p-2 border-r border-border">
          <Text variant="muted" className="text-xs uppercase">
            Harga beli
          </Text>
          <Text variant="h3">{stock.harga_beli?.toLocaleString() ?? "-"}</Text>
        </View>

        {/* Col 2: Margin */}
        <View className="flex-1 p-2 border-r border-border">
          <Text variant="muted" className="text-xs uppercase">
            Margin
          </Text>
          <Text
            variant="h3"
            className={`font-mono text-sm mt-1 ${margin > 0 ? "text-[#a8ffb0]" : "text-muted-foreground"}`}
          >
            {margin ? `${Math.round(margin)}%` : "-"}
          </Text>
        </View>

        {/* Col 3: Location */}
        <View className="flex-1 p-2">
          <Text variant="muted" className="text-xs uppercase">
            LOKASI
          </Text>
          <Text variant="h3">{stock.lokasi}</Text>
        </View>
      </View>

      {/* ----- Tertiary Info (Full Width) ----- */}
      <View className="p-2 border-b border-border">
        <Text variant="muted" className="text-xs uppercase">
          Keterangan
        </Text>
        <Text>{stock.keterangan ?? "-"}</Text>
      </View>

      {/* ----- Log Header Strip ----- */}
      <View className="px-2 mt-4">
        <Text variant="muted" className="text-sm uppercase">
          RIWAYAT PERGERAKAN
        </Text>
      </View>
    </View>
  )
}

export default StockDetailHeader
