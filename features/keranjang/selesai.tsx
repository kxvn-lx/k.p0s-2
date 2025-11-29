import { View } from "react-native"
import { useCallback, useMemo } from "react"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Button } from "@/components/ui/button"
import type { PenjualanResult } from "./types/penjualan-result.types"

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

  // ----- Handlers -----
  const handleFinish = useCallback(() => {
    router.dismissAll()
  }, [router])

  // ----- Render -----
  return (
    <View className="flex-1 bg-background">
      {/* Receipt Preview */}
      <View className="flex-1 items-center justify-center">
        {/* <ReceiptPreview commands={receiptCommands} /> */}
      </View>

      {/* Action Buttons */}
      <View className="h-14 flex-row gap-2 p-2">
        <Button variant="outline" onPress={handleFinish} title="SELESAI" className="flex-1" />
      </View>
    </View>
  )
}
