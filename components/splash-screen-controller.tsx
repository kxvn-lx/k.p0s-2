import { SplashScreen } from "expo-router"
import { useAuth } from "../lib/auth-context"

SplashScreen.preventAutoHideAsync()

export function SplashScreenController() {
  const { isLoading } = useAuth()

  if (!isLoading) {
    SplashScreen.hideAsync()
  }

  return null
}
