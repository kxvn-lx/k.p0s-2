import { Icon } from "@/components/ui/icon"
import { useToastStore } from "@/lib/store/toast-store"
import { cn } from "@/lib/utils"
import { Portal } from "@rn-primitives/portal"
import * as ToastPrimitive from "@rn-primitives/toast"
import * as Haptics from "expo-haptics"
import {
  AlertCircle,
  AlertTriangle,
  Check,
  Info,
} from "lucide-react-native"
import * as React from "react"
import { Platform, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// ----- Component -----
export function ToastProvider() {
  const { activeToast, hide } = useToastStore()
  const insets = useSafeAreaInsets()
  const [open, setOpen] = React.useState(false)

  // Animation Values
  const translateY = useSharedValue(-150)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.95)

  // Sync store state with local open state
  React.useEffect(() => {
    if (activeToast) {
      setOpen(true)
      
      // Haptic Feedback
      const feedbackType =
        activeToast.type === "error"
          ? Haptics.NotificationFeedbackType.Error
          : activeToast.type === "warning"
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      
      Haptics.notificationAsync(feedbackType)

      // Reset
      translateY.value = -150
      opacity.value = 0
      scale.value = 0.95

      // Animate In (iOS Notification Style)
      translateY.value = withSpring(0, {
        damping: 14,
        stiffness: 120,
        mass: 0.8,
      })
      opacity.value = withTiming(1, { duration: 200 })
      scale.value = withSpring(1, {
        damping: 14,
        stiffness: 120,
      })

    } else {
      setOpen(false)
    }
  }, [activeToast])

  // Handle auto-hide
  React.useEffect(() => {
    if (open && activeToast) {
      const duration = activeToast.duration || 4000
      const timer = setTimeout(() => {
        dismiss()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [open, activeToast, hide])

  const dismiss = () => {
    opacity.value = withTiming(0, { duration: 250 })
    scale.value = withTiming(0.95, { duration: 250 })
    translateY.value = withSpring(
      -150,
      {
        damping: 18,
        stiffness: 120,
        mass: 0.6,
      },
      (finished) => {
        if (finished) {
          runOnJS(setOpen)(false)
          runOnJS(hide)()
        }
      }
    )
  }

  // Gesture Handler
  const pan = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onUpdate((event) => {
      if (event.translationY < 0) {
        // Drag up to dismiss
        translateY.value = event.translationY
        opacity.value = 1 + event.translationY / 100
      } else {
        // Drag down resistance
        translateY.value = event.translationY * 0.2
      }
    })
    .onEnd((event) => {
      if (event.translationY < -30 || event.velocityY < -500) {
        runOnJS(dismiss)()
      } else {
        // Spring back
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        })
        opacity.value = withTiming(1)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }))

  if (!activeToast || !open) return null

  const getIcon = () => {
    switch (activeToast.type) {
      case "success":
        return <Icon as={Check} className="text-primary w-5 h-5" />
      case "error":
        return <Icon as={AlertCircle} className="text-destructive w-5 h-5" />
      case "warning":
        return <Icon as={AlertTriangle} className="text-amber-500 w-5 h-5" />
      default:
        return <Icon as={Info} className="text-primary w-5 h-5" />
    }
  }

  return (
    <Portal name="toast-portal">
      <View
        style={{
          top: insets.top + (Platform.OS === 'ios' ? 6 : 12),
          left: 12,
          right: 12,
          position: "absolute",
          zIndex: 9999,
          alignItems: 'center',
        }}
        pointerEvents="box-none"
      >
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              { 
                width: "100%", 
                maxWidth: 420, // Standard iOS notification width limit
              }, 
              animatedStyle
            ]}
          >
            <ToastPrimitive.Root
              type="foreground"
              open={open}
              onOpenChange={(isOpen) => {
                setOpen(isOpen)
                if (!isOpen) hide()
              }}
              className={cn(
                "flex-row items-center p-2 gap-2",
                "bg-card border border-border", 
                "rounded-[--radius]"
              )}
            >
              {/* Icon Container - subtle background for better hierarchy */}
              <View className={cn(
                "p-2 rounded-full shrink-0",
                activeToast.type === "error" ? "bg-destructive/10" :
                activeToast.type === "warning" ? "bg-amber-500/10" :
                "bg-primary/10"
              )}>
                {getIcon()}
              </View>

              {/* Text Content */}
              <View className="flex-1 justify-center gap-1">
                <ToastPrimitive.Title
                  className="font-mono-bold text-base text-card-foreground"
                >
                  {activeToast.title}
                </ToastPrimitive.Title>
                
                {activeToast.message && (
                  <ToastPrimitive.Description 
                    className="text text-muted-foreground"
                  >
                    {activeToast.message}
                  </ToastPrimitive.Description>
                )}
              </View>
            </ToastPrimitive.Root>
          </Animated.View>
        </GestureDetector>
      </View>
    </Portal>
  )
}

export { toast } from "@/lib/store/toast-store"
