// ----- Imports -----
import { View } from "react-native"
import PressableRow from '@/components/shared/pressable-row'
import { useState, useEffect } from 'react'
import { Text } from "@/components/ui/text"
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import BadgeStepper from './badge-stepper'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import type {
    StockWithVariations,
    VariasiHargaRow,
} from "@/features/keranjang/types/keranjang.types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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

    // ----- Row -----
    function OptionRow({ item, isVariation, isLast }: { item: OptionItem; isVariation?: boolean; isLast?: boolean }) {
        const isSelected = selectedVariasiId === undefined
            ? item.key === mainItem.key
            : String(item.key) === String(selectedVariasiId)

        const [badgeOpen, setBadgeOpen] = useState(false)

        useEffect(() => {
            if ((!isSelected || selectedQty <= 0) && badgeOpen) {
                setBadgeOpen(false)
            }
        }, [isSelected, selectedQty, badgeOpen])

        const badge = (
            <Dialog open={badgeOpen && isSelected && selectedQty > 0} onOpenChange={setBadgeOpen}>
                <DialogTrigger asChild>
                    <Button
                        title={`QTY: ${selectedQty}`}
                        variant="outline"
                        size="icon"
                        onPress={(e) => {
                            e.stopPropagation()
                            setBadgeOpen(true)
                        }}
                    />
                </DialogTrigger>

                <DialogContent>
                    <BadgeStepper
                        qty={selectedQty}
                        stockQty={remaining}
                        satuan={stock.satuan_utama ?? ''}
                        onDecrement={() => { if (onDecrement) onDecrement() }}
                        onIncrement={() => { if (onIncrement) onIncrement() }}
                    />
                </DialogContent>
            </Dialog>
        )

        return (
            <PressableRow
                onPress={() => {
                    item.onPress()
                }}
                className={cn(
                    'flex flex-row items-center justify-between p-2 gap-x-2',
                    isVariation
                        ? (isLast ? 'border-t border-border' : 'border-y border-border')
                        : 'border-y border-border'
                )}
            >
                <View className="flex-row items-center justify-between flex-1 gap-x-2 h-7">
                    <Text variant="muted" className="uppercase">[MIN: {item.minQty} {item.satuan}]</Text>
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
                    <View >
                        {badge}
                    </View>
                )}

            </PressableRow>
        )
    }

    return (
        <View className="flex-col">
            <DialogHeader>
                <DialogTitle>{stock.nama}</DialogTitle>
            </DialogHeader>

            {sections.map((section, sidx) => (
                <View key={section.title} className={cn(sidx > 0 ? 'mt-4' : '')}>
                    <View className="px-2">
                        <Text className="text-sm uppercase">{section.title}</Text>
                    </View>

                    <View className="bg-card">
                        {section.items.map((item, idx) => (
                            <OptionRow
                                key={item.key}
                                item={item}
                                isVariation={sidx > 0}
                                isLast={idx === section.items.length - 1}
                            />
                        ))}
                    </View>
                </View>
            ))}
        </View>
    )
}
