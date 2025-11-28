import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select"
import { Text } from "@/components/ui/text"
import { toast } from "@/components/ui/toast"
import { useAuth } from "@/lib/auth-context"
import { useThemeStore } from "@/lib/store/theme-store"
import * as Updates from "expo-updates"
import { useRouter } from "expo-router"
import {
  Bluetooth,
  ChevronDown,
  LogOut,
  Palette,
  RefreshCw,
  User,
} from "lucide-react-native"
import { ScrollView, View, Alert } from "react-native"
import InfoRow from "@/components/shared/info-row"
import { Option } from "@rn-primitives/select"

// ----- Theme Labels -----
const THEME_LABELS = {
  metal: "Metal",
  solar: "Solar",
  teduh: "Teduh",
} as const

type ThemeType = keyof typeof THEME_LABELS

// ----- Menu Screen -----
export default function Menu() {
  const { signOut, user } = useAuth()
  const { theme, setTheme } = useThemeStore()
  const router = useRouter()

  const handleCheckUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync()
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
        Alert.alert(
          "Pembaruan Tersedia",
          "Aplikasi akan dimuat ulang untuk menerapkan pembaruan.",
          [
            {
              text: "Muat Ulang",
              onPress: async () => await Updates.reloadAsync(),
            },
          ]
        )
      } else {
        toast.success("Aplikasi Sudah Terbaru", "Tidak ada pembaruan tersedia.")
      }
    } catch (error) {
      toast.error("Gagal Memeriksa Pembaruan", "Coba lagi nanti.")
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      toast.error(
        "Gagal Keluar",
        error instanceof Error ? error.message : "Gagal keluar"
      )
    }
  }

  const handleTemaChange = (option: Option) => {
    option && setTheme(option.value as ThemeType)
  }

  const role = user?.app_metadata?.role || "-"
  const email = user?.email || "-"
  const name = user?.user_metadata?.full_name || email

  return (
    <ScrollView
      className="flex-1 bg-background "
      contentContainerClassName="p-2 gap-4"
    >
      {/* Profile Section */}
      <View className="flex-row items-center justify-between gap-2">
        <Text>{name}</Text>
        <Text variant="muted" className="capitalize">
          {role}
        </Text>
      </View>

      {/* General Settings */}
      <View className="gap-2">
        <View className="px-2">
          <Text variant="muted" className="text-xs uppercase">
            Umum
          </Text>
        </View>
        <View className="overflow-hidden rounded-[--radius] border border-border bg-card">
          <InfoRow
            label="Printer Bluetooth"
            leadingIcon={Bluetooth}
            value="Tidak Terhubung"
            onPress={() => router.push("/menu/printer")}
          />
          <InfoRow
            label="Cek Pembaruan"
            leadingIcon={RefreshCw}
            onPress={handleCheckUpdates}
            isLast
          />
        </View>
      </View>

      {/* Appearance */}
      <View className="gap-2">
        <View className="px-2">
          <Text variant="muted" className="text-xs uppercase">
            Tampilan
          </Text>
        </View>
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
      </View>

      {/* Account */}
      <View className="gap-2">
        <View className="px-2">
          <Text variant="muted" className="text-xs uppercase">
            Akun
          </Text>
        </View>
        <View className="overflow-hidden rounded-[--radius] border border-border bg-card">
          <InfoRow
            label="Keluar"
            leadingIcon={LogOut}
            onPress={handleSignOut}
            showChevron={false}
            labelClassName="text-destructive"
            isLast
          />
        </View>
      </View>

      <Text className="text-center text-xs text-muted-foreground pt-4">
        Versi Aplikasi 1.0.0
      </Text>
    </ScrollView>
  )
}
