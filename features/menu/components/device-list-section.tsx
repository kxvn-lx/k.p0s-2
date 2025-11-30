import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { DeviceListItem } from "./device-list-item"
import type { BluetoothDevice } from "@/lib/printer/printer.types"

// ----- Types -----
type DeviceListSectionProps = {
  title: string
  devices: BluetoothDevice[]
  selectedAddress?: string
  connectingAddress?: string
  onSelect: (device: BluetoothDevice) => void
  emptyMessage?: string
}

// ----- Component -----
export function DeviceListSection({
  title,
  devices,
  selectedAddress,
  connectingAddress,
  onSelect,
  emptyMessage,
}: DeviceListSectionProps) {
  if (devices.length === 0 && !emptyMessage) return null

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between px-2">
        <Text variant="muted" className="text-xs uppercase">{title}</Text>
        <Text variant="muted" className="text-xs">{devices.length} ditemukan</Text>
      </View>

      <View className="overflow-hidden rounded-[--radius] border border-border bg-card">
        {devices.length === 0 ? (
          <View className="p-4">
            <Text variant="muted" className="text-center text-sm">{emptyMessage}</Text>
          </View>
        ) : (
          devices.map((device, i) => (
            <DeviceListItem
              key={device.address}
              device={device}
              isSelected={selectedAddress === device.address}
              isConnecting={connectingAddress === device.address}
              onSelect={onSelect}
              isLast={i === devices.length - 1}
            />
          ))
        )}
      </View>
    </View>
  )
}
