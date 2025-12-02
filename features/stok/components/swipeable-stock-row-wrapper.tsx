// ----- Swipeable Stock Row Wrapper -----
// Manages ref for "only one open at a time" behavior
import { useRef } from "react"
import SwipeableStockRow, { SwipeableStockRowRef } from "./swipeable-stock-row"
import type { StockRow } from "../api/stock.service"

// ----- Types -----
type SwipeableStockRowWrapperProps = {
  stock: StockRow
  onPress?: () => void
  onSwipeOpen: (ref: SwipeableStockRowRef | null) => void
}

// ----- Component -----
export default function SwipeableStockRowWrapper({
  stock,
  onPress,
  onSwipeOpen,
}: SwipeableStockRowWrapperProps) {
  const rowRef = useRef<SwipeableStockRowRef>(null)

  return (
    <SwipeableStockRow
      ref={rowRef}
      stock={stock}
      onPress={onPress}
      onSwipeOpen={() => onSwipeOpen(rowRef.current)}
    />
  )
}
