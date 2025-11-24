import { Text } from "@/components/ui/text"
import { View } from "react-native"
import type { StockLogRow } from "../../api/stock.service"

// ----- Single stock log row -----
export function StockLogItem({ item }: { item: StockLogRow }) {
    const delta = (item.masuk ?? 0) - (item.keluar ?? 0)

    return (
        <View testID={`log-${item.id}`} className="border-b border-border p-2 bg-[#070707]">
            <View className="flex-row justify-between items-start">
                <View>
                    <Text className="font-mono text-sm text-amber-300 font-semibold">{item.tanggal}</Text>
                    <View className="mt-1 flex-row items-center gap-2">
                        <View className="rounded px-2 py-0.5 border border-border bg-[#1b1b1b]">
                            <Text className="text-xs uppercase font-mono text-amber-400">{item.tipe_pergerakan}</Text>
                        </View>
                        <Text className="text-xs text-muted-foreground font-mono">ID: {item.id}</Text>
                    </View>
                </View>

                <View className="items-end">
                    <Text className="text-lg font-mono text-right font-semibold" style={{ letterSpacing: 0.4 }}>
                        <Text className={delta > 0 ? "text-[#66ff9c]" : delta < 0 ? "text-[#ff6b6b]" : "text-muted-foreground"}>{delta}</Text>
                    </Text>
                    <Text className="text-xs text-muted-foreground mt-1">
                        Sisa: <Text className="font-semibold font-mono">{item.stok_akhir}</Text>
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-between mt-3">
                <Text className="text-sm font-mono">Masuk: <Text className="font-semibold text-[#66ff9c]">{item.masuk ?? 0}</Text></Text>
                <Text className="text-sm font-mono">Keluar: <Text className="font-semibold text-[#ff6b6b]">{item.keluar ?? 0}</Text></Text>
                <Text className="text-sm font-mono">Sisa: <Text className="font-semibold">{item.stok_akhir}</Text></Text>
            </View>

            {item.keterangan ? (
                <Text className="text-sm text-muted-foreground mt-2 font-mono">{item.keterangan}</Text>
            ) : null}
        </View>
    )
}

export default StockLogItem
