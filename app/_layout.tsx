import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import "../global.css";
import { NAV_THEME } from "../lib/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}
