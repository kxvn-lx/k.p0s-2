import { forwardRef, useImperativeHandle, useRef, useCallback } from "react"
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet"
import { View } from "react-native"
import type { ReactNode } from "react"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { X } from "lucide-react-native"

export type BottomSheetModalRef = {
    present: () => void
    dismiss: () => void
}

interface SharedBottomSheetModalProps extends Omit<React.ComponentProps<typeof BottomSheetModal>, 'animateOnMount' | 'containerHeight'> {
    backgroundClassName?: string
    headerTitle?: string
    onClose?: () => void
}

const SharedBottomSheetModal = forwardRef<BottomSheetModalRef, SharedBottomSheetModalProps>(
    (
        {
            children,
            snapPoints = ["50%"],
            backgroundClassName = "bg-background",
            onChange,
            style,
            index = 1,
            headerTitle,
            onClose,
            ...rest
        },
        ref
    ) => {
        const modalRef = useRef<BottomSheetModal>(null)

        useImperativeHandle(ref, () => ({
            present: () => modalRef.current?.present(),
            dismiss: () => modalRef.current?.dismiss(),
        }))

        // Memoized backdrop renderer
        const renderBackdrop = useCallback(
            (props: BottomSheetBackdropProps) => (
                <BottomSheetBackdrop
                    {...props}
                    pressBehavior="close"
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                />
            ),
            []
        )

        return (
            <BottomSheetModal
                ref={modalRef}
                index={index}
                snapPoints={snapPoints}
                backgroundStyle={{}}
                handleIndicatorStyle={{}}
                stackBehavior="push"
                onChange={onChange}
                // @ts-ignore
                className={backgroundClassName}
                style={style}
                backdropComponent={renderBackdrop}
                {...rest}
            >
                <View className="flex-col flex-1">
                    <View className="flex-row items-center justify-between p-2 border-b border-border">
                        {headerTitle && <Text className="text-lg font-semibold">{headerTitle}</Text>}
                        <Button
                            onPress={onClose || (() => modalRef.current?.dismiss())}
                            variant="ghost"
                            size="icon"
                        >
                            <Icon as={X} />
                        </Button>
                    </View>

                    <View className="flex-1">
                        {children as ReactNode}
                    </View>
                </View>
            </BottomSheetModal>
        )
    }
)

export default SharedBottomSheetModal
