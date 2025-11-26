import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native"

// ----- Theme Type -----
type ThemeType = "metal" | "sunset" | "solarized"

// ----- Sunset Colors (Bloomberg Terminal Inspired) -----
const SUNSET_DARK = {
  background: "hsl(0 0% 0%)",
  foreground: "hsl(36 100% 62%)",
  card: "hsl(30 15% 5%)",
  cardForeground: "hsl(36 95% 60%)",
  popover: "hsl(30 20% 7%)",
  popoverForeground: "hsl(36 100% 62%)",
  primary: "hsl(36 100% 50%)",
  primaryForeground: "hsl(0 0% 0%)",
  secondary: "hsl(30 10% 12%)",
  secondaryForeground: "hsl(36 90% 55%)",
  muted: "hsl(30 8% 15%)",
  mutedForeground: "hsl(36 60% 40%)",
  accent: "hsl(24 100% 50%)",
  accentForeground: "hsl(0 0% 0%)",
  destructive: "hsl(0 85% 60%)",
  destructiveForeground: "hsl(0 0% 100%)",
  border: "hsl(32 80% 20%)",
  input: "hsl(30 10% 12%)",
  ring: "hsl(36 100% 50%)",
  radius: "0.125rem",
}

const SUNSET_LIGHT = {
  background: "hsl(40 33% 98%)",
  foreground: "hsl(30 10% 15%)",
  card: "hsl(40 25% 95%)",
  cardForeground: "hsl(30 10% 15%)",
  popover: "hsl(40 40% 99%)",
  popoverForeground: "hsl(30 10% 15%)",
  primary: "hsl(32 95% 44%)",
  primaryForeground: "hsl(0 0% 100%)",
  secondary: "hsl(35 20% 90%)",
  secondaryForeground: "hsl(30 10% 15%)",
  muted: "hsl(35 15% 92%)",
  mutedForeground: "hsl(30 8% 45%)",
  accent: "hsl(24 95% 53%)",
  accentForeground: "hsl(0 0% 100%)",
  destructive: "hsl(0 72% 51%)",
  destructiveForeground: "hsl(0 0% 100%)",
  border: "hsl(35 15% 82%)",
  input: "hsl(35 20% 90%)",
  ring: "hsl(32 95% 44%)",
  radius: "0.125rem",
}

// ----- Metal Colors (Industrial, Minimal, Modern) -----
const METAL_LIGHT = {
  background: "hsl(0 0% 100%)",
  foreground: "hsl(240 10% 3.9%)",
  card: "hsl(240 5% 96%)",
  cardForeground: "hsl(240 10% 3.9%)",
  popover: "hsl(0 0% 100%)",
  popoverForeground: "hsl(240 10% 3.9%)",
  primary: "hsl(240 5.9% 10%)",
  primaryForeground: "hsl(0 0% 98%)",
  secondary: "hsl(240 4.8% 95.9%)",
  secondaryForeground: "hsl(240 5.9% 10%)",
  muted: "hsl(240 4.8% 95.9%)",
  mutedForeground: "hsl(240 3.8% 46.1%)",
  accent: "hsl(240 5% 84%)",
  accentForeground: "hsl(240 5.9% 10%)",
  destructive: "hsl(0 84% 60%)",
  destructiveForeground: "hsl(0 0% 100%)",
  border: "hsl(240 6% 90%)",
  input: "hsl(240 6% 90%)",
  ring: "hsl(240 5% 65%)",
  radius: "0.5rem",
}

const METAL_DARK = {
  background: "hsl(240 10% 3.9%)",
  foreground: "hsl(0 0% 98%)",
  card: "hsl(240 6% 10%)",
  cardForeground: "hsl(0 0% 98%)",
  popover: "hsl(240 6% 10%)",
  popoverForeground: "hsl(0 0% 98%)",
  primary: "hsl(0 0% 98%)",
  primaryForeground: "hsl(240 5.9% 10%)",
  secondary: "hsl(240 4% 16%)",
  secondaryForeground: "hsl(0 0% 98%)",
  muted: "hsl(240 4% 16%)",
  mutedForeground: "hsl(240 5% 65%)",
  accent: "hsl(240 4% 26%)",
  accentForeground: "hsl(0 0% 98%)",
  destructive: "hsl(0 63% 31%)",
  destructiveForeground: "hsl(0 0% 98%)",
  border: "hsl(240 4% 16%)",
  input: "hsl(240 4% 16%)",
  ring: "hsl(240 5% 84%)",
  radius: "0.5rem",
}

// ----- Solarized Colors (Eye-Friendly, Scientific Precision) -----
const SOLARIZED_LIGHT = {
  background: "hsl(44 87% 94%)",
  foreground: "hsl(192 81% 14%)",
  card: "hsl(44 71% 88%)",
  cardForeground: "hsl(192 81% 14%)",
  popover: "hsl(44 87% 94%)",
  popoverForeground: "hsl(192 81% 14%)",
  primary: "hsl(205 82% 41%)",
  primaryForeground: "hsl(44 87% 94%)",
  secondary: "hsl(44 71% 88%)",
  secondaryForeground: "hsl(196 25% 47%)",
  muted: "hsl(44 50% 85%)",
  mutedForeground: "hsl(194 14% 40%)",
  accent: "hsl(175 59% 40%)",
  accentForeground: "hsl(44 87% 94%)",
  destructive: "hsl(1 71% 52%)",
  destructiveForeground: "hsl(44 87% 94%)",
  border: "hsl(46 42% 76%)",
  input: "hsl(44 60% 90%)",
  ring: "hsl(205 82% 41%)",
  radius: "0.375rem",
}

const SOLARIZED_DARK = {
  background: "hsl(192 100% 11%)",
  foreground: "hsl(186 8% 55%)",
  card: "hsl(192 90% 13%)",
  cardForeground: "hsl(186 13% 59%)",
  popover: "hsl(192 100% 11%)",
  popoverForeground: "hsl(186 8% 55%)",
  primary: "hsl(205 82% 41%)",
  primaryForeground: "hsl(186 13% 59%)",
  secondary: "hsl(192 90% 13%)",
  secondaryForeground: "hsl(186 8% 55%)",
  muted: "hsl(194 35% 18%)",
  mutedForeground: "hsl(195 23% 34%)",
  accent: "hsl(175 59% 40%)",
  accentForeground: "hsl(192 100% 11%)",
  destructive: "hsl(1 71% 52%)",
  destructiveForeground: "hsl(186 13% 59%)",
  border: "hsl(194 35% 18%)",
  input: "hsl(192 90% 13%)",
  ring: "hsl(205 82% 41%)",
  radius: "0.375rem",
}

export const getThemeColors = (
  theme: ThemeType,
  colorScheme: "light" | "dark",
  opacity?: number
): Record<string, string> => {
  let colors: Record<string, string>
  if (theme === "sunset") {
    colors = colorScheme === "dark" ? SUNSET_DARK : SUNSET_LIGHT
  } else if (theme === "solarized") {
    colors = colorScheme === "dark" ? SOLARIZED_DARK : SOLARIZED_LIGHT
  } else {
    colors = colorScheme === "dark" ? METAL_DARK : METAL_LIGHT
  }

  if (opacity === undefined) return colors

  // Convert all HSL colors to HSLA with opacity
  const withOpacity: Record<string, string> = {}
  for (const key in colors) {
    const value = colors[key]
    if (value.startsWith("hsl(")) {
      // Extract the HSL values
      const hslMatch = value.match(/hsl\(([^)]+)\)/)
      if (hslMatch) {
        withOpacity[key] = `hsla(${hslMatch[1]}, ${opacity})`
      } else {
        withOpacity[key] = value
      }
    } else {
      withOpacity[key] = value
    }
  }
  return withOpacity
}

export const getNavTheme = (
  theme: ThemeType,
  colorScheme: "light" | "dark"
): Theme => {
  const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme

  let colors: Record<string, string> = {}
  if (theme === "sunset") {
    colors = colorScheme === "dark" ? SUNSET_DARK : SUNSET_LIGHT
  } else if (theme === "solarized") {
    colors = colorScheme === "dark" ? SOLARIZED_DARK : SOLARIZED_LIGHT
  } else {
    colors = colorScheme === "dark" ? METAL_DARK : METAL_LIGHT
  }

  // Only assign allowed keys for React Navigation Theme.colors
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colors.background,
      card: colors.card,
      border: colors.border,
      primary: colors.primary,
      notification: baseTheme.colors.notification,
      text: colors.foreground,
    },
    // For app-wide usage, use getThemeColors for all tokens
  }
}
