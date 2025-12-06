import { useTheme } from "@react-navigation/native"
import { Stack } from "expo-router"

import { getStackOptions } from "@/lib/utils/navigation"

export default function MenuLayout() {
  const theme = useTheme()

  return (
    <Stack screenOptions={getStackOptions(theme)}>
      <Stack.Screen
        name="index"
        options={{
          title: "MENU",
        }}
      />
      <Stack.Screen
        name="printer"
        options={{
          title: "PRINTER",
        }}
      />
    </Stack>
  )
}
