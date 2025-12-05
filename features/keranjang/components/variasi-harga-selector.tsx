// ----- Imports -----
import { View } from "react-native"
import PressableRow from '@/components/shared/pressable-row'
import InfoRow from '@/components/shared/info-row'
import { useRef } from 'react'
import { Text } from "@/components/ui/text"
import { SectionHeader } from "@/components/ui/section-header"
import BadgeStepper from './badge-stepper'
import SharedBottomSheetModal, { BottomSheetModalRef } from '@/components/shared/bottom-sheet-modal'
import type {
    StockWithVariations,
    VariasiHargaRow,
} from "@/features/keranjang/types/keranjang.types"
import { cn } from "@/lib/utils"
import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { Button } from "@/components/ui/button"

// ----- Types -----
type VariasiHargaSelectorProps = {
    stock: StockWithVariations
    options: VariasiHargaRow[]
    onSelectOriginal: () => void
    onSelectVariation: (v: VariasiHargaRow) => void
    selectedQty: number
    remaining: number
    selectedVariasiId?: string
    onDecrement?: () => void
    onIncrement?: () => void
}

type OptionItem = {
    key: string
    minQty: number
    satuan: string
    harga: number
    onPress: () => void
}

type FlatDataItem =
    | { type: 'header'; title: string }
    | { type: 'item'; item: OptionItem; isVariation: boolean; isLast: boolean }

// ----- Component -----
export default function VariasiHargaSelector({
    stock,
    options,
    onSelectOriginal,
    onSelectVariation,
    selectedQty,
    remaining,
    selectedVariasiId,
    onDecrement,
    onIncrement,
}: VariasiHargaSelectorProps) {
    const mainPrice = stock.harga_jual ?? 0
    const mainSatuan = stock.satuan_utama ?? ''

    // ----- Data -----
    const mainItem: OptionItem = {
        key: `main-${stock.id}`,
        minQty: 1,
        satuan: mainSatuan,
        harga: mainPrice,
        onPress: onSelectOriginal,
    }

    const variations: OptionItem[] = options.map((v) => ({
        key: v.id,
        minQty: v.min_qty > 0 ? v.min_qty : 1,
        satuan: v.satuan ?? mainSatuan,
        harga: v.harga_jual,
        onPress: () => onSelectVariation(v),
    }))

    const flatData: FlatDataItem[] = []
    flatData.push({ type: 'header', title: 'Harga Utama' })
    flatData.push({ type: 'item', item: mainItem, isVariation: false, isLast: true })
    if (variations.length > 0) {
        flatData.push({ type: 'header', title: 'Variasi Harga' })
        variations.forEach((item, idx) => {
            flatData.push({ type: 'item', item, isVariation: true, isLast: idx === variations.length - 1 })
        })
    }

    // ----- Helpers -----
    const isItemSelected = (itemKey: string | number) =>
        selectedVariasiId === undefined
            ? itemKey === mainItem.key
            : String(itemKey) === String(selectedVariasiId)

    // ----- Row -----
    function OptionRow({ item, isVariation, isLast }: { item: OptionItem; isVariation: boolean; isLast: boolean }) {
        const isSelected = isItemSelected(item.key)
        const badgeModalRef = useRef<BottomSheetModalRef>(null)
        const minQtyText = `${item.minQty} ${item.satuan}`

        const qtyBadge = (
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

                <SharedBottomSheetModal headerTitle="Ganti QTY" ref={badgeModalRef} snapPoints={["25%"]}>
                    <BadgeStepper
                        qty={selectedQty}
                        stockQty={remaining}
                        satuan={stock.satuan_utama ?? ''}
                        onDecrement={() => onDecrement?.()}
                        onIncrement={() => onIncrement?.()}
                    />
                </SharedBottomSheetModal>
            </>
        )

        const hargaContent = isVariation ? (
            <View className="flex-row items-center gap-x-2">
                <Text variant="muted" className="line-through">
                    {mainPrice.toLocaleString('id-ID')}
                </Text>
                <Text className="text-green-500">
                    {item.harga.toLocaleString('id-ID')}
                </Text>
            </View>
        ) : `${item.harga.toLocaleString('id-ID')}`

        return (
            <PressableRow
                onPress={item.onPress}
                className={cn(
                    "flex-row bg-card",
                    isVariation && !isLast && "mb-2",
                )}
            >
                <View className="flex-1">
                    <InfoRow
                        leadingElement="Min. Qty"
                        trailingElement={minQtyText}
                        primarySide="trailing"
                    />
                    <InfoRow
                        leadingElement="Harga Jual"
                        trailingElement={hargaContent}
                        isLast
                        primarySide="trailing"
                    />
                </View>

                {isSelected && selectedQty > 0 && (
                    <View className="bg-background/25 items-center justify-center border-l border-border px-2">
                        {qtyBadge}
                    </View>
                )}
            </PressableRow>
        )
    }

    // ----- Render -----
    return (
        <BottomSheetFlatList
            data={flatData}
            keyExtractor={(item: FlatDataItem) => item.type === 'header' ? item.title : String(item.item.key)}
            renderItem={({ item }: { item: FlatDataItem }) => {
                if (item.type === 'header') {
                    return (
                        <SectionHeader
                            title={item.title}
                            variant="muted"
                            textClassName="text-xs"
                        />
                    )
                }
                return (
                    <OptionRow
                        item={item.item}
                        isVariation={item.isVariation}
                        isLast={item.isLast}
                    />
                )
            }}
            showsVerticalScrollIndicator={false}
        />
    )
}
