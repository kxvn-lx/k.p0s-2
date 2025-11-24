import { View, ActivityIndicator } from "react-native"
import { Text } from "../ui/text"
import { cn } from "@/lib/utils"

interface StatusMessageProps {
  isLoading?: boolean
  message?: string
  type?: "default" | "error" | "muted"
  className?: string
}

export function StatusMessage({
  isLoading,
  message,
  type = "default",
  className,
}: StatusMessageProps) {
  if (isLoading) {
    return (
      <View className={cn("flex-1 items-center justify-center p-4", className)}>
        <ActivityIndicator size="large" />
        {message && (
          <Text className="mt-4 text-muted-foreground text-center">
            {message}
          </Text>
        )}
      </View>
    )
  }

  return (
    <View className={cn("flex-1 items-center justify-center p-4", className)}>
      <Text
        className={cn(
          "text-center",
          type === "error" && "text-destructive",
          type === "muted" && "text-muted-foreground"
        )}
      >
        {message}
      </Text>
    </View>
  )
}
