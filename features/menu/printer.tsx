import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import { Bluetooth, Check, Signal, Wifi } from "lucide-react-native"
import { useState } from "react"
import { Pressable, ScrollView, View } from "react-native"

// ----- Types -----
type BluetoothDevice = {
  id: string
  name: string
  address: string
  rssi?: number
  connected?: boolean
}

// ----- Helper Functions -----
function getSignalStrength(rssi?: number): "strong" | "medium" | "weak" {
  if (!rssi) return "weak"
  if (rssi >= -60) return "strong"
  if (rssi >= -80) return "medium"
  return "weak"
}

function SignalIndicator({ rssi }: { rssi?: number }) {
  const strength = getSignalStrength(rssi)
  const bars = strength === "strong" ? 3 : strength === "medium" ? 2 : 1

  return (
    <View className="flex-row items-end gap-0.5">
      {[1, 2, 3].map((bar) => (
        <View
          key={bar}
          className={cn(
            "w-1 rounded-sm",
            bar === 1 && "h-1.5",
            bar === 2 && "h-2.5",
            bar === 3 && "h-3.5",
            bar <= bars ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </View>
  )
}

// ----- Components -----
function StatusCard({
  isConnected,
  device,
}: {
  isConnected: boolean
  device?: BluetoothDevice
}) {
  return (
    <View className="gap-3 border-b border-border pb-6">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Status Koneksi
        </Text>
        <View className="flex-row items-center gap-2">
          <View
            className={cn(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-muted-foreground/50"
            )}
          />
          <Text className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {isConnected ? "CONNECTED" : "DISCONNECTED"}
          </Text>
        </View>
      </View>

      {device && isConnected && (
        <View className="gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-mono text-sm font-medium text-foreground">
              {device.name}
            </Text>
            <SignalIndicator rssi={device.rssi} />
          </View>
          <Text className="font-mono text-xs text-muted-foreground">
            {device.address}
          </Text>
          <View className="mt-1 flex-row gap-2">
            <Button variant="outline" size="sm" onPress={() => {}}>
              <Text className="text-xs">Putuskan</Text>
            </Button>
            <Button variant="ghost" size="sm" onPress={() => {}}>
              <Text className="text-xs">Tes Cetak</Text>
            </Button>
          </View>
        </View>
      )}

      {!isConnected && (
        <View className="rounded-lg border border-border bg-muted/30 p-4">
          <Text className="text-center text-sm text-muted-foreground">
            Tidak ada perangkat terhubung
          </Text>
        </View>
      )}
    </View>
  )
}

function DeviceRow({
  device,
  onConnect,
  isConnecting,
}: {
  device: BluetoothDevice
  onConnect: (device: BluetoothDevice) => void
  isConnecting: boolean
}) {
  return (
    <Pressable
      onPress={() => onConnect(device)}
      className="flex-row items-center gap-3 border-b border-border/50 py-3 active:bg-muted/30"
    >
      <View className="h-10 w-10 items-center justify-center rounded border border-border bg-muted/30">
        <Bluetooth size={18} className="text-foreground" />
      </View>

      <View className="flex-1 gap-1">
        <Text className="font-mono text-sm font-medium text-foreground">
          {device.name}
        </Text>
        <Text className="font-mono text-xs text-muted-foreground">
          {device.address}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <SignalIndicator rssi={device.rssi} />
        {device.connected ? (
          <Check size={16} className="text-primary" />
        ) : isConnecting ? (
          <Text className="font-mono text-xs text-muted-foreground">
            Menghubungkan...
          </Text>
        ) : (
          <Text className="font-mono text-xs text-primary">HUBUNGKAN</Text>
        )}
      </View>
    </Pressable>
  )
}

// ----- Main Screen -----
export default function PrinterScreen() {
  const [isScanning, setIsScanning] = useState(false)
  const [connectingId, setConnectingId] = useState<string | null>(null)

  // Placeholder data
  const [connectedDevice] = useState<BluetoothDevice>({
    id: "1",
    name: "RPP02N",
    address: "00:11:22:33:44:55",
    rssi: -55,
    connected: true,
  })

  const [availableDevices] = useState<BluetoothDevice[]>([
    {
      id: "2",
      name: "PRINTER-A1",
      address: "AA:BB:CC:DD:EE:FF",
      rssi: -45,
    },
    {
      id: "3",
      name: "RPP300",
      address: "11:22:33:44:55:66",
      rssi: -75,
    },
    {
      id: "4",
      name: "Unknown Device",
      address: "99:88:77:66:55:44",
      rssi: -90,
    },
  ])

  const handleScan = () => {
    setIsScanning(true)
    // Placeholder: simulate scan
    setTimeout(() => setIsScanning(false), 2000)
  }

  const handleConnect = (device: BluetoothDevice) => {
    setConnectingId(device.id)
    // Placeholder: simulate connection
    setTimeout(() => setConnectingId(null), 1500)
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, gap: 20 }}
    >
      {/* Status Section */}
      <StatusCard isConnected={!!connectedDevice} device={connectedDevice} />

      {/* Scan Controls */}
      <View className="flex-row gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onPress={handleScan}
          disabled={isScanning}
        >
          <Bluetooth size={16} className="text-foreground" />
          <Text>{isScanning ? "Memindai..." : "Pindai Perangkat"}</Text>
        </Button>
      </View>

      {/* Available Devices */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Perangkat Tersedia
          </Text>
          <Text className="font-mono text-xs text-muted-foreground">
            {availableDevices.length} ditemukan
          </Text>
        </View>

        <View className="overflow-hidden rounded-lg border border-border bg-card">
          {availableDevices.length === 0 ? (
            <View className="p-6">
              <Text className="text-center text-sm text-muted-foreground">
                Tidak ada perangkat ditemukan
              </Text>
              <Text className="mt-1 text-center text-xs text-muted-foreground">
                Tekan tombol Pindai untuk mencari
              </Text>
            </View>
          ) : (
            availableDevices.map((device, index) => (
              <DeviceRow
                key={device.id}
                device={device}
                onConnect={handleConnect}
                isConnecting={connectingId === device.id}
              />
            ))
          )}
        </View>
      </View>

      {/* Info Footer */}
      <View className="mt-2 gap-2 rounded-lg border border-border/50 bg-muted/20 p-4">
        <Text className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Catatan
        </Text>
        <Text className="text-xs leading-5 text-muted-foreground">
          Pastikan printer dalam mode pairing dan jarak tidak lebih dari 10
          meter. Hanya satu printer yang dapat terhubung pada satu waktu.
        </Text>
      </View>
    </ScrollView>
  )
}
