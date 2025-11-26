import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Props = {
  qty: number
  stockQty?: number
  satuan?: string
  onDecrement: () => void
  onIncrement: () => void
  close?: () => void
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
    <View className="w-52">
      <DialogHeader>
        <DialogTitle>Ganti Qty</DialogTitle>
      </DialogHeader>

      <View className="flex-row items-center justify-between p-2 pb-4">
        <Button
          textClassName="text-4xl"
          variant="ghost"
          onPress={onDecrement}
          title="-"
        />

        <View className="flex-row items-end gap-x-2">
          <Text variant="h1">{qty}</Text>
          <Text variant="muted">{satuan ?? ''}</Text>
        </View>

        <Button
          textClassName="text-4xl"
          variant="ghost"
          onPress={onIncrement}
          disabled={reachedMax}
          title="+"
        />
      </View>
    </View>
  )
}
