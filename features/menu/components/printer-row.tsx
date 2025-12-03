import { Printer } from "lucide-react-native"
import { router } from "expo-router"
import InfoRow from "@/components/shared/info-row"
import { usePrinter } from "@/lib/printer/hooks/use-printer"

export default function PrinterRow() {
  const { selectedPrinter } = usePrinter()

  return (
    <InfoRow
      leadingElement="Printer"
      trailingElement={selectedPrinter?.name ?? "Belum dipilih"}
      leadingIcon={Printer}
      onPress={() => router.push("/(authenticated)/menu/printer")}
    />
  )
}
