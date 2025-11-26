import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { useToastStore } from "@/lib/store/toast-store"
import { cn } from "@/lib/utils"
import { Portal } from "@rn-primitives/portal"
import * as ToastPrimitive from "@rn-primitives/toast"
import { X } from "lucide-react-native"
import * as React from "react"
import { View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// ----- Component -----
export function ToastProvider() {
  const { activeToast, hide } = useToastStore()
  const insets = useSafeAreaInsets()
  const [open, setOpen] = React.useState(false)

  // Animation Values
  const translateY = useSharedValue(-100) // Start off-screen
  const isDragging = useSharedValue(false)

  // Sync store state with local open state
  React.useEffect(() => {
    if (activeToast) {
      setOpen(true)
      // Reset position and animate in
      translateY.value = -150 // Ensure it starts above
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
        mass: 0.8,
        overshootClamping: false,
      })
    } else {
      setOpen(false)
    }
  }, [activeToast])

  // Handle auto-hide
  React.useEffect(() => {
    if (open && activeToast) {
      const duration = activeToast.duration || 3000
      const timer = setTimeout(() => {
        // Animate out before hiding
        translateY.value = withSpring(
          -150,
          {
            damping: 20,
            stiffness: 200,
            mass: 0.5,
          },
          (finished) => {
            if (finished) {
              runOnJS(setOpen)(false)
              runOnJS(hide)()
            }
          }
        )
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [open, activeToast, hide])

  // Gesture Handler
  const pan = Gesture.Pan()
    .activeOffsetY([-10, 10]) // Ignore small vertical movements to allow taps
    .onStart(() => {
      isDragging.value = true
    })
    .onUpdate((event) => {
      // Allow dragging up (negative) freely, drag down (positive) with resistance
      if (event.translationY < 0) {
        translateY.value = event.translationY
      } else {
        translateY.value = event.translationY * 0.15 // Heavy resistance
      }
    })
    .onEnd((event) => {
      isDragging.value = false
      if (event.translationY < -40 || event.velocityY < -500) {
        // Dismiss
        translateY.value = withSpring(
          -150,
          {
            damping: 20,
            stiffness: 200,
            mass: 0.5,
            velocity: event.velocityY,
          },
          (finished) => {
            if (finished) {
              runOnJS(setOpen)(false)
              runOnJS(hide)()
            }
          }
        )
      } else {
        // Spring back
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
          mass: 0.8,
        })
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  // Custom Entering Animation (Slide from Top)
  // We use a useEffect to trigger the entering animation manually to ensure control
  // But we can also use the entering prop if we define it as a worklet correctly.
  // However, since we are managing translateY manually for gestures, it's better to control it fully.

  if (!activeToast || !open) return null

  const borderColor =
    activeToast.type === "error"
      ? "border-destructive"
      : activeToast.type === "success"
        ? "border-green-500"
        : activeToast.type === "warning"
          ? "border-yellow-500"
          : "border-primary"

  const iconColor =
    activeToast.type === "error"
      ? "text-destructive"
      : activeToast.type === "success"
        ? "text-green-500"
        : activeToast.type === "warning"
          ? "text-yellow-500"
          : "text-primary"

  return (
    <Portal name="toast-portal">
      <View
        style={{
          top: insets.top + 10,
          left: 16,
          right: 16,
          position: "absolute",
          zIndex: 9999,
        }}
        pointerEvents="box-none"
        className="flex-row justify-center"
      >
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[{ width: "100%", maxWidth: 450 }, animatedStyle]}
          >
            <ToastPrimitive.Root
              type="foreground"
              open={open}
              onOpenChange={(isOpen) => {
                setOpen(isOpen)
                if (!isOpen) hide()
              }}
              className={cn(
                "flex-row items-center justify-between w-full p-2 bg-card border rounded-[--radius] shadow-lg shadow-black/20",
                borderColor
              )}
            >
              <View className="flex-1 gap-1 mr-2">
                <ToastPrimitive.Title
                  className={cn("font-mono-bold", iconColor)}
                >
                  {activeToast.title}
                </ToastPrimitive.Title>

                {activeToast.message && (
                  <ToastPrimitive.Description className="text-muted-foreground">
                    {activeToast.message}
                  </ToastPrimitive.Description>
                )}
              </View>

              <Button
                variant="ghost"
                onPress={() => {
                  translateY.value = withSpring(
                    -150,
                    {
                      damping: 20,
                      stiffness: 200,
                      mass: 0.5,
                    },
                    (finished) => {
                      if (finished) {
                        runOnJS(setOpen)(false)
                        runOnJS(hide)()
                      }
                    }
                  )
                }}
              >
                <Icon as={X} />
              </Button>
            </ToastPrimitive.Root>
          </Animated.View>
        </GestureDetector>
      </View>
    </Portal>
  )
}

export { toast } from "@/lib/store/toast-store"
