import InfoRow from "@/components/shared/info-row"
import { toast } from "@/components/ui/toast"
import { useAuth } from "@/lib/auth-context"
import { LogOut } from "lucide-react-native"
import { View } from "react-native"

// ----- Component -----
export function AuthSection() {
  const { signOut } = useAuth()

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

  return (
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
  )
}
