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
      fontFamily: "UbuntuMono_700Bold"
    },
    headerShadowVisible: true,
    headerBackTitleStyle: {
      fontSize: 14
    }
  }
}

export const getTabOptions = (
  theme: Theme,
  mutedColor?: string
): BottomTabNavigationOptions => {
  const { colors } = theme
  return {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.card,
      borderTopColor: colors.border,
      borderTopWidth: 1,
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: mutedColor || colors.text,
    tabBarLabelStyle: {
      fontFamily: "UbuntuMono_700Bold",
    },
  }
}
