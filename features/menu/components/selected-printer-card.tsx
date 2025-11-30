import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Printer, Trash2 } from "lucide-react-native"
import { ConnectionStatusBadge } from "./connection-status-badge"
import type { BluetoothDevice, ConnectionState } from "@/lib/printer/printer.types"

// ----- Types -----
type SelectedPrinterCardProps = {
  printer: BluetoothDevice
  connectionState: ConnectionState
  isPrinting: boolean
  onTestPrint: () => void
  onDeselect: () => void
}

// ----- Component -----
export function SelectedPrinterCard({
  printer,
  connectionState,
  isPrinting,
  onTestPrint,
  onDeselect,
}: SelectedPrinterCardProps) {
  const isBusy = connectionState === "connecting" || connectionState === "reconnecting" || isPrinting

  return (
    <View className="rounded-[--radius] border border-border bg-card p-4">
      {/* Header */}
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2">
          <Icon as={Printer} size={20} />
          <View>
            <Text className="font-medium">{printer.name}</Text>
            <Text variant="muted" className="text-xs">{printer.address}</Text>
          </View>
        </View>
        <ConnectionStatusBadge state={connectionState} />
      </View>

      {/* Actions */}
      <View className="mt-4 flex-row gap-2">
        <Button
          variant="outline"
          className="flex-1"
          title={isPrinting ? "Mencetak..." : "Tes Cetak"}
          onPress={onTestPrint}
          disabled={isBusy}
        />
        <Button
          size="icon"
          onPress={onDeselect}
          className="bg-destructive/10"
          disabled={isBusy}
        >
          <Icon as={Trash2} size={16} className="text-destructive" />
        </Button>
      </View>
    </View>
  )
}
