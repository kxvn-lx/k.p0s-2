import React from "react"
import { View, ScrollView } from "react-native"
import { Text } from "@/components/ui/text"
import { formatDateTime } from "@/lib/utils"
import InfoRow from "@/components/shared/info-row"
import { Separator } from "@/components/ui/separator"

interface SharedDetailContentProps<T> {
    infoTitle: string
    staffName: string
    tanggal: string
    jumlahTotal: number
    keterangan?: string | null
    detailsTitle: string
    details: T[]
    renderDetail: (item: T) => React.ReactElement
}

export function SharedDetailContent<T>({
    infoTitle,
    staffName,
    tanggal,
    jumlahTotal,
    keterangan,
    detailsTitle,
    details,
    renderDetail,
}: SharedDetailContentProps<T>) {
    return (
        <ScrollView className="flex-1 bg-background">
            <View className="p-2 gap-2">
                <View>
                    <View className="px-4 py-2">
                        <Text variant="muted" className="font-mono-bold text-xs uppercase tracking-wider">
                            {infoTitle}
                        </Text>
                    </View>
                    <View className="bg-card rounded-[--radius] overflow-hidden border border-border">
                        <InfoRow
                            label="STAFF"
                            value={staffName}
                            valueClassName="uppercase"
                        />
                        <InfoRow
                            label="TANGGAL"
                            value={formatDateTime(tanggal, true, true)}
                            valueClassName="uppercase "
                        />
                        <InfoRow
                            label="TOTAL"
                            value={jumlahTotal.toLocaleString("id-ID")}
                        />
                        <View className="p-2">
                            <Text variant="muted" className="text-sm">
                                KETERANGAN
                            </Text>
                            <Text className="text-foreground text-sm uppercase">
                                {keterangan ?? "-"}
                            </Text>
                        </View>
                    </View>
                </View>

                <View >
                    <View className="px-4 py-2 flex-row justify-between">
                        <Text variant="muted" className="font-mono-bold text-xs uppercase tracking-wider">
                            {detailsTitle}
                        </Text>
                        <Text variant="muted" className="font-mono-bold text-xs uppercase tracking-wider">
                            {details.length} ITEM
                        </Text>
                    </View>
                    <View className="bg-card rounded-[--radius] border border-border">
                        {details.map((item, index) => (
                            <View key={(item as any).id}>
                                {index > 0 && <Separator />}
                                <View className="p-2 ap-2">
                                    {renderDetail(item)}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}