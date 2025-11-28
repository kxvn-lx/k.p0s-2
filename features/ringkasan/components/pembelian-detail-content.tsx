import { View, ScrollView } from "react-native"
import { Text } from "@/components/ui/text"
import type { PembelianDetailRow } from "../api/ringkasan.service"
import { formatDateTime } from "@/lib/utils"

interface PembelianDetailContentProps {
    staffName: string
    tanggal: string
    jumlahTotal: number
    details: PembelianDetailRow[]
}

export function PembelianDetailContent({
    staffName,
    tanggal,
    jumlahTotal,
    details,
}: PembelianDetailContentProps) {
    return (
        <ScrollView className="flex-1 bg-background">
            <View className="p-2 gap-2">
                <View className="border border-border bg-background">
                    <View className="bg-primary/10 p-2 border-b border-border">
                        <Text className="text-primary font-mono-bold uppercase text-xs tracking-wider">
                            INFO PEMBELIAN
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
                            <Text className="text-blue-400 font-mono-bold text-lg">
                                {jumlahTotal.toLocaleString("id-ID")}
                            </Text>
                        </View>
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
                                                {item.nama}
                                            </Text>
                                            <Text className="text-muted-foreground font-mono text-[10px] uppercase">
                                                KODE: {item.kode_stock}
                                            </Text>
                                        </View>
                                        <Text className="text-blue-400 font-mono-bold text-sm">
                                            {item.jumlah_total.toLocaleString("id-ID")}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-muted-foreground font-mono text-xs uppercase">
                                            {item.qty} {item.satuan_utama || "PCS"} @ {item.harga_beli.toLocaleString("id-ID")}
                                        </Text>
                                    </View>
                                    {item.variasi && (
                                        <View className="bg-primary/5 p-2 border border-primary/20">
                                            <Text className="text-primary font-mono text-[10px] uppercase">
                                                VAR: {JSON.stringify(item.variasi)}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}
