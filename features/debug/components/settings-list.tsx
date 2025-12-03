import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/ui/section-header"

// ----- TYPES -----

interface SettingsGroupProps {
  title?: string
  footer?: string
  children: React.ReactNode
  className?: string
}

// ----- COMPONENTS -----

export function SettingsGroup({ title, footer, children, className }: SettingsGroupProps) {
  return (
    <View className={cn("mt-4", className)}>
      {title && (
        <SectionHeader title={title} className="pt-0" />
      )}
      <View className="bg-card border border-border rounded-[--radius] overflow-hidden">
        {children}
      </View>
      {footer && (
        <Text className="px-4 mt-2 text-xs text-muted-foreground">
          {footer}
        </Text>
      )}
    </View>
  )
}
