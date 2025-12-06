import { useTheme } from "@react-navigation/native"
import { Stack } from "expo-router"

import { getStackOptions } from "@/lib/utils/navigation"

export default function StokLayout() {
  const theme = useTheme()

  return (
    <Stack screenOptions={getStackOptions(theme)}>
      <Stack.Screen
        name="index"
        options={{
          title: "STOK",
        }}
      />
      <Stack.Screen
        name="[id]"
      />
    </Stack>
  )
}
