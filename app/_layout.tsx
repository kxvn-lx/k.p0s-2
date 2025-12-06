import {
  UbuntuMono_400Regular,
  UbuntuMono_700Bold,
  useFonts,
} from "@expo-google-fonts/ubuntu-mono"
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { useColorScheme, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import "../global.css"
import { AuthProvider, useAuth } from "../lib/context/auth-context"
import { queryClient } from "../lib/config/query-client"
import { useThemeStore } from "../lib/store/theme-store"
import { getNavTheme } from "../lib/styles/theme"
import { ToastProvider } from "@/components/ui/toast"
import { useAppUpdates } from "@/features/menu/hooks/use-app-updates"

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

  // Auto-check for updates on app launch
  useAppUpdates(true)

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
    solar: "theme-solar",
    teduh: "theme-teduh",
  }
  const themeClass = themeClassMap[theme]
  const darkClass = colorScheme === "dark" ? "dark" : ""

  return (
    <View className={`flex-1 ${darkClass} ${themeClass}`}>
      <ThemeProvider value={navTheme}>
        <BottomSheetModalProvider>
          <ProtectedStackLayout />
          <ToastProvider />
          <PortalHost />
        </BottomSheetModalProvider>
      </ThemeProvider>
    </View>
  )
}

// ----- Root Layout -----
export default function RootLayout() {
  const statusBarColor = useColorScheme() === "dark" ? "light" : "dark"

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerLayout />
          <StatusBar style={statusBarColor} />
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
