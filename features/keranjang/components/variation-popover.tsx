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
    <View className="py-2 bg-card">
      <View className="px-3 pb-2 border-b border-primary/30">
        <Text className="font-mono font-bold text-primary uppercase text-sm">
          {stock.nama}
        </Text>
        <Text className="font-mono text-xs text-muted-foreground mt-1">
          PILIH VARIASI:
        </Text>
      </View>

      {/* Section: Harga Utama */}
      <View className="bg-primary/5 px-3 py-1 mt-2">
        <Text className="text-xs font-mono font-bold text-primary uppercase">
          HARGA UTAMA
        </Text>
      </View>

      <View className="flex-row justify-between items-center p-3 border-b border-primary/10">
        <View>
          <Text className="text-xs font-mono text-muted-foreground uppercase">
            (MIN 1 {stock.satuan_utama ?? ""})
          </Text>
          <Text className="font-mono font-bold text-green-500">
            {displayPrice}
          </Text>
        </View>
        <Button
          size="sm"
          variant="outline"
          className="border-primary rounded-none h-8"
          onPress={onSelectOriginal}
        >
          <Text className="font-mono text-xs text-primary">PILIH</Text>
        </Button>
      </View>

      {/* Section: Variasi Harga */}
      {options.length > 0 && (
        <>
          <View className="bg-primary/5 px-3 py-1 mt-2">
            <Text className="text-xs font-mono font-bold text-primary uppercase">
              VARIASI HARGA
            </Text>
          </View>

          {options.map((v) => {
            const minQty = v.min_qty > 0 ? v.min_qty : 1
            const satuan = v.satuan || stock.satuan_utama || ""

            return (
              <View
                key={v.id}
                className="flex-row justify-between items-center p-3 border-b border-primary/10 last:border-0"
              >
                <View>
                  <Text className="text-xs font-mono text-muted-foreground uppercase">
                    (MIN {minQty} {satuan})
                  </Text>
                  <View className="flex-row items-center gap-x-2">
                    <Text className="text-muted-foreground text-xs line-through font-mono">
                      {displayPrice}
                    </Text>
                    <Text className="text-sm text-green-500 font-bold font-mono">
                      {v.harga_jual.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <Button
                  size="sm"
                  className="bg-primary rounded-none h-8"
                  onPress={() => onSelectVariation(v)}
                >
                  <Text className="font-mono text-xs text-primary-foreground font-bold">
                    PILIH {minQty}
                  </Text>
                </Button>
              </View>
            )
          })}
        </>
      )}
    </View>
  )
}
