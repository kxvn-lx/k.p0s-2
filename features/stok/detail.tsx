import { Text } from "@/components/ui/text"
import { Stack } from "expo-router"
import { ActivityIndicator, FlatList, View } from "react-native"
import type { StockLogRow } from "./api/stock.service"
import { useStockLogsQuery, useStockQuery } from "./hooks/stock.queries"

export default function StockDetail({ id }: { id: string }) {
  const { data: stock, isLoading: loadingStock } = useStockQuery(id)
  const { data: logs = [], isLoading: loadingLogs } = useStockLogsQuery(
    stock?.kode
  )

  if (loadingStock) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    )
  }

  if (!stock) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text>Tidak ditemukan</Text>
      </View>
    )
  }

  const header = (
    <View className="bg-background p-3 pb-4">
      <Stack.Screen
        options={{
          title: stock.nama.toUpperCase(),
          headerBackTitle: "Stok",
        }}
      />

      <View className="flex-row items-stretch gap-3 mb-4">
        <View className="flex-1 bg-card border border-border rounded p-3">
          <Text className="text-xs text-muted-foreground">Jumlah</Text>
          <Text className="font-mono font-semibold text-xl mt-1">
            {stock.jumlah_stok ?? 0}{" "}
            <Text className="text-sm text-muted-foreground">
              {stock.satuan_utama ?? ""}
            </Text>
          </Text>
        </View>

        <View className="flex-1 bg-card border border-border rounded p-3">
          <Text className="text-xs text-muted-foreground">Harga Jual</Text>
          <Text className="font-mono font-semibold text-xl mt-1">
            Rp {stock.harga_jual?.toLocaleString() ?? "-"}
          </Text>
        </View>

        <View className="flex-1 bg-card border border-border rounded p-3">
          <Text className="text-xs text-muted-foreground">Lokasi</Text>
          <Text className="font-mono font-semibold text-xl mt-1">
            {stock.lokasi}
          </Text>
        </View>
      </View>

      <View className="mb-3">
        <Text variant="h3">Pergerakan Stok</Text>
        <Text className="text-sm text-muted-foreground mt-1">
          Riwayat mutasi untuk {stock.nama}
        </Text>
      </View>
    </View>
  )

  if (loadingLogs)
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    )

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={logs as StockLogRow[]}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <View
            testID={`log-${item.id}`}
            className="bg-card border-b border-border p-3"
          >
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="font-semibold font-mono">{item.tanggal}</Text>
                <View className="mt-1 flex-row items-center gap-2">
                  <View className="rounded px-2 py-0.5 border border-border bg-secondary">
                    <Text className="text-xs uppercase font-mono">
                      {item.tipe_pergerakan}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted-foreground font-mono">
                    ID: {item.id}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text
                  className={`text-lg font-mono ${item.masuk && !item.keluar ? "text-accent" : item.keluar && !item.masuk ? "text-destructive" : "text-muted-foreground"} font-semibold`}
                >
                  {(item.masuk ?? 0) - (item.keluar ?? 0)}
                </Text>
                <Text className="text-xs text-muted-foreground mt-1">
                  Sisa:{" "}
                  <Text className="font-semibold font-mono">
                    {item.stok_akhir}
                  </Text>
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between mt-3">
              <Text className="text-sm font-mono">
                Masuk: <Text className="font-semibold">{item.masuk ?? 0}</Text>
              </Text>
              <Text className="text-sm font-mono">
                Keluar:{" "}
                <Text className="font-semibold">{item.keluar ?? 0}</Text>
              </Text>
              <Text className="text-sm font-mono">
                Sisa: <Text className="font-semibold">{item.stok_akhir}</Text>
              </Text>
            </View>

            {item.keterangan ? (
              <Text className="text-sm text-muted-foreground mt-2 font-mono">
                {item.keterangan}
              </Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-12">
            <Text className="text-muted-foreground">Belum ada pergerakan</Text>
          </View>
        )}
      />
    </View>
  )
}
