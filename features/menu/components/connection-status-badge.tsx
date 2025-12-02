import { View } from "react-native"
import { cn } from "@/lib/utils"
import { ConnectionState } from "@/lib/printer/types/bluetooth.types"

// ----- Types -----
type ConnectionStatusBadgeProps = {
  state: ConnectionState
  className?: string
}

// ----- Status Config -----
const statusConfig: Record<ConnectionState, { dotClass: string }> = {
  disconnected: { dotClass: "bg-muted-foreground" },
  connecting: { dotClass: "bg-warning" },
  connected: { dotClass: "bg-green-500" },
  reconnecting: { dotClass: "bg-warning" },
}

// ----- Component -----
export function ConnectionStatusBadge({ state, className }: ConnectionStatusBadgeProps) {
  const config = statusConfig[state]

  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <View className={cn("h-2 w-2 rounded-full", config.dotClass)} />
    </View>
  )
}
