import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import type { ConnectionState } from "@/lib/printer/printer.types"

// ----- Types -----
type ConnectionStatusBadgeProps = {
  state: ConnectionState
  className?: string
}

// ----- Status Config -----
const statusConfig: Record<ConnectionState, { label: string; dotClass: string }> = {
  disconnected: { label: "Terputus", dotClass: "bg-muted-foreground" },
  connecting: { label: "Menghubungkan...", dotClass: "bg-warning" },
  connected: { label: "Terhubung", dotClass: "bg-green-500" },
  reconnecting: { label: "Menghubung ulang...", dotClass: "bg-warning" },
}

// ----- Component -----
export function ConnectionStatusBadge({ state, className }: ConnectionStatusBadgeProps) {
  const config = statusConfig[state]

  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <View className={cn("h-2 w-2 rounded-full", config.dotClass)} />
      <Text variant="muted" className="text-xs">
        {config.label}
      </Text>
    </View>
  )
}
