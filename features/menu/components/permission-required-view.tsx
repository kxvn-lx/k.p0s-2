import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { ShieldAlert } from "lucide-react-native"

// ----- Types -----
type PermissionRequiredViewProps = {
  isRequesting: boolean
  onRequestPermission: () => void
  onOpenSettings: () => void
}

// ----- Component -----
export function PermissionRequiredView({
  isRequesting,
  onRequestPermission,
  onOpenSettings,
}: PermissionRequiredViewProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-8">
      <View className="rounded-full bg-warning/10 p-4">
        <Icon as={ShieldAlert} size={48} className="text-foreground" />
      </View>

      <View className="gap-2">
        <Text className="text-center text-lg font-medium">Perlu izin</Text>
        <Text variant="muted" className="text-center text-sm">
          Apk perlu akses Bluetooth dan Lokasi for mo cari dg konek ka printer.
        </Text>
      </View>

      <View className="w-full gap-2">
        <Button
          title={isRequesting ? "MENGATUR IZIN..." : "KASE IZIN AKSES"}
          onPress={onRequestPermission}
          disabled={isRequesting}
        />
        <Button
          variant="ghost"
          title="Buka Pengaturan"
          onPress={onOpenSettings}
        />
      </View>
    </View>
  )
}
