import { Text } from "@/components/ui/text"
import { StockRow } from "@/features/keranjang/types/keranjang.types"
import { cn } from "@/lib/utils"
import { View } from "react-native"

export function StockDetailHeader({ stock }: { stock: StockRow }) {
  const isLowStock = (stock.jumlah_stok ?? 0) <= 0

  return (
    <View className="bg-background flex gap-2 px-2 pt-2">
      <View>
        <Text variant="muted" className="text-sm uppercase mx-4">
          detail stok
        </Text>
        <View className="rounded-[--radius] border border-border bg-card">
          <View className="flex-row items-center justify-between gap-x-2">
            <View className="gap-y-2 p-2">
              <View>
                <Text variant="h3" className="uppercase">
                  {stock.nama}
                </Text>
                <Text variant="muted" className="text-sm uppercase">
                  {stock.kode}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ----- Additional Info ----- */}
      <View className=" rounded-[--radius] border border-border bg-card p-2">
        <View className="flex-row gap-x-2">
          <View className="flex-1 rounded-[--radius] border border-border bg-background p-2">
            <Text variant="muted" className="text-sm uppercase">
              QTY
            </Text>
            <Text variant="h3" className={cn(isLowStock && "text-destructive")}>
              {stock.jumlah_stok}
            </Text>
            <Text variant="muted">{stock.satuan_utama}</Text>
          </View>
          <View className="flex-1 rounded-[--radius] border border-border bg-background p-2">
            <Text variant="muted" className="text-sm uppercase">
              Kategori
            </Text>
            <Text variant="h3">
              {stock.kategori ?? "-"}
            </Text>
          </View>
          <View className="flex-1 rounded-[--radius] border border-border bg-background p-2">
            <Text variant="muted" className="text-sm uppercase">
              Lokasi
            </Text>
            <Text variant="h3">
              {stock.lokasi ?? "-"}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-x-2">
          <View className="flex-1 rounded-[--radius] border border-border bg-background p-2">
            <Text variant="muted" className="text-sm uppercase">
              Harga Jual
            </Text>
            <Text variant="h3">
              {stock.harga_jual?.toLocaleString("id-ID") ?? "0"}
            </Text>
          </View>
          <View className="flex-1 rounded-[--radius] border border-border bg-background p-2">
            <Text variant="muted" className="text-sm uppercase">
              Harga Beli
            </Text>
            <Text variant="h3">
              {stock.harga_beli?.toLocaleString("id-ID") ?? "-"}
            </Text>
          </View>
        </View>
        <View className="mt-2 border-t border-border pt-4">
          <Text className="text-xs uppercase text-muted-foreground">
            Keterangan
          </Text>
          <Text className="text-sm">{stock.keterangan ?? "-"}</Text>
        </View>
      </View>

      {/* ----- Log Header Strip ----- */}
      <Text variant="muted" className="text-sm uppercase mx-4 mt-4">
        RIWAYAT PERGERAKAN
      </Text>
    </View>
  )
}

export default StockDetailHeader
