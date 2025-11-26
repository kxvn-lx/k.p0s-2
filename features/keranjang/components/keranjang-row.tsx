import { Text } from "@/components/ui/text"
import { View } from "react-native"
import { useState, useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import PressableRow from '@/components/shared/pressable-row'
import VariasiHargaSelector from './variasi-harga-selector'
import BadgeStepper from "./badge-stepper"
import type {
  StockWithVariations,
  VariasiHargaRow,
} from "@/features/keranjang/types/keranjang.types"
import { Button } from "@/components/ui/button"

type KeranjangRowProps = {
  stock: StockWithVariations
  remaining: number
  selectedQty: number
  selectedVariasiId?: string
  options?: VariasiHargaRow[]
  onAdd?: () => void
  onSelectOriginal?: () => void
  onSelectVariation?: (v: VariasiHargaRow) => void
  onDecrement?: () => void
  onIncrement?: () => void
  onRemove?: () => void
}

export default function KeranjangRow({
  stock,
  remaining,
  selectedQty,
  options = [],
  onAdd,
  onSelectOriginal,
  onSelectVariation,
  onDecrement,
  onIncrement,
  onRemove,
  selectedVariasiId,
}: KeranjangRowProps) {
  const qty = remaining
  const low = qty <= 0
  const variasiCount = stock.variasi_harga_barang?.length ?? 0
  const hasVariations = options.length > 0

  const [badgeOpen, setBadgeOpen] = useState(false)

  useEffect(() => {
    if (selectedQty <= 0 && badgeOpen) setBadgeOpen(false)
  }, [selectedQty, badgeOpen])

  const Badge = (
    <Dialog open={badgeOpen && selectedQty > 0} onOpenChange={setBadgeOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title={`QTY: ${selectedQty}`}
          onPress={(e) => {
            e.stopPropagation()
            setBadgeOpen(true)
          }}
        />
      </DialogTrigger>

      <DialogContent>
        <BadgeStepper
          qty={selectedQty}
          stockQty={qty}
          satuan={stock.satuan_utama ?? ""}
          onDecrement={onDecrement ?? (() => { })}
          onIncrement={onIncrement ?? (() => { })}
          close={() => setBadgeOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )

  const Content = (
    <View
      testID={`keranjang-row-${stock.id}`}
      className="flex-row items-center justify-between p-2 bg-background"
    >
      <View className="flex-col">
        <Text>
          {stock.nama}
        </Text>

        <View className="flex-row gap-x-4">
          <Text
            className={`${low ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            STOK: {qty} {stock.satuan_utama ?? ""}
          </Text>
          <Text>
            {variasiCount > 0 ? `[${variasiCount} VAR]` : `${stock.harga_jual.toLocaleString()}`}
          </Text>
        </View>
      </View>

      {selectedQty > 0 && (
        Badge
      )}
    </View>
  )

  if (hasVariations) {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <PressableRow onPress={() => setOpen(true)}>
            {Content}
          </PressableRow>
        </DialogTrigger>

        <DialogContent className="w-80">
          <VariasiHargaSelector
            stock={stock}
            options={options}
            onSelectOriginal={onSelectOriginal ?? (() => { })}
            onSelectVariation={onSelectVariation ?? (() => { })}
            selectedQty={selectedQty}
            remaining={remaining}
            selectedVariasiId={selectedVariasiId}
            onDecrement={onDecrement}
            onIncrement={onIncrement}
            onRemove={onRemove}
            close={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <PressableRow
      onPress={() => {
        if (onAdd) onAdd()
      }}
      className="row-pressable"
    >
      {Content}
    </PressableRow>
  )
}
