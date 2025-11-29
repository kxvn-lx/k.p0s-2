import { Printer } from "lucide-react-native"
import { router } from "expo-router"
import InfoRow from "@/components/shared/info-row"
import usePrinterStore from "@/lib/store/printer-store"

export default function PrinterRow() {
  const { selectedPrinter } = usePrinterStore()

  return (
    <InfoRow
      label="Printer"
      value={selectedPrinter?.name ?? "Belum tapilih"}
      leadingIcon={Printer}
      onPress={() => router.push("/(authenticated)/menu/printer")}
    />
  )
}
