import { View } from "react-native"
import { Text } from "@/components/ui/text"
import type { RingkasanSummary } from "../hooks/ringkasan.queries"

interface SummaryCardProps {
  summary: RingkasanSummary
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <View className="bg-background border-b border-border">
      <View className="p-4 border-b border-border border-dashed">
        <View className="flex-row justify-between items-end">
          <Text className="text-primary text-xs font-mono uppercase tracking-widest mb-2">
            POSISI BERSIH
          </Text>
          <Text className="text-muted-foreground text-[10px] font-mono uppercase">
            IDR
          </Text>
        </View>
        <Text
          className={`text-3xl font-mono-bold tracking-tighter ${summary.netPenjualan >= 0 ? "text-primary" : "text-destructive"
            }`}
        >
          {summary.netPenjualan.toLocaleString("id-ID")}
        </Text>
      </View>

      <View className="flex-row">
        <View className="flex-1 p-2 border-r border-border">
          <Text className="text-muted-foreground text-[10px] font-mono uppercase mb-2">
            KOTOR
          </Text>
          <Text className="text-primary font-mono-bold text-xs">
            {summary.grossPenjualan.toLocaleString("id-ID")}
          </Text>
        </View>

        <View className="flex-1 p-2 border-r border-border">
          <Text className="text-muted-foreground text-[10px] font-mono uppercase mb-2">
            PENGELUARAN
          </Text>
          <Text className="text-destructive font-mono-bold text-xs">
            {summary.pengeluaran.toLocaleString("id-ID")}
          </Text>
        </View>

        <View className="flex-1 p-2">
          <Text className="text-muted-foreground text-[10px] font-mono uppercase mb-2">
            PEMBELIAN
          </Text>
          <Text className="text-blue-400 font-mono-bold text-xs">
            {summary.pembelian.toLocaleString("id-ID")}
          </Text>
        </View>
      </View>
    </View>
  )
}
