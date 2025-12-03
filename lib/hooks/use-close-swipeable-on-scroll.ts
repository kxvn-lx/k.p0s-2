// ----- Use Close Swipeable on Scroll -----
// Hook to manage closing swipeable items when user scrolls
// Follows best practices from react-native-gesture-handler docs
// Ensures only one swipeable is open at a time, auto-dismiss on scroll

import { useCallback, useRef } from "react"

// ----- TYPES -----
export type SwipeableRef = {
  close: () => void
}

type UseCloseSwipeableOnScrollReturn = {
  openRowRef: React.MutableRefObject<SwipeableRef | null>
  handleSwipeOpen: (ref: SwipeableRef | null) => void
  closeOpenRow: () => void
}

// ----- HOOK -----
/**
 * Hook to manage swipeable row state in lists
 * 
 * Features:
 * - Ensures only one row is open at a time
 * - Provides method to close currently open row (call on scroll)
 * - Follows react-native-gesture-handler best practices
 * 
 * @example
 * ```tsx
 * const { handleSwipeOpen, closeOpenRow } = useCloseSwipeableOnScroll()
 * 
 * <FlatList
 *   onScrollBeginDrag={closeOpenRow}
 *   renderItem={({ item }) => (
 *     <SwipeableRow onSwipeOpen={handleSwipeOpen} />
 *   )}
 * />
 * ```
 */
export function useCloseSwipeableOnScroll(): UseCloseSwipeableOnScrollReturn {
  const openRowRef = useRef<SwipeableRef | null>(null)

  // ----- Close currently open row -----
  const closeOpenRow = useCallback(() => {
    if (openRowRef.current) {
      openRowRef.current.close()
      openRowRef.current = null
    }
  }, [])

  // ----- Handle when a row opens -----
  const handleSwipeOpen = useCallback((ref: SwipeableRef | null) => {
    // Close previous row if different from current
    if (openRowRef.current && openRowRef.current !== ref) {
      openRowRef.current.close()
    }
    // Update reference to newly opened row
    openRowRef.current = ref
  }, [])

  return {
    openRowRef,
    handleSwipeOpen,
    closeOpenRow,
  }
}
