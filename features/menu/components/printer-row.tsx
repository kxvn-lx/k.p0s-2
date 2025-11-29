import InfoRow from "@/components/shared/info-row"
import { useRouter } from "expo-router"
import { Bluetooth } from "lucide-react-native"

// ----- Component -----
export function PrinterRow() {
  const router = useRouter()

  return (
    <InfoRow
      label="Printer Bluetooth"
      leadingIcon={Bluetooth}
      value="Tidak Terhubung"
      onPress={() => router.push("/menu/printer")}
    />
  )
}
