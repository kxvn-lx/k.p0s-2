// ----- IMPORTS -----
import React from "react"
import { View, Pressable } from "react-native"
import { Text } from "@/components/ui/text"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import { ChevronRight, type LucideIcon } from "lucide-react-native"
import PressableRow from "@/components/shared/pressable-row"

// ----- TYPES -----
interface InfoRowProps {
  label?: string | React.ReactNode
  value?: string
  containerClassName?: string
  labelClassName?: string
  valueClassName?: string
  leadingIcon?: LucideIcon
  leadingElement?: React.ReactNode
  trailingElement?: React.ReactNode
  trailingIcon?: LucideIcon
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
  leadingElement,
  trailingElement,
  trailingIcon,
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

  const renderLabel = () => {
    if (typeof label === 'string') {
      return (
        <Text
          variant="muted"
          className={cn("flex-1 uppercase text-sm", labelClassName)}
        >
          {label}
        </Text>
      )
    }
    return label
  }

  const content = (
    <>
      <View className="mr-2">{leadingElement}</View>
      {leadingIcon && (
        <Icon as={leadingIcon} size={16} className="mr-2 text-foreground" />
      )}
      {renderLabel()}
      <View className="ml-2">{trailingElement}</View>
      {trailingIcon && (
        <Icon as={trailingIcon} size={16} className="ml-2 text-muted-foreground" />
      )}
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
    isLast && "border-b-0",
    containerClassName
  )

  if (!onPress) {
    return <View className={className}>{content}</View>
  }

  return (
    <PressableRow onPress={onPress} className={className}>
      {content}
    </PressableRow>
  )
}
