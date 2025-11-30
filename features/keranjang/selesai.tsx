import { View, ScrollView } from "react-native"
import { useCallback, useMemo, useEffect } from "react"
import { BackHandler } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Printer, Bug } from "lucide-react-native"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { ReceiptPreview } from "@/components/shared/receipt-preview"
import { usePrinterStore } from "@/lib/printer"
import { toast } from "@/lib/store/toast-store"
import { usePrint } from "./hooks/use-print"
import type { PenjualanResult } from "./types/penjualan-result.types"
import { buildReceiptCommands } from "./utils/build-receipt-commands"

// ----- Helpers -----
const parseResult = (resultString: string | undefined): PenjualanResult | null => {
  if (!resultString) return null
  try {
    return JSON.parse(resultString) as PenjualanResult
  } catch {
    return null
  }
}

// ----- Component -----
export default function SelesaiScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const result = useMemo(() => parseResult(params.result as string), [params.result])
  const receiptCommands = useMemo(() => (result ? buildReceiptCommands(result) : []), [result])
  const selectedPrinter = usePrinterStore((s) => s.selectedPrinter)
  const { printReceipt, printDebug, isPrinting } = usePrint()

  useEffect(() => {
    const onBackPress = () => true
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress)
    return () => sub.remove()
  }, [])

  const handlePrint = useCallback(async () => {
    if (!result) return

    const printResult = await printReceipt(result, selectedPrinter)
    if (printResult.success) {
      toast.success("Berhasil", "Struk berhasil dicetak")
    } else if (printResult.error) {
      toast.error("Gagal Mencetak", printResult.error.message)
    }
  }, [result, selectedPrinter, printReceipt])

  const handleDebugPrint = useCallback(async () => {
    if (!result) return

    const printResult = await printDebug(result, selectedPrinter)
    if (printResult.success) {
      toast.success("Debug", "Debug print berhasil")
    } else if (printResult.error) {
      toast.error("Gagal", printResult.error.message)
    }
  }, [result, selectedPrinter, printDebug])

  const handleFinish = useCallback(() => {
    router.dismissAll()
  }, [router])

  // ----- Render -----
  if (!result) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text variant="muted">Data tidak ditemukan</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      {/* Receipt Preview */}
      <ScrollView contentContainerClassName="flex-grow items-center justify-center p-4">
        <ReceiptPreview commands={receiptCommands} />
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row gap-2 p-2">
        <Button variant="ghost" onPress={handleDebugPrint} disabled={isPrinting || !selectedPrinter} className="px-4">
          <Icon as={Bug} size={18} className="text-muted-foreground" />
        </Button>
        <Button
          variant="outline"
          onPress={handlePrint}
          disabled={isPrinting || !selectedPrinter}
          className="flex-1 flex-row gap-2"
        >
          <Icon as={Printer} size={18} className="text-foreground" />
          <Text>{isPrinting ? "Mencetak..." : "CETAK"}</Text>
        </Button>
        <Button variant="default" onPress={handleFinish} className="flex-1">
          <Text className="text-primary-foreground font-medium">SELESAI</Text>
        </Button>
      </View>
    </View>
  )
}
