import { Text } from "@/components/ui/text"
import { View } from "react-native"
import type { BasketItem } from "@/features/keranjang/types/keranjang.types"
import Animated, {
  LinearTransition,
  SharedValue,
} from "react-native-reanimated"
import Swipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { forwardRef, useImperativeHandle, useRef } from "react"
import SwipeActionButton from "@/components/shared/swipe-action-button"
import { Pencil, Trash2 } from "lucide-react-native"

// ----- TYPES -----
type PerincianRowProps = {
  item: BasketItem
  onDelete?: () => void
  onEdit?: () => void
  onSwipeOpen?: (ref: PerincianRowRef) => void
}

export type PerincianRowRef = {
  close: () => void
}

// ----- COMPONENT -----
const PerincianRow = forwardRef<PerincianRowRef, PerincianRowProps>(
  ({ item, onDelete, onEdit, onSwipeOpen }, forwardedRef) => {
    const { stock, qty, harga_satuan, variasi_harga_id, harga_satuan_asal } = item
    const swipeableRef = useRef<SwipeableMethods>(null)

    const isVariasiHarga = !!variasi_harga_id
    const hasEditedPrice = harga_satuan_asal !== undefined && harga_satuan_asal !== harga_satuan
    const originalPrice = hasEditedPrice ? harga_satuan_asal : stock.harga_jual ?? 0
    const totalPrice = qty * harga_satuan

    // ----- EXPOSE METHODS -----
    const rowApi = { close: () => swipeableRef.current?.close() }

    useImperativeHandle(forwardedRef, () => rowApi)

    // ----- HANDLERS -----
    const handleDelete = () => {
      if (onDelete) {
        onDelete()
        swipeableRef.current?.close()
      }
    }

    const handleEdit = () => {
      if (onEdit) {
        onEdit()
        swipeableRef.current?.close()
      }
    }

    const handleSwipeWillOpen = () => {
      onSwipeOpen?.(rowApi)
    }

    // ----- RENDER FUNCTIONS -----
    const renderRightActions = (
      _progress: SharedValue<number>,
      _translation: SharedValue<number>,
      _swipeableMethods: SwipeableMethods
    ) => (
      <View className="flex-row items-center bg-card">
        <SwipeActionButton
          label="RUBAH"
          icon={Pencil}
          variant="primary"
          onPress={handleEdit}
        />
        <SwipeActionButton
          label="HAPUS"
          icon={Trash2}
          variant="destructive"
          onPress={handleDelete}
        />
      </View>
    )

    return (
      <Animated.View
        layout={LinearTransition.springify()}
      >
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          friction={2}
          onSwipeableWillOpen={handleSwipeWillOpen}
        >
          <View
            testID={`perincian-row-${stock.id}`}
            className="flex-row items-center justify-between p-2 bg-card"
          >
            {/* Left: Stock Info */}
            <View className="flex-1 flex-col gap-y-1">
              <Text className="font-medium">{stock.nama}</Text>

              <View className="flex-row items-center gap-x-2">
                <Text className="text-sm text-muted-foreground">
                  {qty} {stock.satuan_utama ?? ""}
                </Text>

                <Text className="text-accent">x</Text>

                <View className="flex-row items-center gap-x-2">
                  {(isVariasiHarga || hasEditedPrice) && (
                    <Text variant="muted" className="line-through text-sm">
                      {originalPrice.toLocaleString()}
                    </Text>
                  )}
                  <Text className={isVariasiHarga ? "text-green-500 text-sm" : "text-sm text-muted-foreground"}>
                    {harga_satuan.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Right: Total */}
            <Text className="font-medium">{totalPrice.toLocaleString()}</Text>
          </View>
        </Swipeable>
      </Animated.View>
    )
  }
)

PerincianRow.displayName = "PerincianRow"

export default PerincianRow
