import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native"

// --- Sunset Colors ---
const SUNSET_DARK = {
  background: "hsl(0 0% 0%)",
  foreground: "hsl(34 100% 58%)",
  card: "hsl(0 0% 5%)",
  cardForeground: "hsl(34 100% 58%)",
  popover: "hsl(0 0% 5%)",
  popoverForeground: "hsl(34 100% 58%)",
  primary: "hsl(34 100% 58%)",
  primaryForeground: "hsl(0 0% 0%)",
  secondary: "hsl(0 0% 15%)",
  secondaryForeground: "hsl(34 100% 58%)",
  muted: "hsl(0 0% 15%)",
  mutedForeground: "hsl(34 80% 45%)",
  accent: "hsl(34 100% 58%)",
  accentForeground: "hsl(0 0% 0%)",
  destructive: "hsl(2 100% 62%)",
  destructiveForeground: "hsl(0 0% 100%)",
  border: "hsl(34 100% 25%)",
  input: "hsl(0 0% 10%)",
  ring: "hsl(34 100% 58%)",
  radius: "0rem",
}

const SUNSET_LIGHT = {
  background: "hsl(0 0% 100%)",
  foreground: "hsl(0 0% 0%)",
  card: "hsl(0 0% 100%)",
  cardForeground: "hsl(0 0% 0%)",
  popover: "hsl(0 0% 100%)",
  popoverForeground: "hsl(0 0% 0%)",
  primary: "hsl(34 100% 35%)",
  primaryForeground: "hsl(0 0% 100%)",
  secondary: "hsl(0 0% 94%)",
  secondaryForeground: "hsl(0 0% 0%)",
  muted: "hsl(0 0% 94%)",
  mutedForeground: "hsl(0 0% 40%)",
  accent: "hsl(34 100% 35%)",
  accentForeground: "hsl(0 0% 100%)",
  destructive: "hsl(4 100% 45%)",
  destructiveForeground: "hsl(0 0% 100%)",
  border: "hsl(0 0% 85%)",
  input: "hsl(0 0% 94%)",
  ring: "hsl(34 100% 35%)",
  radius: "0rem",
}

// --- Metal Colors (Sleek, Modern, Metallic) ---
const METAL_LIGHT = {
  background: "hsl(0 0% 98%)",
  foreground: "hsl(240 10% 3.9%)",
  card: "hsl(0 0% 100%)",
  cardForeground: "hsl(240 10% 3.9%)",
  popover: "hsl(0 0% 100%)",
  popoverForeground: "hsl(240 10% 3.9%)",
  primary: "hsl(240 5.9% 10%)",
  primaryForeground: "hsl(0 0% 98%)",
  secondary: "hsl(240 4.8% 95.9%)",
  secondaryForeground: "hsl(240 5.9% 10%)",
  muted: "hsl(240 4.8% 95.9%)",
  mutedForeground: "hsl(240 3.8% 46.1%)",
  accent: "hsl(240 4.8% 95.9%)",
  accentForeground: "hsl(240 5.9% 10%)",
  destructive: "hsl(0 84.2% 60.2%)",
  destructiveForeground: "hsl(0 0% 98%)",
  border: "hsl(240 5.9% 90%)",
  input: "hsl(240 5.9% 90%)",
  ring: "hsl(240 5% 64.9%)",
  radius: "0.5rem",
}

const METAL_DARK = {
  background: "hsl(240 10% 3.9%)",
  foreground: "hsl(0 0% 98%)",
  card: "hsl(240 10% 3.9%)",
  cardForeground: "hsl(0 0% 98%)",
  popover: "hsl(240 10% 3.9%)",
  popoverForeground: "hsl(0 0% 98%)",
  primary: "hsl(0 0% 98%)",
  primaryForeground: "hsl(240 5.9% 10%)",
  secondary: "hsl(240 3.7% 15.9%)",
  secondaryForeground: "hsl(0 0% 98%)",
  muted: "hsl(240 3.7% 15.9%)",
  mutedForeground: "hsl(240 5% 64.9%)",
  accent: "hsl(240 3.7% 15.9%)",
  accentForeground: "hsl(0 0% 98%)",
  destructive: "hsl(0 62.8% 30.6%)",
  destructiveForeground: "hsl(0 0% 98%)",
  border: "hsl(240 3.7% 15.9%)",
  input: "hsl(240 3.7% 15.9%)",
  ring: "hsl(240 4.9% 83.9%)",
  radius: "0.5rem",
}

export const getThemeColors = (
  theme: "metal" | "sunset",
  colorScheme: "light" | "dark"
) => {
  if (theme === "sunset") {
    return colorScheme === "dark" ? SUNSET_DARK : SUNSET_LIGHT
  }
  return colorScheme === "dark" ? METAL_DARK : METAL_LIGHT
}

export const getNavTheme = (
  theme: "metal" | "sunset",
  colorScheme: "light" | "dark"
): Theme => {
  const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme

  if (theme === "sunset") {
    if (colorScheme === "dark") {
      return {
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          background: "rgb(0, 0, 0)",
          border: "rgb(128, 77, 0)",
          card: "rgb(13, 13, 13)",
          notification: "rgb(255, 67, 61)",
          primary: "rgb(255, 160, 40)",
          text: "rgb(255, 160, 40)",
        },
      }
    } else {
      return {
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          background: "rgb(255, 255, 255)",
          border: "rgb(217, 217, 217)",
          card: "rgb(255, 255, 255)",
          notification: "rgb(230, 0, 0)",
          primary: "rgb(179, 107, 0)",
          text: "rgb(0, 0, 0)",
        },
      }
    }
  }

  // Metal Theme (Default)
  if (colorScheme === "dark") {
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: "rgb(9, 9, 11)", // #09090B
        border: "rgb(39, 39, 42)", // #27272A
        card: "rgb(9, 9, 11)", // #09090B
        notification: "rgb(127, 29, 29)", // Dark Red
        primary: "rgb(250, 250, 250)", // #FAFAFA
        text: "rgb(250, 250, 250)", // #FAFAFA
      },
    }
  } else {
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: "rgb(250, 250, 250)", // #FAFAFA
        border: "rgb(228, 228, 231)", // #E4E4E7
        card: "rgb(255, 255, 255)", // #FFFFFF
        notification: "rgb(220, 38, 38)", // Red
        primary: "rgb(24, 24, 27)", // #18181B
        text: "rgb(9, 9, 11)", // #09090B
      },
    }
  }
}
