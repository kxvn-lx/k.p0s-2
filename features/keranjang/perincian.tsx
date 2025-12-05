// ----- IMPORTS -----
import { StatusMessage } from "@/components/shared/status-message"
import { useRouter } from "expo-router"
import { useCallback, useMemo, useRef } from "react"
import { FlatList, View } from "react-native"
import SwipeablePerincianRow from "./components/swipeable-perincian-row"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import useKeranjangActions from "./hooks/use-keranjang-actions"
import useKeranjangStore, {
  KeranjangState,
} from "@/features/keranjang/store/keranjang-store"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import type { BasketItem } from "./types/keranjang.types"
import PerincianRubahModal, {
  PerincianRubahModalRef,
} from "./components/perincian-rubah-modal"
import { useCloseSwipeableOnScroll } from "@/lib/hooks/use-close-swipeable-on-scroll"
import StatusBarFooter from "./components/status-bar-footer"

// ----- Stable Components -----
const ItemSeparator = () => <Separator />

// ----- COMPONENT -----
export default function Perincian() {
  const router = useRouter()
  const { items, removeItem, setQty } = useKeranjangActions()
  const resetBasket = useKeranjangStore((s: KeranjangState) => s.reset)

  // ----- REFS -----
  const { handleSwipeOpen, closeOpenRow } = useCloseSwipeableOnScroll()
  const perincianRubahModalRef = useRef<PerincianRubahModalRef>(null)
  // ----- DERIVED STATE -----
  const basketItems = useMemo(() => Object.values(items), [items])
  const itemCount = basketItems.length
  const canProceed = itemCount > 0

  // ----- HANDLERS -----

  const handleDeleteItem = useCallback(
    (stockId: string) => {
      removeItem(stockId)
      toast.success("Item dihapus")
    },
    [removeItem]
  )

  const handleEditItem = useCallback(
    (item: BasketItem) => {
      perincianRubahModalRef.current?.present(item)
    },
    []
  )

  const handleSavePerincianRubah = useCallback(
    (item: BasketItem, newPrice: number) => {
      setQty(
        item.stock.id,
        item.qty,
        newPrice,
        item.variasi_harga_id,
        item.min_qty
      )
      toast.success("Harga diubah")
    },
    [setQty]
  )

  const handleCancel = useCallback(() => {
    resetBasket()
    router.back()
  }, [resetBasket, router])

  const handleProceed = useCallback(() => {
    router.push("/keranjang/pembayaran")
  }, [router])

  // ----- RENDER FUNCTIONS -----
  const renderItem = useCallback(
    ({ item }: { item: BasketItem }) => (
      <SwipeablePerincianRow
        item={item}
        onDelete={() => handleDeleteItem(item.stock.id)}
        onEdit={() => handleEditItem(item)}
        onSwipeOpen={handleSwipeOpen}
      />
    ),
    [handleDeleteItem, handleEditItem, handleSwipeOpen]
  )

  const renderListEmpty = () => (
    <StatusMessage
      type="muted"
      message="ND ADA ITEM"
      className="mt-12 uppercase"
    />
  )

  if (itemCount === 0) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <StatusMessage type="muted" message="KERANJANG KOSONG" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      {/* List */}
      <FlatList
        onScrollBeginDrag={closeOpenRow}
        data={basketItems}
        keyExtractor={(item) => item.stock.id}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={renderListEmpty}
        contentContainerClassName="pb-2"
      />

      {/* Footer */}
      <StatusBarFooter>
        <View className="flex-row items-center justify-between">
          <Text className="font-medium text-base">STOK: {itemCount}</Text>

          <Button
            variant="bare"
            size="bare"
            onPress={handleCancel}
            textClassName="text-destructive"
            title="BATAL"
          />
        </View>

        <Button onPress={handleProceed} disabled={!canProceed} title="LANJUT" />
      </StatusBarFooter>

      {/* Edit Price Modal */}
      <PerincianRubahModal ref={perincianRubahModalRef} onSave={handleSavePerincianRubah} />
    </View>
  )
}
