import SearchInput from "@/components/shared/search-input"
import { Separator } from "@/components/ui/separator"
import { StatusMessage } from "@/components/shared/status-message"
import { useRouter } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import { FlatList, RefreshControl, View, Keyboard } from "react-native"
import { AlertTriangle } from "lucide-react-native"
import KeranjangRow from "./components/keranjang-row"
import { useTruckStocksQuery } from "@/features/stok/hooks/truck.queries"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import useKeranjangActions from "./hooks/use-keranjang-actions"
import type {
  StockWithVariations,
  VariasiHargaRow,
} from "./types/keranjang.types"
import useKeranjangStore, {
  KeranjangState,
} from "@/features/keranjang/store/keranjang-store"

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

  const actions = useKeranjangActions()
  const {
    items,
    addToBasket,
    selectVariation,
    remainingFor,
    increment,
    setQty,
    removeItem,
  } = actions
  const resetBasket = useKeranjangStore((s: KeranjangState) => s.reset)
  const [alertMsg, setAlertMsg] = useState<string | null>(null)

  const showAlert = useCallback((message: string) => {
    setAlertMsg(message)
    const timer = setTimeout(() => setAlertMsg(null), 2200)
    return () => clearTimeout(timer)
  }, [])

  const getVariationStep = useCallback(
    (stock: StockWithVariations, variasiId: string | null): number => {
      if (!variasiId || !stock.variasi_harga_barang) return 1

      const variation = stock.variasi_harga_barang.find(
        (v) => v.id === variasiId
      )
      const minQty = variation?.min_qty ?? 1

      return minQty > 0 ? minQty : 1
    },
    []
  )

  const handleDecrement = useCallback(
    async (stock: StockWithVariations) => {
      const existing = items[stock.id]
      if (!existing) return

      const step = getVariationStep(stock, existing.variasiId)
      const newQty = existing.qty - step

      if (newQty <= 0) {
        removeItem(stock.id)
      } else {
        setQty(stock.id, newQty)
      }
    },
    [items, getVariationStep, removeItem, setQty]
  )

  const handleIncrement = useCallback(
    async (stock: StockWithVariations) => {
      const existing = items[stock.id]
      const step = getVariationStep(stock, existing?.variasiId ?? null)
      const remaining = remainingFor(stock)

      if (remaining < step) {
        showAlert("Stok tidak cukup")
        return
      }

      increment(stock.id, step)
    },
    [items, getVariationStep, remainingFor, increment, showAlert]
  )

  const renderItem = useCallback(
    ({ item }: { item: StockWithVariations }) => {
      const options = item.variasi_harga_barang ?? []
      const selQty = items[item.id]?.qty ?? 0

      return (
        <KeranjangRow
          stock={item}
          remaining={remainingFor(item)}
          selectedQty={selQty}
          options={options}
          onAdd={async () => {
            const r = await addToBasket(item, 1)
            if (!r.ok) showAlert("Stok tidak cukup")
          }}
          onSelectOriginal={async () => {
            const r = await selectVariation(item, null)
            if (!r.ok) showAlert("Stok tidak cukup")
          }}
          onSelectVariation={async (v: VariasiHargaRow) => {
            const r = await selectVariation(item, v)
            if (!r.ok) showAlert("Stok tidak cukup untuk variasi")
          }}
          onDecrement={() => handleDecrement(item)}
          onIncrement={() => handleIncrement(item)}
          onRemove={() => removeItem(item.id)}
        />
      )
    },
    [
      items,
      remainingFor,
      addToBasket,
      selectVariation,
      handleDecrement,
      handleIncrement,
      removeItem,
      showAlert,
    ]
  )

  const itemCount = useMemo(() => Object.keys(items).length, [items])
  const canProceed = itemCount > 0

  const renderContent = () => {
    if (isLoading) return <StatusMessage isLoading />
    if (isError)
      return <StatusMessage type="error" message="Gagal memuat stok di truk" />

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
            message="Tidak ada hasil"
            className="mt-12"
          />
        )}
      />
    )
  }

  return (
    <View className="flex-1 bg-background">
      <View>
        <SearchInput
          placeholder="Cari nama atau kode stok (TRUK)..."
          initialValue={query}
          onSearch={setQuery}
        />
      </View>

      {alertMsg ? (
        <View className="p-2">
          <Alert icon={AlertTriangle} variant="destructive">
            <Text className="font-medium">{alertMsg}</Text>
          </Alert>
        </View>
      ) : null}

      {renderContent()}

      <View className="p-2 border-t border-border bg-card">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm">{itemCount} jenis barang</Text>
          </View>

          <View className="flex-row items-center gap-x-2">
            <Button variant="outline" title="Batal" onPress={resetBasket} />
            <Button
              title="Lanjut"
              onPress={() => {
                console.warn("Summary route not yet implemented")
              }}
              disabled={!canProceed}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
