import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import { StockRow } from "@/features/keranjang/types/keranjang.types"
import { cn, getLokasiColor } from "@/lib/utils"
import { Fragment } from "react"
import { View } from "react-native"

export function StockDetailHeader({ stock }: { stock: StockRow }) {
  const isLowStock = (stock.jumlah_stok ?? 0) <= 0

  return (
    <Fragment>
      <View className="bg-background flex gap-2 p-2">
        <Text variant="h2" className="uppercase text-center mt-8 mb-4">
          {stock.nama}
        </Text>

        {/* ----- Additional Info ----- */}
        <View className="gap-2">
          <View className="flex-row gap-x-1">
            <View className="flex-1 rounded-[--radius] border border-border p-2 bg-card">
              <Text variant="muted" className="text-xs uppercase">
                QTY
              </Text>
              <View className="flex-row items-center gap-1">
                <Text
                  variant="large"
                  className={cn(isLowStock && "text-destructive")}
                >
                  {stock.jumlah_stok}
                </Text>
                <Text variant="muted">{stock.satuan_utama}</Text>
              </View>
            </View>
            <View className="flex-1 rounded-[--radius] border border-border p-2 bg-card">
              <Text variant="muted" className="text-xs uppercase">
                Kategori
              </Text>
              <Text variant="large" className="uppercase">
                {stock.kategori ?? "-"}
              </Text>
            </View>
            <View className="flex-1 rounded-[--radius] border border-border p-2 bg-card">
              <Text variant="muted" className="text-xs uppercase">
                Lokasi
              </Text>
              <Text variant="large" className={cn(getLokasiColor(stock.lokasi))}>
                {stock.lokasi ?? "-"}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-x-1">
            <View className="flex-1 rounded-[--radius] border border-border p-2 bg-card">
              <Text variant="muted" className="text-xs uppercase">
                Harga Jual
              </Text>
              <Text variant="large">
                {stock.harga_jual?.toLocaleString("id-ID") ?? "0"}
              </Text>
            </View>
            <View className="flex-1 rounded-[--radius] border border-border p-2 bg-card">
              <Text variant="muted" className="text-xs uppercase">
                Harga Beli
              </Text>
              <Text variant="large">
                {stock.harga_beli?.toLocaleString("id-ID") ?? "-"}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text variant="muted" className="text-xs uppercase mx-2">
            Keterangan
          </Text>
          <Text className="text-sm">{stock.keterangan ?? "-"}</Text>
        </View>
      </View>

      <Separator />
    </Fragment>
  )
}

export default StockDetailHeader
