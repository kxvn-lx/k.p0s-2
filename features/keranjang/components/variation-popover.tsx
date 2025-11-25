import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import type {
  StockWithVariations,
  VariasiHargaRow,
} from "@/features/keranjang/types/keranjang.types"

type VariationPopoverProps = {
  stock: StockWithVariations
  options: VariasiHargaRow[]
  onSelectOriginal: () => void
  onSelectVariation: (v: VariasiHargaRow) => void
}

export default function VariationPopover({
  stock,
  options,
  onSelectOriginal,
  onSelectVariation,
}: VariationPopoverProps) {
  const displayPrice = stock.harga_jual?.toLocaleString() ?? "-"

  return (
    <View className="py-2">
      <Text className="font-medium mb-2">{stock.nama}</Text>
      <View className="py-1 border-t border-border" />

      <View className="flex-row justify-between items-center p-2">
        <View>
          <Text className="text-xs text-muted-foreground">
            Minimal 1 {stock.satuan_utama ?? ""}
          </Text>
          <Text className="font-medium">{displayPrice}</Text>
        </View>
        <Button
          size="sm"
          variant="outline"
          title="Pilih"
          onPress={onSelectOriginal}
        />
      </View>

      {options.map((v) => {
        const minQty = v.min_qty > 0 ? v.min_qty : 1
        const satuan = v.satuan || stock.satuan_utama || ""

        return (
          <View
            key={v.id}
            className="flex-row justify-between items-center p-2"
          >
            <View>
              <Text className="text-xs text-muted-foreground">
                Minimal {minQty} {satuan}
              </Text>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-muted-foreground text-sm line-through">
                  {displayPrice}
                </Text>
                <Text className="text-sm text-green-600 font-medium">
                  {v.harga_jual.toLocaleString()}
                </Text>
              </View>
            </View>

            <Button
              size="sm"
              title={`Pilih ${minQty}`}
              onPress={() => onSelectVariation(v)}
            />
          </View>
        )
      })}
    </View>
  )
}
