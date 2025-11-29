import { Text } from "@/components/ui/text"
import { useAuth } from "@/lib/auth-context"
import { ScrollView, View } from "react-native"
import { AuthSection } from "./components/auth-section"
import PrinterRow from "./components/printer-row"
import { ThemeSection } from "./components/theme-section"
import { UpdateRow } from "./components/update-row"

// ----- Menu Screen -----
export default function Menu() {
  const { user } = useAuth()

  const role = user?.app_metadata?.role || "-"
  const email = user?.email || "-"
  const name = user?.user_metadata?.full_name || email

  return (
    <ScrollView
      className="flex-1 bg-background"
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
          <PrinterRow />
          <UpdateRow />
        </View>
      </View>

      {/* Appearance */}
      <View className="gap-2">
        <View className="px-2">
          <Text variant="muted" className="text-xs uppercase">
            Tampilan
          </Text>
        </View>
        <ThemeSection />
      </View>

      {/* Account */}
      <View className="gap-2">
        <View className="px-2">
          <Text variant="muted" className="text-xs uppercase">
            Akun
          </Text>
        </View>
        <AuthSection />
      </View>

      <Text className="text-center text-xs text-muted-foreground pt-4">
        Versi Aplikasi 1.0.0
      </Text>
    </ScrollView>
  )
}
