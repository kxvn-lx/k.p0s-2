import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { SharedDetailContent } from "./shared-detail-content"
import { VariasiInfoDisplay } from "./variasi-info-display"
import PerincianItem from "@/components/shared/perincian-item"
import { useVariationInfo } from "../hooks/ringkasan.queries"
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
    function DetailRow({ item }: { item: PembelianDetailRow }) {
        const stockData = useVariationInfo(
            item.stock_id,
            item.harga_beli,
            item.variasi,
            "pembelian"
        )

        const hasVariation = !!stockData?.hasVariation
        const basePrice = stockData?.basePrice ?? item.harga_beli
        const appliedPrice = stockData?.appliedPrice ?? item.harga_beli

        return (
            <>
                <PerincianItem
                    name={item.nama}
                    qty={item.qty}
                    unit={item.satuan_utama ?? ""}
                    price={appliedPrice}
                    originalPrice={basePrice}
                    isVariation={hasVariation}
                    total={item.jumlah_total}
                />

                <View className="mt-2">
                    <VariasiInfoDisplay item={item} type="pembelian" />
                </View>
            </>
        )
    }

    return (
        <SharedDetailContent
            infoTitle="INFO PEMBELIAN"
            staffName={staffName}
            tanggal={tanggal}
            jumlahTotal={jumlahTotal}
            detailsTitle="STOK"
            details={details}
            idExtractor={(item) => item.id}
            renderDetail={(item) => <DetailRow item={item} />}
        />
    )
}
