// ----- Imports -----
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import {
  View,
  Pressable,
  type PressableProps,
  type GestureResponderEvent,
} from "react-native"
import * as React from "react"
import type { ReactNode } from "react"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import { Text, TextClassContext } from "@/components/ui/text"
import { haptic, type HapticType } from "@/lib/utils/haptics"

// ----- Variants -----
const buttonVariants = cva(
  "flex items-center justify-center rounded-[--radius] transition-colors opacity-100 disabled:opacity-25",
  {
    variants: {
      variant: {
        default: "bg-primary active:opacity-90",
        secondary: "bg-secondary active:opacity-90",
        destructive: "bg-destructive active:opacity-90",
        outline: "border border-border bg-background active:bg-accent",
        ghost: "active:bg-accent",
        bare: "bg-none",
      },
      size: {
        default: "h-10 px-2",
        sm: "h-8 px-3 text-xs",
        icon: "h-7 px-2",
        bare: "h-fit",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const buttonTextVariants = cva("font-medium text-center", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      ghost: "text-foreground",
      bare: "text-foreground",
    },
    size: {
      default: "text-base",
      sm: "text-xs",
      icon: "text-sm",
      bare: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

// ----- Types -----
type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    title?: string
    children?: ReactNode
    textClassName?: string
    disableHaptics?: boolean
    hapticType?: HapticType
  }

// ----- Component -----
function Button({
  className,
  textClassName,
  variant,
  size,
  title,
  children,
  disableHaptics,
  hapticType = "selection",
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  disabled,
  ...props
}: ButtonProps) {
  const opacity = useSharedValue(1)
  const scale = useSharedValue(1)
  const { style, ...rest } = props as PressableProps

  const safeOnPressIn = React.useCallback(
    (e?: GestureResponderEvent) => {
      if (onPressIn && e) onPressIn(e)
    },
    [onPressIn]
  )

  const safeOnPressOut = React.useCallback(
    (e?: GestureResponderEvent) => {
      if (onPressOut && e) onPressOut(e)
    },
    [onPressOut]
  )

  const safeOnPress = React.useCallback(
    (e?: GestureResponderEvent) => {
      if (onPress && e) onPress(e)
    },
    [onPress]
  )

  const handlePressIn = React.useCallback(
    (e?: GestureResponderEvent) => {
      opacity.value = withTiming(0.75, { duration: 100 })
      scale.value = withTiming(0.98, { duration: 100 })
      if (!disableHaptics) haptic(hapticType)
      safeOnPressIn(e)
    },
    [disableHaptics, hapticType, safeOnPressIn, opacity, scale]
  )

  const handlePressOut = React.useCallback(
    (e?: GestureResponderEvent) => {
      opacity.value = withTiming(1, { duration: 100 })
      scale.value = withTiming(1, { duration: 100 })
      safeOnPressOut(e)
    },
    [safeOnPressOut, opacity, scale]
  )

  const handlePress = React.useCallback(
    (e?: GestureResponderEvent) => {
      if (disabled) return
      safeOnPress(e)
    },
    [disabled, safeOnPress]
  )

  const handleLongPress = React.useCallback(
    (e?: GestureResponderEvent) => {
      if (disabled || !onLongPress) return
      if (!disableHaptics) haptic("impact")
      if (e) onLongPress(e)
    },
    [disabled, onLongPress, disableHaptics]
  )

  const animatedStyle = useAnimatedStyle(() => {
    // detect simple flex hints coming from className and include them in the animated style
    const flexStyle: Record<string, number | string> = {}
    if (className?.includes("flex-1")) flexStyle.flex = 1
    if (className?.includes("flex-none")) flexStyle.flex = 0
    if (className?.includes("flex-auto")) flexStyle.flex = "auto"

    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
      ...flexStyle,
    }
  })

  return (
    <TextClassContext.Provider
      value={buttonTextVariants({
        variant: variant,
        size: size,
        className: "web:pointer-events-none",
      })}
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
          {...(rest as PressableProps)}
          disabled={disabled}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          onLongPress={onLongPress ? handleLongPress : undefined}
          className={cn(
            buttonVariants({ variant, size: size, className }),
            disabled && "web:pointer-events-none"
          )}
        >
          <View
            pointerEvents={disabled ? "none" : "auto"}
            style={typeof style === "function" ? undefined : style}
          >
            {children ? (
              <View className="flex-row items-center justify-center gap-2">
                {children}
                {title ? (
                  <Text
                    className={cn(
                      buttonTextVariants({ variant: variant, size: size }),
                      textClassName
                    )}
                  >
                    {title}
                  </Text>
                ) : null}
              </View>
            ) : (
              <Text
                className={cn(
                  buttonTextVariants({ variant: variant, size: size }),
                  textClassName
                )}
              >
                {title}
              </Text>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </TextClassContext.Provider>
  )
}

export { Button, buttonTextVariants, buttonVariants }
