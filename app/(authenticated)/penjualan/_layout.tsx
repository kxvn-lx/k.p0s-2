import { useTheme } from "@react-navigation/native"
import { Stack } from "expo-router"

import { getStackOptions } from "@/lib/navigation"

export default function PenjualanLayout() {
  const theme = useTheme()

  return (
    <Stack screenOptions={getStackOptions(theme)}>
      <Stack.Screen
        name="index"
        options={{
          title: "PENJUALAN",
        }}
      />
    </Stack>
  )
}
