import { View, useWindowDimensions } from "react-native"
import { Text } from "@/components/ui/text"
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg"
import type { PenjualanResult } from "@/features/keranjang/types/penjualan-result.types"
import { formatDateIndonesian, formatTime } from "@/features/keranjang/hooks/use-print"

const STORE_NAME = "PIRAMID"

// ----- Divider Component -----
const Divider = () => {
    return (
        <View className="my-2 border-b border-dashed border-black w-full" />
    )
}

// ----- Receipt Content Component -----
interface IReceiptContent {
    result: PenjualanResult
    userEmail?: string | null
}

const ReceiptContent = ({ result, userEmail }: IReceiptContent) => {
    const date = new Date(result.penjualan.tanggal)
    const transactionNo = result.penjualan.id.substring(0, 6).toUpperCase()
    const staffName = result.penjualan.staff_name.split('@')[0].charAt(0).toUpperCase()

    return (
        <>
            <Text className="text-center text-black">{STORE_NAME}</Text>
            <Text className="font-mono text-center text-black">
                {formatDateIndonesian(date)} {formatTime(date)}
            </Text>
            <Divider />
            <View className="flex-row justify-between items-center">
                <Text className="font-mono text-black">No. #{transactionNo}</Text>
                <Text className="font-mono text-black">
                    {userEmail?.split("@")[0].slice(0, 1).toUpperCase() || staffName}
                </Text>
            </View>
            <Divider />
            {result.details?.map((item, index) => (
                <View key={index} className="mb-1 flex-row items-center">
                    <Text className="font-mono w-4 mr-1 text-black">
                        {item.qty.toString()}
                    </Text>
                    <Text
                        className="font-mono text-black"
                        numberOfLines={1}
                    >
                        {item.nama}
                    </Text>
                    <Text className="font-mono text-right w-16 mr-1 text-black">
                        {(item.harga_jual).toLocaleString("id-ID")}
                    </Text>
                    <Text className="font-mono text-right w-16 text-black">
                        {item.jumlah_total.toLocaleString("id-ID")}
                    </Text>
                </View>
            ))}
            <Divider />
            <View className="flex-row justify-between items-center">
                <Text className="font-mono text-black">Total</Text>
                <Text className="font-mono text-black">
                    {result.penjualan.jumlah_total.toLocaleString("id-ID")}
                </Text>
            </View>
            <Divider />
            <Text className="text-center font-mono mb-4 text-black">
                Makase Banya
            </Text>
        </>
    )
}

// ----- Main Component -----
interface IReceiptView {
    result: PenjualanResult
}

export function ReceiptPreview({ result }: IReceiptView) {
    return (
        <View className="flex-1 items-center justify-center">
            <View className="overflow-hidden">
                <View className="p-4 bg-white">
                    <ReceiptContent
                        result={result}
                        userEmail={null}
                    />
                </View>
            </View>
        </View>
    )
}

export default ReceiptPreview