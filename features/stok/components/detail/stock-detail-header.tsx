import { Text } from "@/components/ui/text"
import { Stack } from "expo-router"
import { View } from "react-native"
import type { StockRow } from "../../api/stock.service"

// ----- Header for stock detail -----
export function StockDetailHeader({ stock }: { stock: StockRow }) {
    return (
        <View className="bg-background">
            <Stack.Screen
                options={{
                    title: stock.nama.toUpperCase(),
                    headerBackTitle: "Stok",
                }}
            />

            <View className="flex-row items-stretch gap-2 p-2">
                <View className="flex-1 border border-border rounded p-2 bg-card">
                    <Text className="text-xs text-amber-400">JUMLAH</Text>
                    <Text className="font-mono font-semibold text-xl mt-1 text-white">
                        {stock.jumlah_stok ?? 0}
                        <Text className="text-sm text-muted-foreground"> {stock.satuan_utama ?? ""}</Text>
                    </Text>
                </View>

                <View className="flex-1 border border-border rounded p-2 bg-card">
                    <Text className="text-xs text-amber-400">HARGA JUAL</Text>
                    <Text className="font-mono font-semibold text-xl mt-1 text-[#a8ffb0]">
                        Rp {stock.harga_jual?.toLocaleString() ?? "-"}
                    </Text>
                </View>

                <View className="flex-1 border border-border rounded p-2 bg-card">
                    <Text className="text-xs text-amber-400">LOKASI</Text>
                    <Text className="font-mono font-semibold text-xl mt-1 text-white">{stock.lokasi}</Text>
                </View>
            </View>

            <View className="mb-3">
                <Text variant="h3">Pergerakan Stok</Text>
                <Text className="text-sm text-muted-foreground mt-1">Riwayat mutasi untuk {stock.nama}</Text>
            </View>
        </View>
    )
}

export default StockDetailHeader
