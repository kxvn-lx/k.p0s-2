import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs"
import { Theme } from "@react-navigation/native"
import { NativeStackNavigationOptions } from "@react-navigation/native-stack"

export const getStackOptions = (theme: Theme): NativeStackNavigationOptions => {
  const { colors } = theme
  return {
    headerShown: true,
    headerStyle: {
      backgroundColor: colors.card,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontFamily: "UbuntuMono_700Bold",
      fontSize: 16,
    },
    headerShadowVisible: true,
    headerBackTitle: "Kembali",
  }
}

export const getTabOptions = (theme: Theme): BottomTabNavigationOptions => {
  const { colors } = theme
  return {
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
  }
}
