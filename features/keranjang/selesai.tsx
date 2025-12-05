import { View, ScrollView } from "react-native"
import { useCallback, useMemo } from "react"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { ReceiptPreview } from "@/components/shared/receipt-preview"
import { toast } from "@/lib/store/toast-store"
import { usePrint } from "./hooks/use-print"
import { isDev } from "@/lib/utils"
import type { PenjualanResult } from "./types/penjualan-result.types"
import StatusBarFooter from "./components/status-bar-footer"

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
  const { selectedPrinter, printReceipt, printDebug, isPrinting } = usePrint()


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
      <ScrollView contentContainerClassName="flex-grow">
        <ReceiptPreview result={result} />
      </ScrollView>

      {/* Action Buttons */}
      <StatusBarFooter>
        <View className="flex-row gap-2 pb-safe">
          {isDev() ? (
            <View className="flex-1">
              <Button variant="outline" title="DEBUG PRINT" onPress={handleDebugPrint} disabled={isPrinting || !selectedPrinter} />
            </View>
          ) : null}
          <View className="flex-1">
            <Button
              variant="outline"
              onPress={handlePrint}
              disabled={isPrinting || !selectedPrinter}
              title={isPrinting ? "Mencetak..." : "CETAK"}
            />
          </View>
          <View className="flex-1">
            <Button variant="default" onPress={handleFinish}>
              <Text className="text-primary-foreground font-medium">SELESAI</Text>
            </Button>
          </View>
        </View>
      </StatusBarFooter>
    </View>
  )
}
