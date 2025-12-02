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

// ----- Zigzag Edge Component -----
const ZigzagEdge = ({ inverted = true }) => {
    const { width } = useWindowDimensions()
    const zigzagWidth = 7 // Width of a single zigzag
    const zigzagHeight = 3.5 // Height of the zigzag

    return (
        <Svg height={zigzagHeight} width={width}>
            <Defs>
                <Pattern
                    id="zigzag"
                    width={zigzagWidth}
                    height={zigzagHeight}
                    patternUnits="userSpaceOnUse"
                >
                    <Path
                        d={`M0 ${inverted ? zigzagHeight : 0}
                L${zigzagWidth / 2} ${inverted ? 0 : zigzagHeight}
                L${zigzagWidth} ${inverted ? zigzagHeight : 0}`}
                        fill="white"
                        stroke="white"
                        strokeWidth="1"
                    />
                </Pattern>
            </Defs>
            <Rect
                x="0"
                y="0"
                width={width}
                height={zigzagHeight}
                fill="url(#zigzag)"
            />
        </Svg>
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
            <Text className="font-mono text-center text-xs text-black">
                {formatDateIndonesian(date)} {formatTime(date)}
            </Text>
            <Divider />
            <View className="flex-row justify-between items-center">
                <Text className="font-mono text-xs text-black">No. #{transactionNo}</Text>
                <Text className="font-mono text-xs text-black">
                    {userEmail?.split("@")[0].slice(0, 1).toUpperCase() || staffName}
                </Text>
            </View>
            <Divider />
            {result.details?.map((item, index) => (
                <View key={index} className="mb-1 flex-row items-center">
                    <Text className="font-mono text-xs w-4 mr-1 text-black">
                        {item.qty.toString()}
                    </Text>
                    <Text
                        className="font-mono text-xs flex-1 truncate mr-1 text-black"
                        numberOfLines={1}
                    >
                        {item.nama}
                    </Text>
                    <Text className="font-mono text-xs text-right w-16 mr-1 text-black">
                        {(item.jumlah_total / item.qty).toLocaleString("id-ID")}
                    </Text>
                    <Text className="font-mono text-xs text-right w-16">
                        {item.jumlah_total.toLocaleString("id-ID")}
                    </Text>
                </View>
            ))}
            <Divider />
            <View className="flex-row justify-between items-center">
                <Text className="font-mono text-xs text-black">Total</Text>
                <Text className="font-mono text-xs text-black">
                    {result.penjualan.jumlah_total.toLocaleString("id-ID")}
                </Text>
            </View>
            {result.payment && (
                <>
                    <View className="flex-row justify-between items-center">
                        <Text className="font-mono text-xs">Tunai</Text>
                        <Text className="font-mono text-xs">
                            {result.payment.cashReceived.toLocaleString("id-ID")}
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text className="font-mono text-xs">Kembali</Text>
                        <Text className="font-mono text-xs">
                            {result.payment.change.toLocaleString("id-ID")}
                        </Text>
                    </View>
                </>
            )}
            <Divider />
            <Text className="text-center font-mono mb-4 text-xs">
                Terima Kasih
            </Text>
        </>
    )
}

// ----- Main Component -----
interface IReceiptView {
    result: PenjualanResult
    isPrinting: boolean
}

export function ReceiptPreview({ result, isPrinting }: IReceiptView) {
    return (
        <View className="flex-1 items-center justify-center">
            <View className="overflow-hidden">
                <ZigzagEdge />
                <View className="p-4 bg-white">
                    <ReceiptContent
                        result={result}
                        userEmail={null}
                    />
                </View>
                <ZigzagEdge inverted={false} />
            </View>
        </View>
    )
}

export default ReceiptPreview