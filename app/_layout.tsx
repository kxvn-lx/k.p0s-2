import { ThemeProvider } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { Stack } from "expo-router"
import { useColorScheme } from "react-native"
import { SplashScreenController } from "../components/splash-screen-controller"
import "../global.css"
import { AuthProvider, useAuth } from "../lib/auth-context"
import { NAV_THEME } from "../lib/theme"

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

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <AuthProvider>
        <SplashScreenController />
        <ProtectedStackLayout />
        <PortalHost />
      </AuthProvider>
    </ThemeProvider>
  )
}
