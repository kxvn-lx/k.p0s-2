import SearchInput from "@/components/shared/search-input"
import { StatusMessage } from "@/components/shared/status-message"
import { useRouter } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import { FlatList, RefreshControl, View, Keyboard } from "react-native"
import KeranjangRow from "./components/keranjang-row"
import { useTruckStocksQuery } from "@/features/stok/hooks/truck.queries"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import useKeranjangActions from "./hooks/use-keranjang-actions"
import type {
  StockWithVariations,
  VariasiHargaRow,
} from "./types/keranjang.types"
import useKeranjangStore, {
  KeranjangState,
} from "@/features/keranjang/store/keranjang-store"
import { Separator } from "@/components/ui/separator"

export default function Keranjang() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useTruckStocksQuery(query)

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }, [refetch])

  const {
    items,
    addToBasket,
    selectVariation,
    adjustQty,
    removeItem,
    remainingFor,
  } = useKeranjangActions()
  const resetBasket = useKeranjangStore((s: KeranjangState) => s.reset)
  const [alertMsg, setAlertMsg] = useState<string | null>(null)

  const showAlert = useCallback((message: string) => {
    setAlertMsg(message)
    const timer = setTimeout(() => setAlertMsg(null), 2200)
    return () => clearTimeout(timer)
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: StockWithVariations }) => {
      const options = item.variasi_harga_barang ?? []
      const selQty = items[item.id]?.qty ?? 0

      return (
        <KeranjangRow
          stock={item}
          remaining={remainingFor(item)}
          selectedQty={selQty}
          selectedVariasiId={items[item.id]?.variasi_harga_id ?? undefined}
          options={options}
          onAdd={() => {
            const r = addToBasket(item, 1, null, item.harga_jual)
            if (!r.ok) showAlert(r.message)
          }}
          onSelectOriginal={() => {
            const r = selectVariation(item, null)
            if (!r.ok) showAlert(r.message)
          }}
          onSelectVariation={(v: VariasiHargaRow) => {
            const r = selectVariation(item, v)
            if (!r.ok) showAlert(r.message)
          }}
          onIncrement={() => {
            const r = adjustQty(item.id, 1)
            if (!r.ok) showAlert(r.message)
          }}
          onDecrement={() => {
            const r = adjustQty(item.id, -1)
            if (!r.ok) showAlert(r.message)
          }}
        />
      )
    },
    [
      items,
      remainingFor,
      addToBasket,
      selectVariation,
      adjustQty,
      removeItem,
      showAlert,
    ]
  )

  const itemCount = useMemo(() => Object.keys(items).length, [items])
  const canProceed = itemCount > 0

  const renderContent = () => {
    if (isLoading) return <StatusMessage isLoading />
    if (isError)
      return <StatusMessage type="error" message="GAGAL MEMUAT DATA" />

    return (
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="never"
        onScrollBeginDrag={() => Keyboard.dismiss()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isFetching}
            onRefresh={onRefresh}
          />
        }
        data={data as StockWithVariations[]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Separator />}
        ListEmptyComponent={() => (
          <StatusMessage
            type="muted"
            message="ND ADA DATA"
            className="mt-12 uppercase"
          />
        )}
      />
    )
  }

  return (
    <View className="flex-1 bg-background">
      <SearchInput
        placeholder="CARI STOK..."
        initialValue={query}
        onSearch={setQuery}
      />

      {alertMsg ? (
        <View className="bg-destructive p-1">
          <Text className="text-destructive-foreground text-sm text-center uppercase">
            *** {alertMsg} ***
          </Text>
        </View>
      ) : null}

      {/* Main Content Area */}
      <View className="flex-1">{renderContent()}</View>

      {/* Status Bar Footer */}
      <View className="bg-card border-t border-border">
        <View className="flex-row items-center justify-between">
          <Text>STOK: {itemCount}</Text>

          <Button variant="bare" onPress={resetBasket} disabled={!itemCount} textClassName="text-destructive" title="BATAL" />
        </View>

        <Button
          onPress={() => {
            console.warn("Summary route not yet implemented")
          }}
          disabled={!canProceed}
          title="LANJUT"
        />
      </View>
    </View>
  )
}
