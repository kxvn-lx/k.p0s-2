import { Text } from "@/components/ui/text"
import { useAuth } from "@/lib/auth-context"
import { ScrollView, View } from "react-native"
import { AuthSection } from "./components/auth-section"
import PrinterRow from "./components/printer-row"
import { ThemeSection } from "./components/theme-section"
import { UpdateRow } from "./components/update-row"
import { SectionHeader } from "@/components/ui/section-header"

// ----- Menu Screen -----
export default function Menu() {
  const { user } = useAuth()

  const role = user?.app_metadata?.role || "-"
  const email = user?.email || "-"
  const name = user?.user_metadata?.full_name || email

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4"
    >
      {/* Profile Section */}
      <View className="flex-row items-center justify-between gap-2">
        <Text>{name}</Text>
        <Text variant="muted" className="capitalize">
          {role}
        </Text>
      </View>

      {/* General Settings */}
      <View className="gap-4">
        <View>
          <SectionHeader title="UMUM" />
          <View className="bg-card">
            <PrinterRow />
            <UpdateRow />
          </View>
        </View>
      </View>

      {/* Appearance */}
      <View>
        <SectionHeader title="Tampilan" />
        <ThemeSection />
      </View>

      {/* Account */}
      <View>
        <SectionHeader title="Akun" />
        <AuthSection />
      </View>

      <Text variant="muted" className="text-center text-xs">
        V1.0.0
      </Text>
    </ScrollView>
  )
}
