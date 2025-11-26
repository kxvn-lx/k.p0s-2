import {
  UbuntuMono_400Regular,
  UbuntuMono_700Bold,
  useFonts,
} from "@expo-google-fonts/ubuntu-mono"
import { ThemeProvider } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { useColorScheme, View } from "react-native"
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import "../global.css"
import { AuthProvider, useAuth } from "../lib/auth-context"
import { queryClient } from "../lib/query-client"
import { useThemeStore } from "../lib/store/theme-store"
import { getNavTheme } from "../lib/theme"

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated"

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
})

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
  const { isLoading } = useAuth()

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync()
    }
  }, [loaded, isLoading])

  if (!loaded || isLoading) {
    return null
  }

  const navTheme = getNavTheme(theme, colorScheme ?? "light")
  const themeClass = theme === "sunset" ? "theme-sunset" : ""
  const darkClass = colorScheme === "dark" ? "dark" : ""

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className={`flex-1 ${darkClass} ${themeClass}`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={navTheme}>
            <AuthProvider>
              <ProtectedStackLayout />
              <PortalHost />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </View>
    </GestureHandlerRootView>
  )
}
