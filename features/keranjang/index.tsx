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
          options={options}
          onAdd={async () => {
            const r = await addToBasket(item, 1, null, item.harga_jual)
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
          onIncrement={() => adjustQty(item.id, 1)}
          onDecrement={() => adjustQty(item.id, -1)}
          onRemove={() => removeItem(item.id)}
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
        ItemSeparatorComponent={() => <View className="h-[1px] bg-border/30" />}
        ListEmptyComponent={() => (
          <StatusMessage
            type="muted"
            message="TIDAK ADA DATA"
            className="mt-12 uppercase font-mono"
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    )
  }

  return (
    <View className="flex-1 bg-background">
      <View className="border-b border-primary/50 bg-background p-2">
        <SearchInput
          placeholder="CARI_STOK..."
          initialValue={query}
          onSearch={setQuery}
          className="bg-transparent border-0 text-primary font-mono h-8 p-0"
          placeholderTextColor="rgba(255, 160, 40, 0.5)"
          showClear={false}
        />
      </View>

      {alertMsg ? (
        <View className="bg-destructive p-1">
          <Text className="text-destructive-foreground font-mono text-xs text-center uppercase">
            *** ALERT: {alertMsg} ***
          </Text>
        </View>
      ) : null}

      {/* Main Content Area */}
      <View className="flex-1">{renderContent()}</View>

      {/* Status Bar Footer */}
      <View className="border-t-2 border-primary bg-card pb-safe">
        <View className="flex-row justify-between items-center px-4 py-2 bg-primary/10">
          <View className="flex-row gap-x-4">
            <Text className="text-primary font-mono text-xs">
              ITEM: <Text className="font-bold">{itemCount}</Text>
            </Text>
          </View>
        </View>

        <View className="flex-row gap-x-2 p-2">
          <Button
            variant="outline"
            className="flex-1 border-primary rounded-none"
            onPress={resetBasket}
          >
            <Text className="text-primary font-mono uppercase">
              HAPUS_SEMUA
            </Text>
          </Button>
          <Button
            className="flex-1 bg-primary rounded-none"
            onPress={() => {
              console.warn("Summary route not yet implemented")
            }}
            disabled={!canProceed}
          >
            <Text className="text-primary-foreground font-mono uppercase font-bold">
              PROSES {">>"}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
