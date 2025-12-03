// ----- IMPORTS -----
import React from "react"
import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import { ChevronRight, type LucideIcon } from "lucide-react-native"
import PressableRow from "@/components/shared/pressable-row"

// ----- TYPES -----
interface InfoRowProps {
  leadingElement?: React.ReactNode | string
  trailingElement?: React.ReactNode | string
  leadingIcon?: LucideIcon
  trailingIcon?: LucideIcon | null
  onPress?: () => void
  isLast?: boolean
  className?: string
  iconBackgroundColor?: string
  iconColor?: string
  iconClassName?: string
  destructive?: boolean
  /**
   * Which side should be treated as primary (emphasised). Defaults to 'leading'.
   */
  primarySide?: "leading" | "trailing"
  /** optional className applied to leading text when it's a primitive string */
  leadingTextClassName?: string
  /** optional className applied to trailing text when it's a primitive string */
  trailingTextClassName?: string
}

// ----- COMPONENT -----
export default function InfoRow({
  leadingElement,
  trailingElement,
  leadingIcon,
  trailingIcon,
  onPress,
  isLast = false,
  className,
  iconBackgroundColor,
  iconColor = "white",
  iconClassName,
  destructive = false,
  primarySide = "leading",
  leadingTextClassName,
  trailingTextClassName,
}: InfoRowProps) {
  // Determine if we should show a chevron automatically if onPress is present and no trailingIcon is provided
  // If trailingIcon is explicitly null, we show nothing.
  const finalTrailingIcon = trailingIcon === null ? null : (trailingIcon ?? (onPress ? ChevronRight : undefined))

  const isLeadingPrimary = primarySide === "leading"

  const renderLeading = () => {
    if (typeof leadingElement === "string") {
      return (
        <Text
          className={cn(
            "flex-1 text-base",
            destructive ? "text-destructive" : (isLeadingPrimary ? "text-foreground" : "text-muted-foreground"),
            leadingTextClassName
          )}
        >
          {leadingElement}
        </Text>
      )
    }
    return leadingElement
  }

  const renderTrailing = () => {
    const isTrailingPrimary = primarySide === "trailing"

    if (typeof trailingElement === "string") {
      return (
        <Text
          className={cn(
            isTrailingPrimary ? "text-base text-foreground" : "text-muted-foreground",
            trailingTextClassName
          )}
        >
          {trailingElement}
        </Text>
      )
    }
    return trailingElement
  }

  const renderIcon = () => {
    if (!leadingIcon) return null

    const iconIsMuted = primarySide === "trailing"

    if (iconBackgroundColor) {
      return (
        <View
          className="size-7 rounded-[--radius] items-center justify-center ml-2"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Icon as={leadingIcon} size={16} color={iconColor} className={iconIsMuted ? "text-muted-foreground" : undefined} />
        </View>
      )
    }

    return (
      <Icon
        as={leadingIcon}
        size={16}
        className={cn(
          "ml-2",
          destructive ? "text-destructive" : (primarySide === "trailing" ? "text-muted-foreground" : "text-foreground"),
          iconClassName
        )}
      />
    )
  }

  const content = (
    <>
      {renderIcon()}

      <View
        className={cn(
          "flex-1 flex-row items-center justify-between p-2",
          !isLast && "border-b border-border"
        )}
      >
        {renderLeading()}

        <View className="flex-row items-center gap-2">
          {renderTrailing()}

          {finalTrailingIcon && (
            <Icon
              as={finalTrailingIcon}
              size={16}
              className={cn(primarySide === "trailing" ? "text-foreground" : "text-muted-foreground")}
            />
          )}
        </View>
      </View>
    </>
  )

  const wrapperClassName = cn(
    "flex-row items-center pgap-x-2",
    className
  )

  if (!onPress) {
    return <View className={wrapperClassName}>{content}</View>
  }

  return (
    <PressableRow onPress={onPress} className={wrapperClassName}>
      {content}
    </PressableRow>
  )
}
