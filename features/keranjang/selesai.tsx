// ----- IMPORTS -----
import { View } from "react-native"
import { useMemo, useCallback } from "react"
import { useRouter } from "expo-router"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import useKeranjangStore from "./store/keranjang-store"
import { formatCurrency, formatDateTime } from "@/lib/utils"

// ----- COMPONENT -----
export default function SelesaiScreen() {
  // ----- STATE -----
  const router = useRouter()
  const items = useKeranjangStore((s) => s.items)
  const reset = useKeranjangStore((s) => s.reset)

  // ----- COMPUTED VALUES -----
  const totalAmount = useMemo(() => {
    return Object.values(items).reduce(
      (sum, item) => sum + item.qty * item.harga_satuan,
      0
    )
  }, [items])

  const itemCount = Object.keys(items).length
  const totalQty = Object.values(items).reduce((sum, item) => sum + item.qty, 0)

  // ----- HANDLERS -----
  const handleFinish = useCallback(() => {
    reset()
    router.dismissAll()
  }, [reset, router])

  // ----- RENDER -----
  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <View className="w-full max-w-sm border-2 border-primary bg-background p-1 gap-1">
        {/* Terminal Header */}
        <View className="bg-primary p-2">
          <Text className="text-primary-foreground font-mono font-bold text-center uppercase tracking-widest">
            *** TRANSACTION REPORT ***
          </Text>
        </View>

        {/* Terminal Content */}
        <View className="p-4 gap-4 border border-primary/20 m-1">
          <View className="gap-1">
            <Text className="text-primary font-mono text-xs uppercase tracking-wider">
              STATUS
            </Text>
            <Text className="text-green-500 font-mono text-xl font-bold uppercase tracking-widest">
              [ COMPLETED ]
            </Text>
          </View>

          <View className="h-px bg-primary/20 my-2" />

          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground font-mono text-xs uppercase">
                DATE
              </Text>
              <Text className="text-foreground font-mono text-xs">
                {formatDateTime(new Date(), true)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground font-mono text-xs uppercase">
                ITEMS
              </Text>
              <Text className="text-foreground font-mono text-xs">
                {itemCount} TYPE(S) / {totalQty} UNIT(S)
              </Text>
            </View>
            <View className="flex-row justify-between items-end mt-2">
              <Text className="text-muted-foreground font-mono text-xs uppercase mb-1">
                TOTAL PAID
              </Text>
              <Text className="text-primary font-mono text-2xl font-bold tracking-tighter">
                {formatCurrency(totalAmount)}
              </Text>
            </View>
          </View>

          <View className="h-px bg-primary/20 my-2" />

          <View className="gap-1">
            <Text className="text-muted-foreground font-mono text-[10px] uppercase text-center">
              THANK YOU FOR YOUR BUSINESS
            </Text>
            <Text className="text-muted-foreground font-mono text-[10px] uppercase text-center">
              PLEASE RETAIN RECEIPT
            </Text>
          </View>
        </View>
      </View>

      <Button
        className="mt-8 w-full max-w-xs border-primary/50 hover:bg-primary/10"
        variant="outline"
        onPress={handleFinish}
      >
        <Text className="font-bold font-mono uppercase tracking-widest text-primary">
          [ RETURN TO MENU ]
        </Text>
      </Button>
    </View>
  )
}
