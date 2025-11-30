import { View, ActivityIndicator } from "react-native"
import { Text } from "@/components/ui/text"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import { Bluetooth, Check } from "lucide-react-native"
import InfoRow from "@/components/shared/info-row"
import type { BluetoothDevice } from "@/lib/printer/printer.types"

// ----- Types -----
type DeviceListItemProps = {
  device: BluetoothDevice
  isSelected: boolean
  isConnecting: boolean
  onSelect: (device: BluetoothDevice) => void
  isLast?: boolean
}

// ----- Component -----
export function DeviceListItem({
  device,
  isSelected,
  isConnecting,
  onSelect,
  isLast,
}: DeviceListItemProps) {
  const deviceInfo = (
    <View className="flex-1 gap-1">
      <Text className={cn(isSelected && "font-medium")}>{device.name}</Text>
      <Text variant="muted" className="text-xs">{device.address}</Text>
    </View>
  )

  const trailingContent = isConnecting ? (
    <ActivityIndicator size="small" />
  ) : isSelected ? (
    <View className="flex-row items-center gap-2">
      <Icon as={Check} size={16} className="text-green-500" />
      <Text className="text-xs text-green-500">TERPILIH</Text>
    </View>
  ) : null

  return (
    <InfoRow
      label={deviceInfo}
      leadingElement={<Icon as={Bluetooth} size={16} className={cn(isSelected && "text-primary")} />}
      trailingElement={trailingContent}
      isLast={isLast}
      showChevron={!isSelected && !isConnecting}
      onPress={isSelected || isConnecting ? undefined : () => onSelect(device)}
      containerClassName={cn(isConnecting && "opacity-50")}
    />
  )
}
