import InfoRow from "@/components/shared/info-row"
import { RefreshCw } from "lucide-react-native"
import { useAppUpdates, type UpdateStatus } from "../hooks/use-app-updates"
import { Text } from "@/components/ui/text"

// ----- Helper -----
function getStatusText(status: UpdateStatus): string {
  switch (status) {
    case "checking":
      return "Sdg bapriksa..."
    case "downloading":
      return "Badownload..."
    case "ready":
      return "Siap for restart"
    case "up-to-date":
      return "Terbaru"
    case "error":
      return "Error"
    default:
      return ""
  }
}

function getStatusColor(status: UpdateStatus): string {
  switch (status) {
    case "ready":
      return "text-primary"
    case "up-to-date":
      return "text-green-500"
    case "error":
      return "text-destructive"
    default:
      return "text-muted-foreground"
  }
}

// ----- Component -----
export function UpdateRow() {
  const { updateInfo, checkForUpdates } = useAppUpdates()
  const isLoading =
    updateInfo.status === "checking" || updateInfo.status === "downloading"

  const handlePress = () => {
    if (!isLoading) {
      checkForUpdates(true)
    }
  }

  const statusText = getStatusText(updateInfo.status)
  const statusColor = getStatusColor(updateInfo.status)

  return (
    <InfoRow
      leadingElement="Cek Pembaruan"
      leadingIcon={RefreshCw}
      trailingElement={<Text className={statusColor}>{statusText}</Text>}
      onPress={handlePress}
      isLast
    />
  )
}
