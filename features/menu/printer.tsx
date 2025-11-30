import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { ScrollView, View, RefreshControl, ActivityIndicator } from "react-native"
import { cn } from "@/lib/utils"
import { Bluetooth, Check, Settings, RefreshCw, Trash2 } from "lucide-react-native"
import type { BluetoothDevice } from "@/lib/printer/printer.types"
import { Icon } from "@/components/ui/icon"
import InfoRow from "@/components/shared/info-row"


// ----- Screen -----
export default function PrinterScreen() {

  // ----- Handlers -----

  // ----- Main Content -----
  return (
    <ScrollView
      className="flex-1 bg-background p-2"
      contentContainerClassName="gap-2"
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => { }} />}
    >
      {/* Actions */}
      <View className="flex-row gap-2">
        <Button variant="outline" onPress={() => { }} disabled={false} className="flex-1 flex-row items-center gap-2">
          <Icon as={RefreshCw} size={16} />
          <Text>MUAT ULG</Text>
        </Button>
        <Button variant="outline" onPress={() => { }} className="flex-1 flex-row items-center gap-2">
          <Icon as={Settings} size={16} />
          <Text>BUKA PENGATURAN</Text>
        </Button>
      </View>

      {/* Selected Printer */}
      <View className="gap-2">
        <View className="px-2">
          <Text variant="muted" className="text-xs uppercase">Printer yg Tapilih</Text>
        </View>
        <View className="rounded-lg border border-dashed border-border bg-muted/20 p-2">
          <Text variant="muted" className="text-center text-xs">Belum ada printer yang tapilih.</Text>
          <Text variant="muted" className="mt-1 text-center text-xs">Pilih printer dari daftar di bawah</Text>
        </View>
      </View>

      {/* Supported Devices */}
      <View >
        {[].length > 0 && (
          <DeviceSection
            title="Printer Tahubung siap pilih"
            count={[].length}
            devices={[]}
            selectedAddress={undefined}
            onSelect={() => { }}
          />
        )}
      </View>

      {/* Info */}
      <View className="border-t border-dashed border-border p-2">
        <View className="px-2">
          <Text variant="muted" className="text-xs uppercase">catatan</Text>
        </View>
        <Text className="text-xs leading-5 text-muted-foreground">
          Halaman ini cuman mo kase lia printer apa yang so tahubung lewat bluetooth. Kalo mo menghubung ka printer, musti ke halaman pengaturan HP masing2.
        </Text>
      </View>
    </ScrollView>
  )
}

// ----- Selected Printer Card -----
type SelectedPrinterCardProps = {
  printer: BluetoothDevice
  onTestPrint: () => void
  onDeselect: () => void
  isPrinting: boolean
}

function SelectedPrinterCard({ printer, onTestPrint, onDeselect, isPrinting }: SelectedPrinterCardProps) {
  const printerInfo = (
    <View className="flex-1">
      <Text>{printer.name}</Text>
      <Text variant="muted" className="text-xs">{printer.address}</Text>
    </View>
  )

  const trailingElement = (
    <View className="flex-row items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        title={isPrinting ? "Mencetak..." : "Tes Cetak"}
        onPress={onTestPrint}
        disabled={isPrinting}
      />
      <Button
        size="icon"
        onPress={onDeselect}
        className="bg-destructive/25"
      >
        <Icon as={Trash2} size={16} className="text-destructive" />
      </Button>
    </View>
  )

  return (
    <View className="rounded-[--radius] border border-border bg-card p-2">
      <InfoRow
        label={printerInfo}
        leadingElement={<Icon as={Check} size={20} />}
        trailingElement={trailingElement}
        containerClassName="p-0 border-0"
      />
    </View>
  )
}

// ----- Device Section -----
type DeviceSectionProps = {
  title: string
  count: number
  devices: BluetoothDevice[]
  selectedAddress?: string
  onSelect: (device: BluetoothDevice) => void
  emptyMessage?: { title: string; subtitle?: string }
}

function DeviceSection({ title, count, devices, selectedAddress, onSelect, emptyMessage }: DeviceSectionProps) {
  return (
    <View className="gap-2">
      <View className="px-2 flex-row items-center justify-between">
        <Text variant="muted" className="text-xs uppercase">{title}</Text>
        <Text variant="muted" className={cn("text-xs uppercase")}>
          {count} tersedia
        </Text>
      </View>
      <View className={cn("overflow-hidden rounded-[--radius] border bg-card border-border")}>
        {devices.length === 0 && emptyMessage ? (
          <View className="p-2">
            <Text className="text-center text-sm text-muted-foreground">{emptyMessage.title}</Text>
            {emptyMessage.subtitle && <Text className="mt-1 text-center text-xs text-muted-foreground">{emptyMessage.subtitle}</Text>}
          </View>
        ) : (
          devices.map((device, i) => (
            <DeviceRow
              key={device.id}
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

// ----- Device Row -----
type DeviceRowProps = {
  device: BluetoothDevice
  isSelected: boolean
  onSelect: (device: BluetoothDevice) => void
  isLast?: boolean
}

function DeviceRow({ device, isSelected, onSelect, isLast }: DeviceRowProps) {

  const deviceInfo = (
    <View className="flex-1 gap-1">
      <View className="flex-row items-center gap-2">
        <Text>
          {device.name}
        </Text>
      </View>
      <Text variant="muted" className="text-xs">{device.address}</Text>
    </View>
  )

  return (
    <InfoRow
      label={deviceInfo}
      leadingElement={
        <Icon
          as={Bluetooth}
          size={16}
        />
      }
      isLast={isLast}
      value={isSelected ? "SO TAPILIH" : undefined}
      showChevron={false}
      onPress={isSelected ? undefined : () => onSelect(device)}
      containerClassName={isSelected ? "opacity-50" : undefined}
    />
  )
}
