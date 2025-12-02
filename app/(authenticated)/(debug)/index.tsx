import { View } from "react-native"
import { Link, Redirect } from "expo-router"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { isDev } from "@/lib/utils"

export default function DebugMenu() {
  if (!isDev()) return <Redirect href="/" />
  return (
    <View className="flex-1 bg-background p-4 justify-center gap-4">
      <Text className="text-2xl font-bold mb-4">Debug Tools</Text>

      {/* Progress Dialog */}
      <Link href="./progress" asChild>
        <Button title="Progress Dialog Viewer" />
      </Link>

      {/* Placeholder for future debug tools */}
      <View className="gap-4 mt-4">
        <Text className="text-muted-foreground">More tools coming soon...</Text>
      </View>
    </View>
  )
}
