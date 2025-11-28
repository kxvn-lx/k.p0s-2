import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { SharedDetailContent } from "./shared-detail-content"
import { VariasiInfoDisplay } from "./variasi-info-display"
import type { PembelianDetailRow } from "../api/ringkasan.service"

interface PembelianRingkasanDetailProps {
    staffName: string
    tanggal: string
    jumlahTotal: number
    details: PembelianDetailRow[]
}

export function PembelianRingkasanDetail({
    staffName,
    tanggal,
    jumlahTotal,
    details,
}: PembelianRingkasanDetailProps) {
    const renderDetail = (item: PembelianDetailRow) => (
        <>
            <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-2">
                    <Text className="uppercase">
                        {item.nama}
                    </Text>
                </View>
                <Text>
                    {item.jumlah_total.toLocaleString("id-ID")}
                </Text>
            </View>
            <View className="flex-row items-center gap-x-1">
                <Text variant="muted" className="uppercase text-sm">
                    {item.qty} {item.satuan_utama}
                </Text>
                <Text className="text-accent">x</Text>
                <Text variant="muted" className="text-sm">{(item.harga_beli).toLocaleString("id-ID")}</Text>
            </View>
            <VariasiInfoDisplay item={item} type="pembelian" />
        </>
    )

    return (
        <SharedDetailContent
            infoTitle="INFO PEMBELIAN"
            staffName={staffName}
            tanggal={tanggal}
            jumlahTotal={jumlahTotal}
            detailsTitle="STOK"
            details={details}
            renderDetail={renderDetail}
        />
    )
}
