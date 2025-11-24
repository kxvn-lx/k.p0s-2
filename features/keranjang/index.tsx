import SearchInput from '@/components/shared/search-input'
import { Separator } from '@/components/ui/separator'
import { StatusMessage } from '@/components/shared/status-message'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { FlatList, RefreshControl, View, Keyboard, Pressable } from 'react-native'
import { AlertTriangle } from 'lucide-react-native'
import type { StockRow } from '@/features/stok/api/stock.service'
import KeranjangRow from './components/keranjang-row'
import { useTruckStocksQuery } from '@/features/stok/hooks/truck.queries'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import * as Haptics from 'expo-haptics'
import { Alert } from '@/components/ui/alert'
import useKeranjangStore, { type KeranjangState, type BasketItem } from './store/keranjang-store'
import useKeranjangActions from './hooks/use-keranjang-actions'
import BadgeStepper from '@/features/keranjang/components/badge-stepper'

export default function Keranjang() {
    const router = useRouter()

    const [query, setQuery] = useState('')

    const { data = [], isLoading, isError, refetch, isFetching } = useTruckStocksQuery(query)

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        try {
            await refetch()
        } finally {
            setRefreshing(false)
        }
    }, [refetch])

    const actions = useKeranjangActions()
    const items = actions.items as Record<string, BasketItem>
    const { addToBasket, selectVariation, remainingFor, increment, setQty, removeItem } = actions
    const resetBasket = useKeranjangStore((s: KeranjangState) => s.reset)
    const [alertMsg, setAlertMsg] = useState<string | null>(null)

    const handleInsufficient = async (message = 'Stok tidak cukup') => {
        setAlertMsg(message)
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setTimeout(() => setAlertMsg(null), 2200)
    }

    const renderItem = ({ item }: { item: StockRow }) => {
        const options = (item as any).variasi_harga_barang ?? []
        const selQty = items[item.id]?.qty ?? 0

        if (options.length > 0) {
            return (
                <Popover>
                    <PopoverTrigger>
                        <KeranjangRow
                            stock={item}
                            remaining={remainingFor(item)}
                            selectedQty={selQty}
                            badgeNode={
                                selQty ? (
                                    <Popover>
                                        <PopoverTrigger>
                                            <View className="ml-3 rounded-full bg-primary px-2 py-0.5">
                                                <Text className="text-primary-foreground text-xs font-medium">{selQty}</Text>
                                            </View>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <BadgeStepper
                                                qty={selQty}
                                                satuan={item.satuan_utama ?? ''}
                                                onDecrement={async () => {
                                                    const existing = items[item.id]
                                                    if (!existing) return
                                                    const step = existing.variasiId
                                                        ? ((options as any).find((o: any) => o.id === existing.variasiId)?.min_qty ?? 1)
                                                        : 1
                                                    const newQty = existing.qty - step
                                                    await Haptics.selectionAsync()
                                                    if (newQty <= 0) removeItem(item.id)
                                                    else setQty(item.id, newQty)
                                                }}
                                                onIncrement={async () => {
                                                    const existing = items[item.id]
                                                    const step = existing?.variasiId
                                                        ? ((options as any).find((o: any) => o.id === existing.variasiId)?.min_qty ?? 1)
                                                        : 1
                                                    if (remainingFor(item) < step) return handleInsufficient('Stok tidak cukup')
                                                    await Haptics.selectionAsync()
                                                    increment(item.id, step)
                                                }}
                                                onRemove={() => removeItem(item.id)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                ) : undefined
                            }
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <View className="py-2">
                            <Text className="font-medium mb-2">{item.nama}</Text>
                            <View className="py-1 border-t border-border" />

                            <View className="flex-row justify-between items-center p-2">
                                <View>
                                    <Text className="text-xs text-muted-foreground">Minimal 1 {item.satuan_utama ?? ''}</Text>
                                    <Text className="font-medium">{item.harga_jual?.toLocaleString() ?? '-'}</Text>
                                </View>
                                <Button size="sm" variant="outline" title="Pilih" onPress={async () => {
                                    const r = await selectVariation(item, null as any)
                                    if (!r.ok) handleInsufficient('Stok tidak cukup')
                                }} />
                            </View>

                            {options.map((v: any) => (
                                <View key={v.id} className="flex-row justify-between items-center p-2">
                                    <View>
                                        <Text className="text-xs text-muted-foreground">Minimal {v.min_qty} {v.satuan}</Text>
                                        <View className="flex-row items-center gap-x-2">
                                            <Text className="text-muted-foreground text-sm line-through">{item.harga_jual?.toLocaleString()}</Text>
                                            <Text className="text-sm text-green-600 font-medium">{v.harga_jual.toLocaleString()}</Text>
                                        </View>
                                    </View>

                                    <Button size="sm" title={`Pilih ${v.min_qty}`} onPress={async () => {
                                        const r = await selectVariation(item, { id: v.id, min_qty: v.min_qty, harga_jual: v.harga_jual })
                                        if (!r.ok) handleInsufficient('Stok tidak cukup untuk variasi')
                                    }} />
                                </View>
                            ))}
                        </View>
                    </PopoverContent>
                </Popover>
            )
        }

        return (
            <Pressable
                onPress={async () => {
                    const r = await addToBasket(item, 1)
                    if (!r.ok) handleInsufficient('Stok tidak cukup')
                }}
                className="active:bg-accent/10"
            >
                <KeranjangRow
                    stock={item}
                    remaining={remainingFor(item)}
                    selectedQty={selQty}
                    badgeNode={
                        selQty ? (
                            <Popover>
                                <PopoverTrigger>
                                    <View className="ml-3 rounded-full bg-primary px-2 py-0.5">
                                        <Text className="text-primary-foreground text-xs font-medium">{selQty}</Text>
                                    </View>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <BadgeStepper
                                        qty={selQty}
                                        satuan={item.satuan_utama ?? ''}
                                        onDecrement={async () => {
                                            const existing = items[item.id]
                                            if (!existing) return
                                            const step = existing.variasiId ? ((options as any).find((o: any) => o.id === existing.variasiId)?.min_qty ?? 1) : 1
                                            const newQty = existing.qty - step
                                            await Haptics.selectionAsync()
                                            if (newQty <= 0) removeItem(item.id)
                                            else setQty(item.id, newQty)
                                        }}
                                        onIncrement={async () => {
                                            const existing = items[item.id]
                                            const step = existing?.variasiId ? ((options as any).find((o: any) => o.id === existing.variasiId)?.min_qty ?? 1) : 1
                                            if (remainingFor(item) < step) return handleInsufficient('Stok tidak cukup')
                                            await Haptics.selectionAsync()
                                            increment(item.id, step)
                                        }}
                                        onRemove={() => removeItem(item.id)}
                                    />
                                </PopoverContent>
                            </Popover>
                        ) : undefined
                    }
                />
            </Pressable>
        )
    }

    return (
        <View className="flex-1 bg-background">
            <View>
                <SearchInput placeholder="Cari nama atau kode stok (TRUK)..." initialValue={query} onSearch={setQuery} />
            </View>

            {alertMsg ? (
                <View className="p-2">
                    <Alert icon={AlertTriangle as any} variant="destructive">
                        <Text className="font-medium">{alertMsg}</Text>
                    </Alert>
                </View>
            ) : null}

            {isLoading ? (
                <StatusMessage isLoading />
            ) : isError ? (
                <StatusMessage type="error" message="Gagal memuat stok di truk" />
            ) : (
                <FlatList
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="never"
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                    refreshControl={<RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} />}
                    data={data as StockRow[]}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <Separator />}
                    ListEmptyComponent={() => <StatusMessage type="muted" message="Tidak ada hasil" className="mt-12" />}
                />
            )}

            <View className="p-2 border-t border-border bg-card">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-sm">{Object.keys(items).length} jenis barang</Text>
                    </View>

                    <View className="flex-row items-center gap-x-2">
                        <Button variant="outline" title="Batal" onPress={resetBasket} />
                        <Button title="Lanjut" onPress={() => router.push('/keranjang/summary' as any)} disabled={Object.keys(items).length === 0} />
                    </View>
                </View>
            </View>
        </View>
    )
}
