// ----- Imports -----
import { View } from "react-native"
import PressableRow from '@/components/shared/pressable-row'
import { useRef } from 'react'
import { Text } from "@/components/ui/text"
import BadgeStepper from './badge-stepper'
import SharedBottomSheetModal, { BottomSheetModalRef } from '@/components/shared/bottom-sheet-modal'
import type {
    StockWithVariations,
    VariasiHargaRow,
} from "@/features/keranjang/types/keranjang.types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BottomSheetFlatList } from "@gorhom/bottom-sheet"

type VariasiHargaSelectorProps = {
    stock: StockWithVariations
    options: VariasiHargaRow[]
    onSelectOriginal: () => void
    onSelectVariation: (v: VariasiHargaRow) => void
    selectedQty: number
    remaining: number
    selectedVariasiId?: string
    close?: () => void
    onDecrement?: () => void
    onIncrement?: () => void
    onRemove?: () => void
}

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
    onRemove,
    close,
}: VariasiHargaSelectorProps) {
    // ----- Helpers & layout -----
    const mainPrice = stock.harga_jual ?? 0
    const mainSatuan = stock.satuan_utama ?? ''

    type OptionItem = {
        key: string | number
        title?: string
        minQty: number
        satuan: string
        price: number
        onPress: () => void
    }

    const mainItem: OptionItem = {
        key: `main-${stock.id}`,
        title: 'HARGA UTAMA',
        minQty: 1,
        satuan: mainSatuan,
        price: mainPrice,
        onPress: onSelectOriginal,
    }

    const variations: OptionItem[] = options.map((v) => ({
        key: v.id,
        minQty: v.min_qty > 0 ? v.min_qty : 1,
        satuan: v.satuan ?? mainSatuan,
        price: v.harga_jual,
        onPress: () => onSelectVariation(v),
    }))

    const sections: { title: string; items: OptionItem[] }[] = [
        { title: 'HARGA UTAMA', items: [mainItem] },
        { title: 'VARIASI HARGA', items: variations },
    ]

    // Flatten data for FlatList
    const flatData: ({ type: 'header'; title: string } | { type: 'item'; item: OptionItem; isVariation: boolean; isLast: boolean })[] = []
    sections.forEach((section, sidx) => {
        flatData.push({ type: 'header', title: section.title })
        section.items.forEach((item, idx) => {
            flatData.push({ type: 'item', item, isVariation: sidx > 0, isLast: idx === section.items.length - 1 })
        })
    })

    // ----- Row -----
    function OptionRow({ item, isVariation, isLast }: { item: OptionItem; isVariation?: boolean; isLast?: boolean }) {
        const isSelected = selectedVariasiId === undefined
            ? item.key === mainItem.key
            : String(item.key) === String(selectedVariasiId)

        const badgeModalRef = useRef<BottomSheetModalRef>(null)

        const badge = (
            <>
                <Button
                    title={`QTY: ${selectedQty}`}
                    variant="outline"
                    size="icon"
                    onPress={(e) => {
                        e.stopPropagation()
                        badgeModalRef.current?.present()
                    }}
                />

                <SharedBottomSheetModal ref={badgeModalRef} snapPoints={["25%"]}>
                    <BadgeStepper
                        qty={selectedQty}
                        stockQty={remaining}
                        satuan={stock.satuan_utama ?? ''}
                        onDecrement={() => { if (onDecrement) onDecrement() }}
                        onIncrement={() => { if (onIncrement) onIncrement() }}
                    />
                </SharedBottomSheetModal>
            </>
        )

        return (
            <PressableRow
                onPress={() => {
                    item.onPress()
                }}
                className={cn(
                    'flex flex-row items-center justify-between p-2 gap-x-2 border-y border-border',
                )}
            >
                <View className="flex-row items-center flex-1 h-7">
                    <Text className="uppercase w-28">MIN: {item.minQty} {item.satuan}</Text>

                    {isVariation ? (
                        <View className="flex-row items-center gap-x-2">
                            <Text variant="muted" className="line-through">{mainPrice.toLocaleString()}</Text>
                            <Text className="text-green-500">{item.price.toLocaleString()}</Text>
                        </View>
                    ) : (
                        <Text>{item.price.toLocaleString()}</Text>
                    )}
                </View>

                {isSelected && selectedQty > 0 && (
                    <View>
                        {badge}
                    </View>
                )}

            </PressableRow>
        )
    }

    return (
        <BottomSheetFlatList
            data={flatData}
            // contentContainerStyle={{ paddingVertical: 16 }}
            keyExtractor={(item: typeof flatData[0]) => item.type === 'header' ? item.title : String(item.item.key)}
            renderItem={({ item }: { item: typeof flatData[0] }) => {
                if (item.type === 'header') {
                    return (
                        <View className="px-2 mt-4">
                            <Text variant="muted" className="text-sm uppercase">{item.title}</Text>
                        </View>
                    )
                } else {
                    return (
                        <View className="bg-card">
                            <OptionRow
                                item={item.item}
                                isVariation={item.isVariation}
                                isLast={item.isLast}
                            />
                        </View>
                    )
                }
            }}
            showsVerticalScrollIndicator={false}
        />
    )
}
