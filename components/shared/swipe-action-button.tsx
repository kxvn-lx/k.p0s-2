// ----- Swipe Action Button -----
// Unified action button for swipeable rows
import { memo } from "react"
import { StyleSheet, type ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { Text } from "@/components/ui/text"
import { Icon } from "@/components/ui/icon"
import type { LucideIcon } from "lucide-react-native"

// ----- Types -----
type SwipeActionVariant = "primary" | "secondary" | "destructive" | "success" | "warning"

type SwipeActionButtonProps = {
  label: string
  icon?: LucideIcon
  variant?: SwipeActionVariant
  onPress: () => void
  style?: ViewStyle
}

// ----- Color Mapping -----
const VARIANT_COLORS: Record<SwipeActionVariant, string> = {
  primary: "#3b82f6",
  secondary: "#6b7280",
  destructive: "#ef4444",
  success: "#16a34a",
  warning: "#f97316",
}

// ----- Component -----
function SwipeActionButton({
  label,
  icon,
  variant = "primary",
  onPress,
  style,
}: SwipeActionButtonProps) {
  const backgroundColor = VARIANT_COLORS[variant]

  return (
    <RectButton
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
    >
      {icon && <Icon as={icon} size={16} className="text-white" />}
      <Text className="text-white text-xs font-bold mt-1">{label}</Text>
    </RectButton>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
})

export default memo(SwipeActionButton)
export { type SwipeActionVariant, type SwipeActionButtonProps }
