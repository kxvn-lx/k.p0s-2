import { Tabs } from "expo-router"

// ----- Authenticated Tabs Layout -----
export default function AuthenticatedLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="penjualan"
        options={{
          title: "Penjualan",
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
        }}
      />
    </Tabs>
  )
}
