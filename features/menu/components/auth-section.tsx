import InfoRow from "@/components/shared/info-row"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { useAuth } from "@/lib/context/auth-context"
import { useRole } from "@/lib/hooks/use-role"
import { LogOut } from "lucide-react-native"
import { View } from "react-native"

// ----- Component -----
export function AuthSection() {
  const { signOut } = useAuth()
  const { isActualAdmin, isSalesmanModeEnabled, setIsSalesmanModeEnabled } = useRole()

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

  const handleSalesmanModeChange = (checked: boolean) => {
    setIsSalesmanModeEnabled(checked)
  }

  return (
    <View className="bg-card">
      {/* Mode Salesman toggle - only visible to actual admins */}
      {isActualAdmin && (
        <InfoRow
          leadingElement="Mode Salesman"
          trailingElement={
            <Switch
              checked={isSalesmanModeEnabled}
              onCheckedChange={handleSalesmanModeChange}
            />
          }
          trailingIcon={null}
        />
      )}

      <InfoRow
        leadingElement="Keluar"
        leadingIcon={LogOut}
        onPress={handleSignOut}
        trailingIcon={null}
        destructive
        isLast
      />
    </View>
  )
}
