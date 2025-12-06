import { View, StyleSheet } from "react-native"
import { Text } from "@/components/ui/text"
import type { PenjualanResult } from "@/features/keranjang/types/penjualan-result.types"
import {
  formatDateIndonesian,
  formatTime,
} from "@/features/keranjang/hooks/use-print"

// ----- Constants -----
const STORE_NAME = "PIRAMID"

// ----- Styles -----
const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  qtyCol: {
    width: 15,
    marginRight: 8,
  },
  namaCol: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  satuanCol: {
    width: 60,
    marginRight: 8,
  },
  totalCol: {
    width: 60,
  },
})

// ----- Divider Component -----
const Divider = () => {
  return <View className="my-1 border-b border-dashed border-black w-full" />
}

// ----- Receipt Content Component -----
interface IReceiptContent {
  result: PenjualanResult
}

const ReceiptContent = ({ result }: IReceiptContent) => {
  const date = new Date(result.penjualan.tanggal)
  const transactionNo = result.penjualan.id.substring(0, 6).toUpperCase()
  const staffName = result.penjualan.staff_name
    .split("@")[0]
    .charAt(0)
    .toUpperCase()

  return (
    <>
      <Text className="text-center text-black font-semibold">{STORE_NAME}</Text>
      <Text className="font-mono text-center text-black text-xs">
        {formatDateIndonesian(date)} {formatTime(date)}
      </Text>
      <Divider />
      <View className="flex-row justify-between">
        <Text className="font-mono text-black text-xs">
          No. #{transactionNo}
        </Text>
        <Text className="font-mono text-black text-xs">{staffName}</Text>
      </View>
      <Divider />
      {result.details?.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.qtyCol}>
            <Text className="font-mono text-black text-xs text-right">
              {item.qty}
            </Text>
          </View>
          <View style={styles.namaCol}>
            <Text
              className="font-mono text-black text-xs"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.nama}
            </Text>
          </View>
          <View style={styles.satuanCol}>
            <Text className="font-mono text-black text-xs text-right">
              {item.harga_jual.toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={styles.totalCol}>
            <Text className="font-mono text-black text-xs text-right">
              {item.jumlah_total.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
      ))}
      <Divider />
      <View className="flex-row justify-between">
        <Text className="font-mono text-black text-xs">Total</Text>
        <Text className="font-mono text-black text-xs">
          {result.penjualan.jumlah_total.toLocaleString("id-ID")}
        </Text>
      </View>
      <Divider />
      <Text className="text-center font-mono text-black text-xs">
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
    <View className="w-[75%] mx-auto">
      <View className="bg-white overflow-hidden w-full">
        <View className="px-4 py-6">
          <ReceiptContent result={result} />
        </View>
      </View>
    </View>
  )
}

export default ReceiptPreview
