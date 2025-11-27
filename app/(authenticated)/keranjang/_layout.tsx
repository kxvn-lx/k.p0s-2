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
      <Stack.Screen
        name="pembayaran"
        options={{
          title: "PEMBAYARAN",
        }}
      />
      <Stack.Screen
        name="selesai"
        options={{
          headerShown: false,
          title: "SELESAI",
          headerLeft: () => null,
          headerBackVisible: false,
          headerBackTitle: undefined,
          gestureEnabled: false,
          presentation: "fullScreenModal"
        }}
      />
    </Stack>
  )
}
