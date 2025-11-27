import { useTheme } from "@react-navigation/native"
import { Tabs } from "expo-router"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { getTabOptions } from "@/lib/navigation"
import { getThemeColors } from "@/lib/theme"
import { hslToRgb } from "@/lib/utils"
import { useThemeStore } from "@/lib/store/theme-store"
import { useColorScheme } from "react-native"

// ----- Authenticated Tabs Layout -----
export default function AuthenticatedLayout() {
  const theme = useTheme()
  const isDark = useColorScheme() === "dark"
  const themeType = useThemeStore((s) => s.theme)
  const themeColors = getThemeColors(themeType, isDark ? "dark" : "light")
  const inactiveColor = hslToRgb(themeColors.accent)

  // ----- Tab Icon Map -----
  const iconMap = {
    keranjang: (focused: boolean, color: string, size: number) => (
      <Ionicons
        name={focused ? "cart" : "cart-outline"}
        size={size}
        color={color}
      />
    ),
    stok: (focused: boolean, color: string, size: number) => (
      <MaterialCommunityIcons
        name={focused ? "archive" : "archive-outline"}
        size={size}
        color={color}
      />
    ),
    ringkasan: (focused: boolean, color: string, size: number) => (
      <Ionicons
        name={focused ? "stats-chart" : "stats-chart-outline"}
        size={size}
        color={color}
      />
    ),
    menu: (focused: boolean, color: string, size: number) => (
      <Ionicons
        name={focused ? "grid" : "grid-outline"}
        size={size}
        color={color}
      />
    ),
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        ...getTabOptions(theme, inactiveColor),
        tabBarIcon: ({ focused, color, size }) => {
          const iconFn = iconMap[route.name as keyof typeof iconMap]
          return iconFn ? iconFn(focused, color, size) : null
        },
      })}
    >
      <Tabs.Screen name="keranjang" options={{ title: "Keranjang" }} />
      <Tabs.Screen name="stok" options={{ title: "Stok" }} />
      <Tabs.Screen name="ringkasan" options={{ title: "Ringkasan" }} />
      <Tabs.Screen name="menu" options={{ title: "Menu" }} />
    </Tabs>
  )
}
