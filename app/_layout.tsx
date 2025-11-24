import {
  UbuntuMono_400Regular,
  UbuntuMono_700Bold,
  useFonts,
} from "@expo-google-fonts/ubuntu-mono"
import { ThemeProvider } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { useColorScheme, View } from "react-native"
import { SplashScreenController } from "../components/splash-screen-controller"
import "../global.css"
import { AuthProvider, useAuth } from "../lib/auth-context"
import { useThemeStore } from "../lib/store/theme-store"
import { getNavTheme } from "../lib/theme"

// ----- Protected Stack Layout -----
function ProtectedStackLayout() {
  const { session } = useAuth()
  const isAuthenticated = !!session

  return (
    <Stack>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="index"
          options={{
            title: "Login",
            headerShown: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
          name="(authenticated)"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  )
}

// ----- Root Layout -----
export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light"
  const { theme } = useThemeStore()
  const [loaded] = useFonts({
    UbuntuMono_400Regular,
    UbuntuMono_700Bold,
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  const navTheme = getNavTheme(theme, colorScheme ?? "light")
  const themeClass = theme === "sunset" ? "theme-sunset" : ""
  const darkClass = colorScheme === "dark" ? "dark" : ""

  return (
    <View className={`flex-1 ${darkClass}`}>
      <View className={`flex-1 ${themeClass}`}>
        <ThemeProvider value={navTheme}>
          <AuthProvider>
            <SplashScreenController />
            <ProtectedStackLayout />
            <PortalHost />
          </AuthProvider>
        </ThemeProvider>
      </View>
    </View>
  )
}
