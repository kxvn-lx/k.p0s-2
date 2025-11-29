import { View } from "react-native"
import { useCallback, useState } from "react"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Printer } from "lucide-react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/utils"
import InfoRow from "@/components/shared/info-row"
import { usePrinter } from "@/features/menu/hooks/use-printer"
import type { ReceiptData } from "@/features/menu/types/printer.types"

// ----- Component -----
export default function SelesaiScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const totalAmount = parseInt((params.totalAmount as string) || "0", 10)
  const itemCount = parseInt((params.itemCount as string) || "0", 10)
  const totalQty = parseInt((params.totalQty as string) || "0", 10)
  const cashReceived = parseInt((params.cashReceived as string) || "0", 10)

  const { hasSelectedPrinter, printReceipt } = usePrinter()
  const [isPrinting, setIsPrinting] = useState(false)

  // ----- Handlers -----
  const handleFinish = useCallback(() => {
    router.dismissAll()
  }, [router])

  const handlePrint = useCallback(async () => {
    setIsPrinting(true)
    const now = new Date()
    const receiptData: ReceiptData = {
      storeName: "TOKO ANDA",
      date: `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`,
      time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      items: [{ name: `${itemCount} jenis barang`, qty: totalQty, price: Math.round(totalAmount / totalQty), total: totalAmount }],
      subtotal: totalAmount,
      total: totalAmount,
      paymentMethod: "Tunai",
      cashReceived: cashReceived > 0 ? cashReceived : totalAmount,
      change: cashReceived > 0 ? cashReceived - totalAmount : 0,
    }
    await printReceipt(receiptData)
    setIsPrinting(false)
  }, [itemCount, totalQty, totalAmount, cashReceived, printReceipt])

  // ----- Render -----
  return (
    <View className="flex-1 bg-background items-center justify-center p-2 gap-y-4">
      <View className="w-full max-w-sm border border-border bg-background p-2 gap-2">
        {/* Terminal Header */}
        <View className="bg-primary p-2">
          <Text className="text-primary-foreground font-mono-bold text-center uppercase tracking-widest">
            *** TRANSACTION REPORT ***
          </Text>
        </View>

        {/* Terminal Content */}
        <View className="gap-2 border border-border">
          <View className="gap-1 p-2">
            <Text className="text-sm uppercase tracking-wider">STATUS</Text>
            <Text className="text-green-500 text-xl font-mono-bold uppercase tracking-widest">SELESAI</Text>
          </View>

          <View>
            <InfoRow label="TANGGAL" containerClassName="border-t" value={formatDateTime(new Date(), true)} />
            <InfoRow label="STOK" value={`${itemCount} TYPE(S) / ${totalQty} UNIT(S)`} />
            <InfoRow label="JUMLAH DIBAYAR" containerClassName="border-b-0" value={totalAmount.toLocaleString()} />
          </View>
        </View>

        {/* Print Button */}
        {hasSelectedPrinter && (
          <Button variant="outline" onPress={handlePrint} disabled={isPrinting} className="flex-row items-center gap-2">
            <Printer size={16} className="text-foreground" />
            <Text>{isPrinting ? "Mencetak..." : "Cetak Struk"}</Text>
          </Button>
        )}
      </View>

      <Button variant="outline" onPress={handleFinish} title="KEMBALI" className="w-full" />
    </View>
  )
}
