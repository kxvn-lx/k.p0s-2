import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

type Props = {
  qty: number
  satuan?: string | null
  onDecrement: () => void
  onIncrement: () => void
  onRemove: () => void
  children?: ReactNode
}

export default function BadgeStepper({
  qty,
  satuan,
  onDecrement,
  onIncrement,
  onRemove,
}: Props) {
  return (
    <View className="p-3 w-48 bg-card border border-primary">
      <View className="flex-row items-center justify-between mb-3">
        <Button
          size="icon"
          variant="outline"
          className="rounded-none border-primary h-8 w-8"
          onPress={onDecrement}
        >
          <Text className="text-primary font-mono font-bold">-</Text>
        </Button>

        <Text className="font-mono font-bold text-lg text-primary">
          {qty}{" "}
          <Text className="text-xs text-muted-foreground">{satuan ?? ""}</Text>
        </Text>

        <Button
          size="icon"
          variant="outline"
          className="rounded-none border-primary h-8 w-8"
          onPress={onIncrement}
        >
          <Text className="text-primary font-mono font-bold">+</Text>
        </Button>
      </View>

      <View className="flex-row justify-between gap-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-none border-destructive"
          onPress={onRemove}
        >
          <Text className="text-destructive font-mono text-xs uppercase">
            HAPUS
          </Text>
        </Button>
        <Button
          size="sm"
          className="flex-1 rounded-none bg-primary"
          onPress={() => {
            /* handled by Popover */
          }}
        >
          <Text className="text-primary-foreground font-mono text-xs uppercase font-bold">
            TUTUP
          </Text>
        </Button>
      </View>
    </View>
  )
}
