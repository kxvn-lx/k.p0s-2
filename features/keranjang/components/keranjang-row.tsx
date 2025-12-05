import { Text } from "@/components/ui/text"
import { Pressable, View } from "react-native"
import { useRef } from "react"
import SharedBottomSheetModal, {
  BottomSheetModalRef,
} from "@/components/shared/bottom-sheet-modal"
import PressableRow from "@/components/shared/pressable-row"
import VariasiHargaSelector from "./variasi-harga-selector"
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
  selectedVariasiId,
}: KeranjangRowProps) {
  const qty = remaining
  const low = qty <= 0
  const variasiCount = stock.variasi_harga_barang?.length ?? 0
  const hasVariations = options.length > 0

  const badgeModalRef = useRef<BottomSheetModalRef>(null)
  const Badge = (
    <>
      <Button
        variant="outline"
        size="sm"
        onPress={(e) => {
          e.stopPropagation()
          badgeModalRef.current?.present()
        }}
      >
        <Text>{`QTY: ${selectedQty}`}</Text>
      </Button>

      <SharedBottomSheetModal
        ref={badgeModalRef}
        headerTitle="Ganti QTY"
        snapPoints={["25%"]}
      >
        <BadgeStepper
          qty={selectedQty}
          stockQty={qty}
          satuan={stock.satuan_utama ?? ""}
          onDecrement={onDecrement ?? (() => { })}
          onIncrement={onIncrement ?? (() => { })}
        />
      </SharedBottomSheetModal>
    </>
  )

  const Content = (
    <View
      testID={`keranjang-row-${stock.id}`}
      className="flex-row items-center justify-between p-2 bg-card"
    >
      <View className="flex-col">
        <Text>{stock.nama}</Text>

        <View className="flex-row gap-x-4">
          <Text
            className={`uppercase ${low ? "text-destructive" : "text-muted-foreground"}`}
          >
            STOK: {qty} {stock.satuan_utama ?? ""}
          </Text>
          <Text>
            {variasiCount > 0
              ? `[${variasiCount} VAR]`
              : `${stock.harga_jual.toLocaleString()}`}
          </Text>
        </View>
      </View>

      {selectedQty > 0 && Badge}
    </View>
  )

  if (hasVariations) {
    const modalRef = useRef<BottomSheetModalRef>(null)

    return (
      <>
        <PressableRow onPress={() => modalRef.current?.present()}>
          {Content}
        </PressableRow>
        <SharedBottomSheetModal snapPoints={["75%"]} ref={modalRef} headerTitle={stock.nama}>
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
          />
        </SharedBottomSheetModal>
      </>
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
