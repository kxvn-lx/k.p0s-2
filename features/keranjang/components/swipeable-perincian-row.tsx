// ----- Swipeable Perincian Row -----
import { forwardRef, useImperativeHandle, useRef } from "react"
import { View } from "react-native"
import Animated, { LinearTransition, SharedValue } from "react-native-reanimated"
import Swipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { Pencil, Trash2 } from "lucide-react-native"
import SwipeActionButton from "@/components/shared/swipe-action-button"
import type { BasketItem } from "../types/keranjang.types"
import PerincianRowContent from "./perincian-row"

// ----- Types -----
export type SwipeablePerincianRowRef = {
    close: () => void
}

type SwipeablePerincianRowProps = {
    item: BasketItem
    onDelete?: () => void
    onEdit?: () => void
    onSwipeOpen?: (ref: SwipeablePerincianRowRef) => void
}

// ----- Component -----
const SwipeablePerincianRow = forwardRef<SwipeablePerincianRowRef, SwipeablePerincianRowProps>(
    ({ item, onDelete, onEdit, onSwipeOpen }, forwardedRef) => {
        const swipeableRef = useRef<SwipeableMethods>(null)

        // ----- Expose Methods -----
        const rowApi = { close: () => swipeableRef.current?.close() }

        useImperativeHandle(forwardedRef, () => rowApi)

        // ----- Handlers -----
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

        // ----- Render Actions -----
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
            <Animated.View layout={LinearTransition.springify()}>
                <Swipeable
                    ref={swipeableRef}
                    renderRightActions={renderRightActions}
                    friction={2}
                    onSwipeableWillOpen={handleSwipeWillOpen}
                >
                    <PerincianRowContent
                        item={item}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onSwipeOpen={onSwipeOpen}
                    />
                </Swipeable>
            </Animated.View>
        )
    }
)

SwipeablePerincianRow.displayName = "SwipeablePerincianRow"

export default SwipeablePerincianRow