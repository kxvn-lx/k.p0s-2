import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { DeviceListItem } from "./device-list-item"
import { BluetoothDevice } from "@/lib/printer/types/bluetooth.types"
import { SectionHeader } from "@/components/ui/section-header"

// ----- Types -----
type DeviceListSectionProps = {
  title: string
  devices: BluetoothDevice[]
  selectedAddress?: string

  onSelect: (device: BluetoothDevice) => void
  emptyMessage?: string
}

// ----- Component -----
export function DeviceListSection({
  title,
  devices,
  selectedAddress,

  onSelect,
  emptyMessage,
}: DeviceListSectionProps) {
  if (devices.length === 0 && !emptyMessage) return null

  return (
    <View>
      <SectionHeader
        title={title}
        secondary={
          `${devices.length} ditemukan`
        }
      />

      <View className="overflow-hidden rounded-[--radius] border border-border bg-card">
        {devices.length === 0 ? (
          <View className="p-4">
            <Text variant="muted" className="text-center text-sm">
              {emptyMessage}
            </Text>
          </View>
        ) : (
          devices.map((device, i) => (
            <DeviceListItem
              key={device.address}
              device={device}
              isSelected={selectedAddress === device.address}
              onSelect={onSelect}
              isLast={i === devices.length - 1}
            />
          ))
        )}
      </View>
    </View>
  )
}
