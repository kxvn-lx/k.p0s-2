import { useTheme } from "@react-navigation/native"
import { Stack } from "expo-router"

import { getStackOptions } from "@/lib/navigation"

export default function KeranjangLayout() {
  const theme = useTheme()

  return (
    <Stack screenOptions={getStackOptions(theme)}>
      <Stack.Screen
        name="index"
        options={{
          title: "KERANJANG",
        }}
      />
      <Stack.Screen
        name="perincian"
        options={{
          title: "PERINCIAN",
        }}
      />
    </Stack>
  )
}
