import { useTheme } from "@react-navigation/native"
import { Tabs } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

// ----- Authenticated Tabs Layout -----
export default function AuthenticatedLayout() {
  const { colors } = useTheme()

  return (
    <SafeAreaView edges={["top"]} className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          tabBarLabelStyle: {
            fontFamily: "UbuntuMono_700Bold",
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="penjualan"
          options={{
            title: "PENJUALAN",
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "MENU",
          }}
        />
      </Tabs>
    </SafeAreaView>
  )
}
