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

  const Content = (
    <View
      testID={`keranjang-row-${stock.id}`}
      className="flex-col p-3 bg-background border-l-2 border-transparent"
    >
      {/* Top Row: Price Only (Right Aligned) */}
      <View className="flex-row justify-end items-center mb-1">
        <Text className="text-green-500 font-mono font-bold text-sm">
          {stock.harga_jual ? stock.harga_jual.toLocaleString() : "N/A"}
        </Text>
      </View>

      {/* Bottom Row: Name & Qty/Actions */}
      <View className="flex-row justify-between items-center">
        <View className="flex-1 mr-4">
          <Text
            className="text-foreground font-mono text-xs uppercase truncate"
            numberOfLines={1}
          >
            {stock.nama}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text
              className={`text-xs font-mono ${low ? "text-destructive" : "text-muted-foreground"}`}
            >
              AVAIL: {qty} {stock.satuan_utama ?? ""}
            </Text>
            {variasiCount > 0 && (
              <Text className="text-xs text-primary font-mono ml-2">
                [{variasiCount} VAR]
              </Text>
            )}
          </View>
        </View>

        {/* Selection Indicator */}
        {selectedQty && selectedQty > 0 ? (
          <View className="bg-primary px-2 py-1">
            <Text className="text-primary-foreground font-mono font-bold text-xs">
              QTY: {selectedQty}
            </Text>
          </View>
        ) : (
          <View className="w-2 h-2 bg-muted-foreground/20" />
        )}
      </View>
    </View>
  )

  // If item has variations, the whole row triggers the variation popover
  if (hasVariations) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Pressable className="active:opacity-80 active:bg-primary/5">
            {Content}
          </Pressable>
        </PopoverTrigger>
        <PopoverContent className="w-80 border-primary bg-card p-0 rounded-none">
          <VariationPopover
            stock={stock}
            options={options}
            onSelectOriginal={
              onSelectOriginal ? async () => await onSelectOriginal() : () => {}
            }
            onSelectVariation={
              onSelectVariation
                ? async (v) => await onSelectVariation(v)
                : () => {}
            }
          />
        </PopoverContent>
      </Popover>
    )
  }

  // If item is already selected (has qty), showing the badge popover logic might be tricky if we want the WHOLE row to be actionable for something else?
  // But usually tapping the row adds more.
  // The user wants to tap the row to add.
  // If selectedQty > 0, we might want to show the stepper.
  // Let's make it so:
  // - Tap row: Add 1 (or trigger onAdd)
  // - Long press or tap badge: Show stepper?
  // The previous logic had a specific badge trigger.
  // Let's wrap the badge in a PopoverTrigger if it exists.

  // Actually, to keep it simple and robust:
  // If selectedQty > 0, we show the stepper popover when tapping the row?
  // No, usually tapping adds more.
  // To edit quantity (stepper), maybe we need a long press or a specific button?
  // Or maybe the badge itself is a separate Pressable?
  // Let's try to make the badge a separate Pressable inside the Content.

  // Re-defining Content to handle badge interaction internally is cleaner.

  return (
    <View className="relative">
      <Pressable
        onPress={async () => {
          if (onAdd) await onAdd()
        }}
        className="active:opacity-80 active:bg-primary/5"
      >
        <View
          testID={`keranjang-row-${stock.id}`}
          className="flex-col p-3 bg-background border-l-2 border-transparent"
        >
          {/* Top Row: Price Only */}
          <View className="flex-row justify-end items-center mb-1">
            <Text className="text-green-500 font-mono font-bold text-sm">
              {stock.harga_jual
                ? stock.harga_jual.toLocaleString()
                : "TIDAK TERSEDIA"}
            </Text>
          </View>

          {/* Bottom Row: Name & Qty */}
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text
                className="text-foreground font-mono text-xs uppercase truncate"
                numberOfLines={1}
              >
                {stock.nama}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text
                  className={`text-xs font-mono ${low ? "text-destructive" : "text-muted-foreground"}`}
                >
                  STOK: {qty} {stock.satuan_utama ?? ""}
                </Text>
              </View>
            </View>

            {/* Placeholder for badge alignment if needed */}
            {!selectedQty && (
              <View className="w-2 h-2 bg-muted-foreground/20" />
            )}
          </View>
        </View>
      </Pressable>

      {/* Badge Overlay - Positioned absolutely or just rendered on top if selected */}
      {(selectedQty ?? 0) > 0 && (
        <View className="absolute bottom-3 right-3">
          <Popover>
            <PopoverTrigger asChild>
              <Pressable className="bg-primary px-2 py-1 active:opacity-80">
                <Text className="text-primary-foreground font-mono font-bold text-xs">
                  JML: {selectedQty}
                </Text>
              </Pressable>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-primary bg-card rounded-none">
              <BadgeStepper
                qty={selectedQty!}
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
        </View>
      )}
    </View>
  )
}
