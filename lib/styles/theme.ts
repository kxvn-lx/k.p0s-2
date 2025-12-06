import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native"

// ----- Theme Type -----
type ThemeType = "metal" | "solar" | "teduh"

// ----- Theme Colors Type -----
export type ThemeColors = {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  radius: string
}

// ----- Solar Colors (Bloomberg Terminal Inspired) -----
// Concept: High contrast, data-dense, professional.
// The "Solar" theme mimics the phosphorescent glow of old CRT monitors but modernized.
const SOLAR_DARK: ThemeColors = {
  background: "hsl(0 0% 0%)", // Pure Black
  foreground: "hsl(36 100% 50%)", // Terminal Amber (Deep)
  card: "hsl(0 0% 10%)", // Dark Gray
  cardForeground: "hsl(36 100% 50%)",
  popover: "hsl(0 0% 5%)", // Almost Black
  popoverForeground: "hsl(36 100% 50%)",
  primary: "hsl(36 100% 50%)", // Amber
  primaryForeground: "hsl(0 0% 0%)",
  secondary: "hsl(0 0% 15%)", // Dark Gray
  secondaryForeground: "hsl(36 100% 50%)",
  muted: "hsl(0 0% 20%)",
  mutedForeground: "hsl(36 60% 40%)", // Dimmed Amber
  accent: "hsl(36 100% 50%)",
  accentForeground: "hsl(0 0% 0%)",
  destructive: "hsl(0 100% 50%)", // Terminal Red
  destructiveForeground: "hsl(0 0% 100%)",
  border: "hsl(36 100% 30%)", // Visible Amber Border
  input: "hsl(0 0% 15%)",
  ring: "hsl(36 100% 50%)",
  radius: "0px", // Sharp corners
}

const SOLAR_LIGHT: ThemeColors = {
  background: "hsl(40 20% 96%)", // Warm Off-White
  foreground: "hsl(0 0% 10%)", // Sharp Black
  card: "hsl(40 20% 92%)",
  cardForeground: "hsl(0 0% 10%)",
  popover: "hsl(40 20% 98%)",
  popoverForeground: "hsl(0 0% 10%)",
  primary: "hsl(32 100% 45%)", // Deep Amber
  primaryForeground: "hsl(0 0% 100%)",
  secondary: "hsl(40 10% 85%)",
  secondaryForeground: "hsl(0 0% 10%)",
  muted: "hsl(40 10% 80%)",
  mutedForeground: "hsl(0 0% 40%)",
  accent: "hsl(32 100% 45%)",
  accentForeground: "hsl(0 0% 100%)",
  destructive: "hsl(0 80% 50%)",
  destructiveForeground: "hsl(0 0% 100%)",
  border: "hsl(40 10% 70%)",
  input: "hsl(40 10% 85%)",
  ring: "hsl(32 100% 45%)",
  radius: "0px",
}

// ----- Metal Colors (Silver-y, Premium, Industrial) -----
// Concept: Brushed aluminium, steel, titanium. Cool neutrals.
const METAL_LIGHT: ThemeColors = {
  background: "hsl(210 20% 96%)", // Platinum
  foreground: "hsl(220 10% 20%)", // Gunmetal
  card: "hsl(210 20% 92%)", // Light Silver
  cardForeground: "hsl(220 10% 20%)",
  popover: "hsl(210 20% 98%)",
  popoverForeground: "hsl(220 10% 20%)",
  primary: "hsl(220 10% 30%)", // Steel Blue
  primaryForeground: "hsl(0 0% 100%)",
  secondary: "hsl(210 10% 85%)", // Aluminum
  secondaryForeground: "hsl(220 10% 30%)",
  muted: "hsl(210 10% 80%)",
  mutedForeground: "hsl(220 5% 50%)",
  accent: "hsl(210 15% 85%)", // Polished Metal
  accentForeground: "hsl(220 10% 20%)",
  destructive: "hsl(0 70% 50%)",
  destructiveForeground: "hsl(0 0% 100%)",
  border: "hsl(210 10% 75%)",
  input: "hsl(210 10% 85%)",
  ring: "hsl(220 10% 40%)",
  radius: "1rem", 
}

const METAL_DARK: ThemeColors = {
  background: "hsl(220 10% 12%)", // Titanium
  foreground: "hsl(210 10% 90%)", // White Silver
  card: "hsl(220 10% 16%)", // Dark Steel
  cardForeground: "hsl(210 10% 90%)",
  popover: "hsl(220 10% 14%)",
  popoverForeground: "hsl(210 10% 90%)",
  primary: "hsl(210 10% 80%)", // Bright Steel
  primaryForeground: "hsl(220 10% 12%)",
  secondary: "hsl(220 10% 20%)",
  secondaryForeground: "hsl(210 10% 90%)",
  muted: "hsl(220 10% 24%)",
  mutedForeground: "hsl(220 5% 60%)",
  accent: "hsl(220 10% 28%)",
  accentForeground: "hsl(210 10% 90%)",
  destructive: "hsl(0 60% 40%)",
  destructiveForeground: "hsl(0 0% 100%)",
  border: "hsl(220 10% 24%)",
  input: "hsl(220 10% 20%)",
  ring: "hsl(210 10% 60%)",
  radius: "1rem",
}

// ----- Teduh Colors (Eye-Friendly, Scientific Precision) -----
// Concept: Sepia/Paper for light, Deep Slate for dark.
// Reduces blue light exposure and maximizes readability.
const TEDUH_LIGHT: ThemeColors = {
  background: "hsl(36 30% 94%)", // Sepia / Cream
  foreground: "hsl(30 10% 20%)", // Warm Charcoal
  card: "hsl(36 20% 90%)", // Darker Cream
  cardForeground: "hsl(30 10% 20%)",
  popover: "hsl(36 30% 94%)",
  popoverForeground: "hsl(30 10% 20%)",
  primary: "hsl(24 40% 50%)", // Terracotta (Earth tone)
  primaryForeground: "hsl(36 30% 94%)",
  secondary: "hsl(36 20% 85%)",
  secondaryForeground: "hsl(30 10% 20%)",
  muted: "hsl(36 15% 80%)",
  mutedForeground: "hsl(30 5% 40%)",
  accent: "hsl(24 40% 60%)", // Soft Orange
  accentForeground: "hsl(30 10% 20%)",
  destructive: "hsl(0 60% 50%)",
  destructiveForeground: "hsl(36 30% 94%)",
  border: "hsl(36 15% 75%)",
  input: "hsl(36 20% 85%)",
  ring: "hsl(24 40% 50%)",
  radius: "0.5rem", 
}

const TEDUH_DARK: ThemeColors = {
  background: "hsl(220 15% 18%)", // Deep Slate (Night Shift style)
  foreground: "hsl(36 20% 80%)", // Warm Grey
  card: "hsl(220 15% 22%)", // Lighter Slate
  cardForeground: "hsl(36 20% 80%)",
  popover: "hsl(220 15% 18%)",
  popoverForeground: "hsl(36 20% 80%)",
  primary: "hsl(36 40% 60%)", // Warm Sand
  primaryForeground: "hsl(220 15% 18%)",
  secondary: "hsl(220 15% 26%)",
  secondaryForeground: "hsl(36 20% 80%)",
  muted: "hsl(220 15% 30%)",
  mutedForeground: "hsl(220 10% 60%)",
  accent: "hsl(36 40% 50%)", // Amber-ish
  accentForeground: "hsl(220 15% 18%)",
  destructive: "hsl(0 50% 50%)",
  destructiveForeground: "hsl(36 20% 80%)",
  border: "hsl(220 15% 30%)",
  input: "hsl(220 15% 26%)",
  ring: "hsl(36 40% 60%)",
  radius: "0.5rem",
}

export const getThemeColors = (
  theme: ThemeType,
  colorScheme: "light" | "dark",
  opacity?: number
): ThemeColors => {
  let colors: ThemeColors
  if (theme === "solar") {
    colors = colorScheme === "dark" ? SOLAR_DARK : SOLAR_LIGHT
  } else if (theme === "teduh") {
    colors = colorScheme === "dark" ? TEDUH_DARK : TEDUH_LIGHT
  } else {
    colors = colorScheme === "dark" ? METAL_DARK : METAL_LIGHT
  }

  if (opacity === undefined) return colors

  // Convert all HSL colors to HSLA with opacity
  const withOpacity: ThemeColors = { ...colors }
  for (const key in colors) {
    const colorKey = key as keyof ThemeColors
    const value = colors[colorKey]
    if (value.startsWith("hsl(")) {
      // Extract the HSL values
      const hslMatch = value.match(/hsl\(([^)]+)\)/)
      if (hslMatch) {
        withOpacity[colorKey] = `hsla(${hslMatch[1]}, ${opacity})`
      } else {
        withOpacity[colorKey] = value
      }
    } else {
      withOpacity[colorKey] = value
    }
  }
  return withOpacity
}

export const getNavTheme = (
  theme: ThemeType,
  colorScheme: "light" | "dark"
): Theme => {
  const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme

  let colors: ThemeColors = {} as ThemeColors
  if (theme === "solar") {
    colors = colorScheme === "dark" ? SOLAR_DARK : SOLAR_LIGHT
  } else if (theme === "teduh") {
    colors = colorScheme === "dark" ? TEDUH_DARK : TEDUH_LIGHT
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
