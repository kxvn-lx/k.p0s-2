import { View, ScrollView } from "react-native"
import { Text } from "@/components/ui/text"
import type { PengeluaranDetailRow } from "../api/ringkasan.service"
import { formatDateTime } from "@/lib/utils"

interface PengeluaranDetailContentProps {
    staffName: string
    tanggal: string
    jumlahTotal: number
    keterangan: string | null
    details: PengeluaranDetailRow[]
}

export function PengeluaranDetailContent({
    staffName,
    tanggal,
    jumlahTotal,
    keterangan,
    details,
}: PengeluaranDetailContentProps) {
    return (
        <ScrollView className="flex-1 bg-background">
            <View className="p-2 gap-2">
                <View className="border border-border bg-background">
                    <View className="bg-primary/10 p-2 border-b border-border">
                        <Text className="text-primary font-mono-bold uppercase text-xs tracking-wider">
                            INFO PENGELUARAN
                        </Text>
                    </View>
                    <View className="p-2 gap-2">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-muted-foreground font-mono text-xs uppercase">
                                STAFF
                            </Text>
                            <Text className="text-foreground font-mono-bold text-sm uppercase">
                                {staffName}
                            </Text>
                        </View>
                        <View className="h-[1px] bg-primary/20" />
                        <View className="flex-row justify-between items-center">
                            <Text className="text-muted-foreground font-mono text-xs uppercase">
                                TANGGAL
                            </Text>
                            <Text className="text-foreground font-mono text-sm uppercase">
                                {formatDateTime(tanggal, true, true)}
                            </Text>
                        </View>
                        <View className="h-[1px] bg-primary/20" />
                        <View className="flex-row justify-between items-center">
                            <Text className="text-muted-foreground font-mono text-xs uppercase">
                                TOTAL
                            </Text>
                            <Text className="text-red-500 font-mono-bold text-lg">
                                {jumlahTotal.toLocaleString("id-ID")}
                            </Text>
                        </View>
                        {keterangan && (
                            <>
                                <View className="h-[1px] bg-primary/20" />
                                <View>
                                    <Text className="text-muted-foreground font-mono text-xs uppercase mb-2">
                                        CATATAN
                                    </Text>
                                    <Text className="text-foreground font-mono text-sm uppercase">
                                        {keterangan}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                <View className="border border-border bg-background">
                    <View className="bg-primary/10 p-2 border-b border-border flex-row justify-between">
                        <Text className="text-primary font-mono-bold uppercase text-xs tracking-wider">
                            BARANG
                        </Text>
                        <Text className="text-primary font-mono-bold uppercase text-xs tracking-wider">
                            {details.length} BARANG
                        </Text>
                    </View>
                    <View>
                        {details.map((item, index) => (
                            <View key={item.id}>
                                {index > 0 && <View className="h-[1px] bg-primary/20" />}
                                <View className="p-2 gap-2">
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1 pr-2">
                                            <Text className="text-foreground font-mono-bold text-sm uppercase">
                                                {item.kategori}
                                            </Text>
                                            {item.keterangan && (
                                                <Text className="text-muted-foreground font-mono text-[10px] uppercase">
                                                    {item.keterangan}
                                                </Text>
                                            )}
                                        </View>

                                        <Text className="text-red-500 font-mono-bold text-sm">
                                            {item.jumlah_total.toLocaleString("id-ID")}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}
