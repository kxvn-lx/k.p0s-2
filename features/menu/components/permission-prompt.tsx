import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Bluetooth, Settings } from "lucide-react-native"
import { View, ActivityIndicator } from "react-native"

type Props = {
    onRequestPermissions: () => void | Promise<void>
    onOpenSettings: () => void
    isRequesting?: boolean
}

export default function PermissionPrompt({ onRequestPermissions, onOpenSettings, isRequesting = false }: Props) {
    return (
        <View className="flex-1 items-center justify-center p-6">
            <View className="w-full max-w-sm gap-6">
                {/* Icon */}
                <View className="items-center">
                    <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Bluetooth size={40} className="text-primary" />
                    </View>
                </View>

                {/* Title */}
                <View className="gap-2">
                    <Text className="text-center text-lg font-semibold">Izin Bluetooth Diperlukan</Text>
                    <Text className="text-center text-sm text-muted-foreground leading-5">
                        Aplikasi memerlukan izin Bluetooth untuk memindai dan menghubungkan printer thermal.
                    </Text>
                </View>

                {/* Actions */}
                <View className="gap-2">
                    <Button onPress={onRequestPermissions} disabled={isRequesting}>
                        {isRequesting ? <ActivityIndicator size="small" color="white" /> : <Bluetooth size={16} className="text-primary-foreground" />}
                        <Text>{isRequesting ? "Meminta Izin..." : "Izinkan Akses"}</Text>
                    </Button>
                    <Button variant="outline" onPress={onOpenSettings}>
                        <Settings size={16} className="text-foreground" />
                        <Text>Buka Pengaturan</Text>
                    </Button>
                </View>

                {/* Note */}
                <View className="rounded-lg border border-border/50 bg-muted/20 p-2">
                    <Text className="text-xs text-muted-foreground leading-4">
                        Jika tombol "Izinkan Akses" tidak berfungsi, buka Pengaturan untuk mengaktifkan izin Bluetooth secara manual.
                    </Text>
                </View>
            </View>
        </View>
    )
}