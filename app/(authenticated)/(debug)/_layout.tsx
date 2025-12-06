import { getStackOptions } from "@/lib/utils/navigation"
import { useTheme } from "@react-navigation/native"
import { Stack } from "expo-router"

export default function DebugLayout() {
  const theme = useTheme()
  return (
    <Stack
      screenOptions={getStackOptions(theme)}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "DEBUG",
        }}
      />
      <Stack.Screen
        name="progress"
        options={{
          title: "Progress Dialog",
        }}
      />
      <Stack.Screen
        name="receipt-preview"
        options={{
          title: "Receipt Preview",
        }}
      />
    </Stack>
  )
}
