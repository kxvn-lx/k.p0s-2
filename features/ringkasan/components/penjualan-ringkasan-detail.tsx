import { View } from "react-native"
import { SharedDetailContent } from "./shared-detail-content"
import { VariasiInfoDisplay } from "./variasi-info-display"
import { useVariationInfo } from "../hooks/ringkasan.queries"
import PerincianItem from "@/components/shared/perincian-item"
import type { PenjualanDetailRow } from "../api/ringkasan.service"

interface PenjualanRingkasanDetailProps {
    penjualanId: string
    staffName: string
    tanggal: string
    jumlahTotal: number
    keterangan: string | null
    details: PenjualanDetailRow[]
}

export function PenjualanRingkasanDetail({
    penjualanId,
    staffName,
    tanggal,
    jumlahTotal,
    keterangan,
    details,
}: PenjualanRingkasanDetailProps) {
    function DetailRow({ item }: { item: PenjualanDetailRow }) {
        const stockData = useVariationInfo(
            item.stock_id,
            item.harga_jual,
            item.variasi,
            "penjualan"
        )

        const hasVariation = !!stockData?.hasVariation
        const basePrice = stockData?.basePrice ?? item.harga_jual
        const appliedPrice = stockData?.appliedPrice ?? item.harga_jual

        return (
            <View className="p-2 bg-card">
                <PerincianItem
                    name={item.nama}
                    qty={item.qty}
                    unit={item.satuan_utama ?? ""}
                    price={appliedPrice}
                    originalPrice={basePrice}
                    isVariation={hasVariation}
                    total={item.jumlah_total}
                />

                {hasVariation && (
                    <View>
                        <VariasiInfoDisplay item={item} type="penjualan" />
                    </View>
                )}
            </View>
        )
    }

    return (
        <SharedDetailContent
            infoTitle="INFO TRANSAKSI"
            staffName={staffName}
            tanggal={tanggal}
            jumlahTotal={jumlahTotal}
            keterangan={keterangan}
            detailsTitle="STOK"
            details={details}
            idExtractor={(item) => item.id}
            renderDetail={(item) => <DetailRow item={item} />}
            receiptData={{ penjualanId, details }}
        />
    )
}
