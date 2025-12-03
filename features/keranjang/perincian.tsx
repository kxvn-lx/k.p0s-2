// ----- IMPORTS -----
import { StatusMessage } from "@/components/shared/status-message"
import { useRouter } from "expo-router"
import { useCallback, useMemo, useRef } from "react"
import { FlatList, View } from "react-native"
import PerincianRow from "./components/perincian-row"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import useKeranjangActions from "./hooks/use-keranjang-actions"
import useKeranjangStore, {
  KeranjangState,
} from "@/features/keranjang/store/keranjang-store"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import type { BasketItem } from "./types/keranjang.types"
import EditPriceModal, {
  EditPriceModalRef,
} from "./components/edit-price-modal"
import { useCloseSwipeableOnScroll } from "@/lib/hooks/use-close-swipeable-on-scroll"

// ----- COMPONENT -----
export default function Perincian() {
  const router = useRouter()
  const { items, removeItem, setQty } = useKeranjangActions()
  const resetBasket = useKeranjangStore((s: KeranjangState) => s.reset)

  // ----- REFS -----
  const { handleSwipeOpen, closeOpenRow } = useCloseSwipeableOnScroll()
  const editModalRef = useRef<EditPriceModalRef>(null)

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
      editModalRef.current?.present(item)
    },
    []
  )

  const handleSaveEditPrice = useCallback(
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
      <PerincianRow
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
        ItemSeparatorComponent={() => <Separator />}
        ListEmptyComponent={renderListEmpty}
        contentContainerClassName="pb-2"
      />

      {/* Footer */}
      <View className="bg-card border-t border-border p-2 flex-col gap-y-2">
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
      </View>

      {/* Edit Price Modal */}
      <EditPriceModal ref={editModalRef} onSave={handleSaveEditPrice} />
    </View>
  )
}
