import React from "react"
import { View, ScrollView } from "react-native"
import { Text } from "@/components/ui/text"
import { formatDateTime } from "@/lib/utils"
import InfoRow from "@/components/shared/info-row"
import { Separator } from "@/components/ui/separator"
import { SectionHeader } from "@/components/ui/section-header"

interface SharedDetailContentProps<T> {
    infoTitle: string
    staffName: string
    tanggal: string
    jumlahTotal: number
    keterangan?: string | null
    detailsTitle: string
    details: T[]
    idExtractor: (item: T) => string
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
    idExtractor,
    renderDetail,
}: SharedDetailContentProps<T>) {
    return (
        <ScrollView className="flex-1 bg-background">
            <View className="gap-4">
                <View>
                    <SectionHeader title={infoTitle} />
                    <View className="bg-card">
                        <InfoRow
                            primarySide="trailing"
                            leadingElement="STAFF"
                            trailingElement={<Text className="uppercase text-foreground">{staffName}</Text>}
                        />
                        <InfoRow
                            primarySide="trailing"
                            leadingElement="TANGGAL"
                            trailingElement={<Text className="uppercase text-foreground">{formatDateTime(tanggal, true, true)}</Text>}
                        />
                        <InfoRow
                            leadingElement="TOTAL"
                            trailingElement={jumlahTotal.toLocaleString("id-ID")}
                            primarySide="trailing"
                        />
                        <InfoRow leadingElement="KETERANGAN" trailingElement={keterangan ?? "-"} primarySide="trailing" />
                    </View>
                </View>

                <View>
                    <SectionHeader title={detailsTitle} secondary={`${details.length} ITEM`} />
                    {details.map((item, index) => (
                        <View key={idExtractor(item)}>
                            {index > 0 && <Separator />}
                            <View>
                                {renderDetail(item)}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}