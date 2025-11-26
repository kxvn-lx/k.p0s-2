import { useTheme } from "@react-navigation/native"
import { Tabs } from "expo-router"

import { getTabOptions } from "@/lib/navigation"

// ----- Authenticated Tabs Layout -----
export default function AuthenticatedLayout() {
  const theme = useTheme()

  return (
    <Tabs screenOptions={getTabOptions(theme)}>
      <Tabs.Screen
        name="keranjang"
        options={{
          title: 'KERANJANG',
        }}
      />
      <Tabs.Screen
        name="stok"
        options={{
          title: "STOK",
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "MENU",
        }}
      />
    </Tabs>
  )
}
