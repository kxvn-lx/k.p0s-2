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
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
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

// ----- Inner Layout (requires AuthProvider) -----
function InnerLayout() {
  const colorScheme = useColorScheme() ?? "light"
  const { theme } = useThemeStore()
  const { isLoading } = useAuth()
  const [loaded] = useFonts({
    UbuntuMono_400Regular,
    UbuntuMono_700Bold,
  })

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync()
    }
  }, [loaded, isLoading])

  if (!loaded || isLoading) {
    return null
  }

  const navTheme = getNavTheme(theme, colorScheme)
  const themeClassMap = {
    metal: "",
    sunset: "theme-sunset",
    solarized: "theme-solarized",
  }
  const themeClass = themeClassMap[theme]
  const darkClass = colorScheme === "dark" ? "dark" : ""

  return (
    <View className={`flex-1 ${darkClass} ${themeClass}`}>
      <ThemeProvider value={navTheme}>
        <BottomSheetModalProvider>
          <ProtectedStackLayout />
          <PortalHost />
        </BottomSheetModalProvider>
      </ThemeProvider>
    </View>
  )
}

// ----- Root Layout -----
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerLayout />
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
