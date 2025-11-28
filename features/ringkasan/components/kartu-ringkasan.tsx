import { View } from "react-native"
import { Text } from "@/components/ui/text"
import type { RingkasanSummary } from "../hooks/ringkasan.queries"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
  summary: RingkasanSummary
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <View className="px-4 py-4 bg-muted/30">
      <View className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Main Header / Net Position */}
        <View className="p-5 border-b border-border/40">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-muted-foreground font-mono-medium text-[10px] uppercase tracking-wider">
              POSISI BERSIH (NET)
            </Text>
            <View className="bg-muted/50 px-2 py-1 rounded-md">
              <Text className="text-muted-foreground font-mono text-[10px]">
                IDR
              </Text>
            </View>
          </View>
          <Text
            className={cn(
              "text-4xl font-mono-bold tracking-tighter",
              summary.netPenjualan >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {summary.netPenjualan.toLocaleString("id-ID")}
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row divide-x divide-border/40">
          <View className="flex-1 p-4 gap-2 bg-muted/5">
            <Text className="text-muted-foreground font-mono-medium text-[10px] uppercase tracking-wider">
              KOTOR (GROSS)
            </Text>
            <Text className="text-foreground font-mono-bold text-sm">
              {summary.grossPenjualan.toLocaleString("id-ID")}
            </Text>
          </View>

          <View className="flex-1 p-4 gap-2 bg-muted/5">
            <Text className="text-muted-foreground font-mono-medium text-[10px] uppercase tracking-wider">
              PENGELUARAN
            </Text>
            <Text className="text-red-500 font-mono-bold text-sm">
              {summary.pengeluaran.toLocaleString("id-ID")}
            </Text>
          </View>

          <View className="flex-1 p-4 gap-2 bg-muted/5">
            <Text className="text-muted-foreground font-mono-medium text-[10px] uppercase tracking-wider">
              PEMBELIAN
            </Text>
            <Text className="text-cyan-500 font-mono-bold text-sm">
              {summary.pembelian.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
