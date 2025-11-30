import { View } from "react-native"
import { Printer } from "lucide-react-native"
import { router } from "expo-router"
import InfoRow from "@/components/shared/info-row"
import { usePrinterStore } from "@/lib/printer"
import { ConnectionStatusBadge } from "./connection-status-badge"

export default function PrinterRow() {
  const { selectedPrinter, connectionState } = usePrinterStore()

  const statusBadge = selectedPrinter ? (
    <ConnectionStatusBadge state={connectionState} />
  ) : null

  return (
    <InfoRow
      label="Printer"
      value={selectedPrinter?.name ?? "Belum dipilih"}
      leadingIcon={Printer}
      trailingElement={statusBadge}
      onPress={() => router.push("/(authenticated)/menu/printer")}
    />
  )
}
