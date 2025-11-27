import { StockLokasi } from "@/features/stok/api/stock.service"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ----- HSL to RGB Conversion -----
// React Native StyleSheet requires RGB/Hex, not HSL
export const hslToRgb = (hslString: string, alpha?: number): string => {
  const match = hslString.match(/(\d+\.?\d*)\s+(\d+\.?\d*)%\s+(\d+\.?\d*)%/)
  if (!match) return "rgb(255, 255, 255)"

  const h = parseFloat(match[1]) / 360
  const s = parseFloat(match[2]) / 100
  const l = parseFloat(match[3]) / 100

  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const rgb = `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`
  return alpha === undefined
    ? `rgb(${rgb})`
    : `rgba(${rgb}, ${Math.max(0, Math.min(1, alpha))})`
}

// ----- Radius Conversion -----
export const remToPx = (remString: string): number => {
  const rem = parseFloat(remString)
  return rem * 16
}

// ----- Date-Time Formatting -----
export function formatDateTime(
  dateInput: string | Date,
  withTime: boolean = false,
  showDay: boolean = false
): string {
  const dateObj =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput

  let result = ""

  if (showDay) {
    const dayNames = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ]
    const dayName = dayNames[dateObj.getDay()]
    result = `${dayName}, `
  }

  const dd = dateObj.getDate().toString().padStart(2, "0")
  const mm = (dateObj.getMonth() + 1).toString().padStart(2, "0")
  const yyyy = dateObj.getFullYear().toString()
  result += `${dd}/${mm}/${yyyy}`

  if (withTime) {
    const hh = dateObj.getHours().toString().padStart(2, "0")
    const min = dateObj.getMinutes().toString().padStart(2, "0")
    result += ` ${hh}:${min}`
  }

  return result
}

export function getLokasiColor(lokasi: StockLokasi): string {
  switch (lokasi) {
    case "TOKO":
      return "text-green-500"
    case "TRUK":
      return "text-orange-500"
  }
}
