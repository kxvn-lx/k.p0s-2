import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select"
import InfoRow from "@/components/shared/info-row"
import { useThemeStore } from "@/lib/store/theme-store"
import { ChevronDown, Palette } from "lucide-react-native"
import { View } from "react-native"
import type { Option } from "@rn-primitives/select"

// ----- Constants -----
const THEME_LABELS = {
  metal: "Metal",
  solar: "Solar",
  teduh: "Teduh",
} as const

type ThemeType = keyof typeof THEME_LABELS

// ----- Component -----
export function ThemeSection() {
  const { theme, setTheme } = useThemeStore()

  const handleTemaChange = async (option: Option) => {
    option && setTheme(option.value as ThemeType)
  }

  return (
    <View className="overflow-hidden rounded-[--radius] border border-border bg-card">
      <Select
        value={{
          value: theme,
          label: THEME_LABELS[theme as ThemeType],
        }}
        onValueChange={handleTemaChange}
      >
        <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 shadow-none [&>svg]:hidden">
          <InfoRow
            label="Tema Aplikasi"
            leadingIcon={Palette}
            value={THEME_LABELS[theme as ThemeType]}
            showChevron={ChevronDown}
            isLast
          />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem label="Metal" value="metal">
            Metal
          </SelectItem>
          <SelectSeparator />
          <SelectItem label="Solar" value="solar">
            Solar
          </SelectItem>
          <SelectSeparator />
          <SelectItem label="Teduh" value="teduh">
            Teduh
          </SelectItem>
        </SelectContent>
      </Select>
    </View>
  )
}
