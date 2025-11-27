// ----- IMPORTS -----
import { View } from "react-native"
import { useCallback } from "react"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import InfoRow from "@/components/shared/info-row"

// ----- COMPONENT -----
export default function SelesaiScreen() {
  // ----- STATE -----
  const router = useRouter()
  const params = useLocalSearchParams()
  const totalAmount = parseInt(params.totalAmount as string || "0", 10)
  const itemCount = parseInt(params.itemCount as string || "0", 10)
  const totalQty = parseInt(params.totalQty as string || "0", 10)

  // ----- HANDLERS -----
  const handleFinish = useCallback(() => {
    router.dismissAll()
  }, [router])

  // ----- RENDER -----
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
            <Text className="text-sm uppercase tracking-wider">
              STATUS
            </Text>
            <Text className="text-green-500 text-xl font-mono-bold uppercase tracking-widest">
              SELESAI
            </Text>
          </View>


          <View>
            <InfoRow label="TANGGAL" containerClassName="border-t" value={formatDateTime(new Date(), true)} />
            <InfoRow label="STOK" value={`${itemCount} TYPE(S) / ${totalQty} UNIT(S)`} />
            <InfoRow label="TOTAL PAID" containerClassName="border-b-0" value={formatCurrency(totalAmount)} />
          </View>
        </View>
      </View>

      <Button
        variant="outline"
        onPress={handleFinish}
        title="KEMBALI"
        className="w-full"
      />
    </View>
  )
}
