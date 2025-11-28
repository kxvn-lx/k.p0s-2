import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { useVariationInfo } from "../hooks/ringkasan.queries"
import type { Database } from "@/lib/types/supabase-types"

type PenjualanDetailRow =
    Database["public"]["Tables"]["penjualan_detail"]["Row"]
type PembelianDetailRow =
    Database["public"]["Tables"]["pembelian_detail"]["Row"]

interface VariasiInfoDisplayProps {
    item: PenjualanDetailRow | PembelianDetailRow
    type: "penjualan" | "pembelian"
}

export function VariasiInfoDisplay({ item, type }: VariasiInfoDisplayProps) {
    const currentPrice =
        type === "penjualan"
            ? (item as PenjualanDetailRow).harga_jual
            : (item as PembelianDetailRow).harga_beli

    const stockData = useVariationInfo(
        item.stock_id,
        currentPrice,
        item.variasi,
        type
    )

    if (!stockData?.hasVariation) {
        return null
    }

    const { basePrice, appliedPrice } = stockData
    const minQty = stockData.appliedVariation?.min_qty ?? "-"
    const unit = stockData.appliedVariation?.satuan ?? item.satuan_utama ?? "-"

    return (
        <View className="flex-row items-center justify-between border-border border bg-background p-2 rounded-[--radius]">
            {/* Left: Price Data */}
            <View className="flex-row items-baseline gap-2">
                <Text variant="muted" className="text-xs line-through">
                    {basePrice.toLocaleString("id-ID")}
                </Text>
                <Text className="text-xs">
                    {appliedPrice.toLocaleString("id-ID")}
                </Text>
            </View>

            {/* Right: Meta Data */}
            <View className="items-end">
                <Text variant="muted" className="text-xs">
                    MIN {minQty} {unit}
                </Text>
            </View>
        </View>
    )
}
