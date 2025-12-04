// ----- Swipeable Stock Row -----
import { forwardRef, useImperativeHandle, useRef } from "react"
import { View } from "react-native"
import Animated, { LinearTransition, SharedValue } from "react-native-reanimated"
import Swipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { MapPin } from "lucide-react-native"
import SwipeActionButton from "@/components/shared/swipe-action-button"
import type { StockLokasi, StockRow } from "../api/stock.service"
import { useUpdateStockLokasiMutation } from "../hooks/stock.queries"
import StockRowContent from "./stock-row"
import * as Haptics from "expo-haptics"
import { useAuth } from "@/lib/auth-context"

// ----- Types -----
export type SwipeableStockRowRef = {
  close: () => void
}

type SwipeableStockRowProps = {
  stock: StockRow
  onPress?: () => void
  onSwipeOpen?: (ref: SwipeableStockRowRef) => void
}

// ----- Component -----
const SwipeableStockRow = forwardRef<SwipeableStockRowRef, SwipeableStockRowProps>(
  ({ stock, onPress, onSwipeOpen }, forwardedRef) => {
    const { user } = useAuth()
    const isAdmin = user?.app_metadata?.role === "Admin"
    const swipeableRef = useRef<SwipeableMethods>(null)
    const { mutate: updateLokasi } = useUpdateStockLokasiMutation()

    const nextLokasi: StockLokasi = stock.lokasi === "TOKO" ? "TRUK" : "TOKO"
    const actionVariant = nextLokasi === "TOKO" ? "success" : "warning"

    // ----- Expose Methods -----
    const rowApi = { close: () => swipeableRef.current?.close() }

    useImperativeHandle(forwardedRef, () => rowApi)

    // ----- Handlers -----
    const handleToggleLokasi = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      updateLokasi({ stockId: stock.id, lokasi: nextLokasi })
      swipeableRef.current?.close()
    }

    const handleSwipeWillOpen = () => {
      onSwipeOpen?.(rowApi)
    }

    // ----- Render Actions -----
    const renderLeftActions = (
      _progress: SharedValue<number>,
      _translation: SharedValue<number>,
      _swipeableMethods: SwipeableMethods
    ) => (
      <View className="flex-row items-center bg-card">
        <SwipeActionButton
          label={nextLokasi}
          icon={MapPin}
          variant={actionVariant}
          onPress={handleToggleLokasi}
        />
      </View>
    )

    // For non-admin users, just render the regular content without swipe functionality
    if (!isAdmin) {
      return <StockRowContent stock={stock} onPress={onPress} />
    }

    return (
      <Animated.View layout={LinearTransition.springify()}>
        <Swipeable
          ref={swipeableRef}
          renderLeftActions={renderLeftActions}
          friction={2}
          onSwipeableWillOpen={handleSwipeWillOpen}
        >
          <StockRowContent stock={stock} onPress={onPress} />
        </Swipeable>
      </Animated.View>
    )
  }
)

SwipeableStockRow.displayName = "SwipeableStockRow"

export default SwipeableStockRow
