import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { SharedDetailContent } from "./shared-detail-content"
import type { PengeluaranDetailRow } from "../api/ringkasan.service"

interface PengeluaranRingkasanDetailProps {
    staffName: string
    tanggal: string
    jumlahTotal: number
    keterangan: string | null
    details: PengeluaranDetailRow[]
}

export function PengeluaranRingkasanDetail({
    staffName,
    tanggal,
    jumlahTotal,
    keterangan,
    details,
}: PengeluaranRingkasanDetailProps) {
    const renderDetail = (item: PengeluaranDetailRow) => (
        <>
            <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-2">
                    <Text className="uppercase">
                        {item.kategori}
                    </Text>
                    {item.keterangan && (
                        <Text variant="muted" className="text-sm">
                            {item.keterangan}
                        </Text>
                    )}
                </View>
                <Text>
                    {item.jumlah_total.toLocaleString("id-ID")}
                </Text>
            </View>
        </>
    )

    return (
        <SharedDetailContent
            infoTitle="INFO PENGELUARAN"
            staffName={staffName}
            tanggal={tanggal}
            jumlahTotal={jumlahTotal}
            keterangan={keterangan}
            detailsTitle="KATEGORI"
            details={details}
            renderDetail={renderDetail}
        />
    )
}
