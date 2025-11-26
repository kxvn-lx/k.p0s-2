import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { useAuth } from "@/lib/auth-context"
import { useThemeStore } from "@/lib/store/theme-store"
import { Text, View } from "react-native"

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

  return (
    <View className="flex-1 justify-center items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Menu</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">
              Tema Aplikasi
            </Text>
            <Select
              value={{
                value: theme,
                label: THEME_LABELS[theme as ThemeType],
              }}
              onValueChange={(option) => {
                if (option) {
                  setTheme(option.value as ThemeType)
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem label="Metal" value="metal">
                  Metal
                </SelectItem>
                <SelectItem label="Solar" value="solar">
                  Solar
                </SelectItem>
                <SelectItem label="Teduh" value="teduh">
                  Teduh
                </SelectItem>
              </SelectContent>
            </Select>
          </View>

          <Button
            title="Keluar"
            variant="destructive"
            onPress={async () => {
              try {
                await signOut()
              } catch (error) {
                toast.error(
                  "Gagal Keluar",
                  error instanceof Error ? error.message : "Gagal keluar"
                )
              }
            }}
          />
        </CardContent>
      </Card>
    </View>
  )
}
