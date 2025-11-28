import { View } from "react-native"
import { Text } from "@/components/ui/text"
import type { RingkasanSummary } from "../hooks/ringkasan.queries"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
    summary: RingkasanSummary
}

export function SummaryCard({ summary }: SummaryCardProps) {
    return (
        <View className="m-2 bg-background">
            <View className="bg-card border border-border rounded-[--radius] overflow-hidden">
                {/* Main Header / Net Position */}
                <View className="p-2 border-b border-border">
                    <View className="flex-row justify-between items-start">
                        <Text variant="muted" className="text-xs uppercase tracking-wider">
                            PENJUALAN BERSIH
                        </Text>
                    </View>
                    <Text
                        variant="h3"
                        className={cn(
                            "font-mono-bold tracking-tighter",
                        )}
                    >
                        {summary.netPenjualan.toLocaleString("id-ID")}
                    </Text>
                </View>

                {/* Stats Grid */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-1 p-2 bg-card">
                        <Text variant="muted" className="text-xs uppercase tracking-wider">
                            KOTOR
                        </Text>
                        <Text>
                            {summary.grossPenjualan.toLocaleString("id-ID")}
                        </Text>
                    </View>

                    <View className="flex-1 p-2 bg-card">
                        <Text variant="muted" className="text-xs uppercase tracking-wider">
                            PENGELUARAN
                        </Text>
                        <Text className="font-mono-bold text-sm">
                            {summary.pengeluaran.toLocaleString("id-ID")}
                        </Text>
                    </View>

                    <View className="flex-1 p-2 bg-card">
                        <Text variant="muted" className="text-xs uppercase tracking-wider">
                            PEMBELIAN
                        </Text>
                        <Text className="font-mono-bold text-sm">
                            {summary.pembelian.toLocaleString("id-ID")}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}
