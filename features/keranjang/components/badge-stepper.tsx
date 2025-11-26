import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { Icon } from "@/components/ui/icon"
import { Minus, Plus } from "lucide-react-native"

type Props = {
  qty: number
  stockQty?: number
  satuan?: string
  onDecrement: () => void
  onIncrement: () => void
  children?: ReactNode
}

export default function BadgeStepper({
  qty,
  stockQty,
  satuan,
  onDecrement,
  onIncrement,
}: Props) {
  const reachedMax = stockQty !== undefined ? qty >= stockQty : false
  return (
    <BottomSheetView>
      <View className="flex-row items-center justify-center gap-x-4 my-4">
        <Button
          variant="ghost"
          onPress={onDecrement}
          size="icon"
          className="w-20 h-20"
        >
          <Icon as={Minus} size={40} />
        </Button>

        <View className="flex-row items-end gap-x-2">
          <Text variant="h1">{qty}</Text>
          <Text variant="muted">{satuan ?? ''}</Text>
        </View>

        <Button
          variant="ghost"
          onPress={onIncrement}
          disabled={reachedMax}
          size="icon"
          className="w-20 h-20"
        >
          <Icon as={Plus} size={40} />
        </Button>
      </View>
    </BottomSheetView>
  )
}
