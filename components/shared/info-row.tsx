// ----- IMPORTS -----
import { View, Pressable } from "react-native"
import { Text } from "@/components/ui/text"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import { ChevronRight, type LucideIcon } from "lucide-react-native"

// ----- TYPES -----
interface InfoRowProps {
  label: string
  value?: string
  containerClassName?: string
  labelClassName?: string
  valueClassName?: string
  leadingIcon?: LucideIcon
  onPress?: () => void
  showChevron?: boolean | LucideIcon
  isLast?: boolean
}

// ----- COMPONENT -----
export default function InfoRow({
  label,
  value,
  containerClassName,
  labelClassName,
  valueClassName,
  leadingIcon,
  onPress,
  showChevron,
  isLast = false,
}: InfoRowProps) {
  // Determine which chevron icon to show
  const getChevronIcon = (): LucideIcon | null => {
    if (showChevron === false) return null
    if (showChevron === true) return ChevronRight
    if (showChevron && typeof showChevron !== "boolean") return showChevron
    if (onPress) return ChevronRight
    return null
  }

  const chevronIcon = getChevronIcon()

  const content = (
    <>
      {leadingIcon && (
        <Icon as={leadingIcon} size={16} className="mr-2 text-foreground" />
      )}
      <Text
        variant="muted"
        className={cn("flex-1 uppercase text-sm", labelClassName)}
      >
        {label}
      </Text>
      {value && (
        <Text className={cn("text-foreground", valueClassName)}>{value}</Text>
      )}
      {chevronIcon && (
        <Icon
          as={chevronIcon}
          size={16}
          className="ml-2 text-muted-foreground"
        />
      )}
    </>
  )

  const className = cn(
    "flex-row items-center border-b border-border p-2",
    onPress && "active:bg-muted/50",
    isLast && "border-b-0",
    containerClassName
  )

  if (!onPress) {
    return <View className={className}>{content}</View>
  }

  return (
    <Pressable onPress={onPress} className={className}>
      {content}
    </Pressable>
  )
}
