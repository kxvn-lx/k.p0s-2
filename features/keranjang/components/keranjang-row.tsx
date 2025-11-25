import { Text } from "@/components/ui/text"
import { View, Pressable } from "react-native"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import VariationPopover from "./variation-popover"
import BadgeStepper from "./badge-stepper"
import type {
  StockWithVariations,
  VariasiHargaRow,
} from "@/features/keranjang/types/keranjang.types"

type KeranjangRowProps = {
  stock: StockWithVariations
  remaining?: number
  selectedQty?: number
  badgeNode?: React.ReactNode
  options?: VariasiHargaRow[]
  onAdd?: () => Promise<void> | void
  onSelectOriginal?: () => Promise<void> | void
  onSelectVariation?: (v: VariasiHargaRow) => Promise<void> | void
  onDecrement?: () => Promise<void> | void
  onIncrement?: () => Promise<void> | void
  onRemove?: () => void
}

export default function KeranjangRow({
  stock,
  remaining,
  selectedQty,
  badgeNode,
  options = [],
  onAdd,
  onSelectOriginal,
  onSelectVariation,
  onDecrement,
  onIncrement,
  onRemove,
}: KeranjangRowProps) {
  const qty = remaining ?? stock.jumlah_stok ?? 0
  const low = qty <= 0
  const variasiCount = stock.variasi_harga_barang?.length ?? 0
  const hasVariations = options.length > 0

  const Row = (
    <View
      testID={`keranjang-row-${stock.id}`}
      className="flex-row items-start justify-between p-2 bg-background"
    >
      <View className="flex-1 flex-col pr-2">
        <Text>{stock.nama}</Text>

        <View className="flex-row items-center gap-x-2">
          <Text
            className={`font-medium ${low ? "text-destructive" : "text-foreground"}`}
          >
            {qty}
          </Text>
          <Text className="text-muted-foreground text-xs uppercase">
            {stock.satuan_utama ?? "-"}
          </Text>
          {variasiCount > 0 ? (
            <Text className="text-xs text-muted-foreground ml-2">
              {variasiCount} variasi
            </Text>
          ) : null}
          {selectedQty && selectedQty > 0
            ? (badgeNode ?? (
                <Popover>
                  <PopoverTrigger>
                    <View className="ml-3 rounded-full bg-primary px-2 py-0.5">
                      <Text className="text-primary-foreground text-xs font-medium">
                        {selectedQty}
                      </Text>
                    </View>
                  </PopoverTrigger>
                  <PopoverContent>
                    <BadgeStepper
                      qty={selectedQty}
                      satuan={stock.satuan_utama ?? ""}
                      onDecrement={async () => {
                        if (onDecrement) await onDecrement()
                      }}
                      onIncrement={async () => {
                        if (onIncrement) await onIncrement()
                      }}
                      onRemove={() => {
                        if (onRemove) onRemove()
                      }}
                    />
                  </PopoverContent>
                </Popover>
              ))
            : null}
        </View>
      </View>

      <View className="items-end">
        <Text className="font-medium">
          {stock.harga_jual ? `${stock.harga_jual.toLocaleString()}` : "-"}
        </Text>
      </View>
    </View>
  )

  if (hasVariations) {
    return (
      <Popover>
        <PopoverTrigger>{Row}</PopoverTrigger>
        <PopoverContent>
          <VariationPopover
            stock={stock}
            options={options}
            onSelectOriginal={async () => {
              if (onSelectOriginal) await onSelectOriginal()
            }}
            onSelectVariation={async (v) => {
              if (onSelectVariation) await onSelectVariation(v)
            }}
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Pressable
      onPress={async () => {
        if (onAdd) await onAdd()
      }}
      className="active:bg-accent/10"
    >
      {Row}
    </Pressable>
  )
}
