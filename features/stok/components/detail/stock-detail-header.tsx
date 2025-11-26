import { Text } from "@/components/ui/text"
import { StockRow } from "@/features/keranjang/types/keranjang.types"
import { View } from "react-native"

export function StockDetailHeader({ stock }: { stock: StockRow }) {
  const isLowStock = (stock.jumlah_stok ?? 0) <= 0

  const tickerFields = [
    {
      label: "KATEGORI",
      value: stock.kategori ?? "-",
    },
    {
      label: "LOKASI",
      value: stock.lokasi ?? "-",
    },
    {
      label: "SATUAN",
      value: stock.satuan_utama ?? "-",
    },
  ]

  const quantityLabel = `${stock.jumlah_stok ?? 0} ${stock.satuan_utama ?? ""}`.trim()

  return (
    <View className="bg-background">
      <View className="rounded-2xl border border-border bg-secondary/20 p-4 mx-4 mt-4">
        <View className="flex-row items-start justify-between gap-x-4">
          <View className="flex-1 gap-y-2">
            <Text className="text-xs uppercase text-muted-foreground">
              detail stok
            </Text>
            <Text className="text-2xl font-semibold uppercase text-primary">
              {stock.nama}
            </Text>
            <Text className="text-xs uppercase text-muted-foreground">
              {stock.kode}
            </Text>
          </View>
          <View className="rounded-2xl border border-border bg-card px-4 py-4">
            <Text className="text-xs uppercase text-muted-foreground">Jumlah</Text>
            <Text className={`text-xl font-semibold text-right ${isLowStock ? "text-destructive" : "text-foreground"}`}>
              {quantityLabel}
            </Text>
            <Text className="text-xs uppercase text-muted-foreground">
              {stock.satuan_utama ?? "-"}
            </Text>
          </View>
        </View>
        <View className="mt-4 flex-row items-center justify-between gap-x-4 border-t border-border pt-4">
          {tickerFields.map((field) => (
            <View
              key={field.label}
              className="flex-1 rounded-2xl border border-border bg-background/20 px-4 py-2"
            >
              <Text className="text-xs uppercase text-muted-foreground">
                {field.label}
              </Text>
              <Text className="text-sm font-semibold text-foreground">
                {field.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ----- Additional Info ----- */}
      <View className="mx-4 mt-4 rounded-2xl border border-border bg-card p-4">
        <View className="flex-row gap-x-4">
          <View className="flex-1 rounded-2xl border border-border bg-background/50 p-4">
            <Text className="text-xs uppercase text-muted-foreground">
              Harga Jual
            </Text>
            <Text className="text-2xl font-semibold">
              Rp {stock.harga_jual?.toLocaleString("id-ID") ?? "0"}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl border border-border bg-background/50 p-4">
            <Text className="text-xs uppercase text-muted-foreground">
              Harga Beli
            </Text>
            <Text className="text-2xl font-semibold">
              Rp {stock.harga_beli?.toLocaleString("id-ID") ?? "-"}
            </Text>
          </View>
        </View>
        <View className="mt-4 border-t border-border pt-4">
          <Text className="text-xs uppercase text-muted-foreground">
            Keterangan
          </Text>
          <Text className="text-sm">{stock.keterangan ?? "-"}</Text>
        </View>
      </View>

      {/* ----- Log Header Strip ----- */}
      <View className="px-4 mt-4">
        <Text variant="muted" className="text-sm uppercase">
          RIWAYAT PERGERAKAN
        </Text>
      </View>
    </View>
  )
}

export default StockDetailHeader
