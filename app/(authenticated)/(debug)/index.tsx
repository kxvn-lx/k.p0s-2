import { View, ScrollView } from "react-native"
import { Redirect, useRouter } from "expo-router"
import { isDev } from "@/lib/utils"
import { SettingsGroup } from "@/features/debug/components/settings-list"
import InfoRow from "@/components/shared/info-row"
import {
  Activity,
  Receipt,
  Smartphone,
  Info,
  Bug
} from "lucide-react-native"

export default function DebugMenu() {
  const router = useRouter()

  if (!isDev()) return <Redirect href="/" />

  return (
    <View className="flex-1 bg-secondary/30">
      <ScrollView contentContainerClassName="p-2">

        {/* Tools Section */}
        <SettingsGroup title="Development Tools">
          <InfoRow
            leadingIcon={Activity}
            iconBackgroundColor="#007AFF" // System Blue
            leadingElement="Progress Dialog Viewer"
            onPress={() => router.push("/(authenticated)/(debug)/progress")}
          />
          <InfoRow
            leadingIcon={Receipt}
            iconBackgroundColor="#FF9500" // System Orange
            leadingElement="Receipt Preview"
            onPress={() => router.push("/(authenticated)/(debug)/receipt-preview")}
            isLast
          />
        </SettingsGroup>

      </ScrollView>
    </View>
  )
}
