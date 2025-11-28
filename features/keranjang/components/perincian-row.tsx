import { Text } from "@/components/ui/text"
import { View } from "react-native"
import type { BasketItem } from "@/features/keranjang/types/keranjang.types"
import Animated, {
  FadeInLeft,
  FadeOutLeft,
  Layout,
} from "react-native-reanimated"
import { Swipeable } from "react-native-gesture-handler"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { Button } from "@/components/ui/button"

// ----- TYPES -----
type PerincianRowProps = {
  item: BasketItem
  onDelete?: () => void
  onEdit?: () => void
  onSwipeOpen?: () => void
}

export type PerincianRowRef = {
  close: () => void
}

// ----- COMPONENT -----
const PerincianRow = forwardRef<PerincianRowRef, PerincianRowProps>(
  ({ item, onDelete, onEdit, onSwipeOpen }, ref) => {
    const { stock, qty, harga_satuan, variasi_harga_id, harga_satuan_asal } = item
    const swipeableRef = useRef<Swipeable>(null)

    const isVariasiHarga = !!variasi_harga_id
    const hasEditedPrice = harga_satuan_asal !== undefined && harga_satuan_asal !== harga_satuan
    const originalPrice = hasEditedPrice ? harga_satuan_asal : stock.harga_jual ?? 0
    const totalPrice = qty * harga_satuan

    // ----- EXPOSE METHODS -----
    useImperativeHandle(ref, () => ({
      close: () => {
        swipeableRef.current?.close()
      },
    }))

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
      if (onSwipeOpen) {
        onSwipeOpen()
      }
    }

    // ----- RENDER FUNCTIONS -----
    const renderRightActions = () => (
      <View className="flex-row items-center gap-x-2 px-2 bg-card">
        <Button
          variant="ghost"
          size={"icon"}
          onPress={handleEdit}
          className="justify-center items-center bg-blue-500"
        >
          <Text className="text-white font-medium">RUBAH</Text>
        </Button>
        <Button
          variant="ghost"
          size={"icon"}
          onPress={handleDelete}
          className="justify-center items-center bg-destructive"
        >
          <Text className="text-destructive-foreground font-medium">HAPUS</Text>
        </Button>
      </View>
    )

    return (
      <Animated.View
        entering={FadeInLeft.duration(200)}
        exiting={FadeOutLeft.duration(200)}
        layout={Layout.springify()}
      >
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          friction={2}
          onSwipeableWillOpen={handleSwipeWillOpen}
        >
          <View
            testID={`perincian-row-${stock.id}`}
            className="flex-row items-center justify-between p-2 bg-background"
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
