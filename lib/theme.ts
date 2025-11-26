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
  colorScheme: "light" | "dark"
) => {
  if (theme === "sunset") {
    return colorScheme === "dark" ? SUNSET_DARK : SUNSET_LIGHT
  }
  if (theme === "solarized") {
    return colorScheme === "dark" ? SOLARIZED_DARK : SOLARIZED_LIGHT
  }
  return colorScheme === "dark" ? METAL_DARK : METAL_LIGHT
}

export const getNavTheme = (
  theme: ThemeType,
  colorScheme: "light" | "dark"
): Theme => {
  const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme

  // ----- Sunset Theme (Bloomberg Terminal) -----
  if (theme === "sunset") {
    if (colorScheme === "dark") {
      return {
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          background: "rgb(0, 0, 0)",
          border: "rgb(92, 64, 8)",
          card: "rgb(15, 13, 10)",
          notification: "rgb(244, 67, 54)",
          primary: "rgb(255, 149, 0)",
          text: "rgb(255, 170, 51)",
        },
      }
    } else {
      return {
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          background: "rgb(253, 252, 250)",
          border: "rgb(217, 211, 199)",
          card: "rgb(247, 245, 240)",
          notification: "rgb(220, 38, 38)",
          primary: "rgb(218, 139, 6)",
          text: "rgb(42, 37, 32)",
        },
      }
    }
  }

  // ----- Solarized Theme (Eye-Friendly) -----
  if (theme === "solarized") {
    if (colorScheme === "dark") {
      return {
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          background: "rgb(0, 43, 54)", // base03
          border: "rgb(7, 54, 66)", // base02
          card: "rgb(7, 54, 66)", // base02
          notification: "rgb(220, 50, 47)", // red
          primary: "rgb(38, 139, 210)", // blue
          text: "rgb(131, 148, 150)", // base0
        },
      }
    } else {
      return {
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          background: "rgb(253, 246, 227)", // base3
          border: "rgb(211, 203, 184)",
          card: "rgb(238, 232, 213)", // base2
          notification: "rgb(220, 50, 47)", // red
          primary: "rgb(38, 139, 210)", // blue
          text: "rgb(7, 54, 66)", // base02
        },
      }
    }
  }

  // ----- Metal Theme (Default) -----
  if (colorScheme === "dark") {
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: "rgb(9, 9, 11)",
        border: "rgb(39, 39, 42)",
        card: "rgb(24, 24, 27)",
        notification: "rgb(127, 29, 29)",
        primary: "rgb(250, 250, 250)",
        text: "rgb(250, 250, 250)",
      },
    }
  } else {
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: "rgb(255, 255, 255)",
        border: "rgb(228, 228, 231)",
        card: "rgb(244, 244, 245)",
        notification: "rgb(239, 68, 68)",
        primary: "rgb(24, 24, 27)",
        text: "rgb(9, 9, 11)",
      },
    }
  }
}
