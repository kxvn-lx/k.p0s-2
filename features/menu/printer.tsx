import { useState, useCallback } from "react"
import { ScrollView, View, RefreshControl, ActivityIndicator } from "react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { RefreshCw, Bluetooth } from "lucide-react-native"
import { bluetooth, usePrinterPermissions, usePrinterScanner, usePrinterConnection, useTestPrint } from "@/lib/printer"
import { SelectedPrinterCard } from "./components/selected-printer-card"
import { DeviceListSection } from "./components/device-list-section"
import { PermissionRequiredView } from "./components/permission-required-view"
import type { BluetoothDevice } from "@/lib/printer"

// ----- Screen -----
export default function PrinterScreen() {
  const [connectingAddress, setConnectingAddress] = useState<string | null>(null)

  // ----- Hooks -----
  const {
    hasPermissions,
    permissionsChecked,
    isChecking: isCheckingPermissions,
    checkPermissions,
    ensurePermissions,
    openSettings,
  } = usePrinterPermissions()

  const { pairedDevices, foundDevices, isScanning, scan } = usePrinterScanner()

  const {
    connectionState,
    selectedPrinter,
    isConnecting,
    connect,
    deselectPrinter,
  } = usePrinterConnection()

  const { printTest, isPrinting } = useTestPrint()

  // ----- Handlers -----
  const handleScan = useCallback(async () => {
    const granted = await ensurePermissions()
    if (!granted) return
    bluetooth.init()
    await scan()
  }, [ensurePermissions, scan])

  const handleRequestPermission = useCallback(async () => {
    await ensurePermissions()
  }, [ensurePermissions])

  const handleSelectDevice = useCallback(async (device: BluetoothDevice) => {
    setConnectingAddress(device.address)
    await connect(device)
    setConnectingAddress(null)
  }, [connect])

  const handleTestPrint = useCallback(async () => {
    await printTest(selectedPrinter)
  }, [selectedPrinter, printTest])

  // ----- Check permissions on first render  -----
  if (!permissionsChecked && !isCheckingPermissions) {
    checkPermissions()
  }

  // ----- Loading State -----
  if (!permissionsChecked || isCheckingPermissions) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text variant="muted" className="mt-4">Memeriksa izin...</Text>
      </View>
    )
  }

  // ----- Permission Required -----
  if (!hasPermissions) {
    return (
      <PermissionRequiredView
        isRequesting={isCheckingPermissions}
        onRequestPermission={handleRequestPermission}
        onOpenSettings={openSettings}
      />
    )
  }

  // ----- Main Content -----
  return (
    <ScrollView
      className="flex-1 bg-background p-2"
      contentContainerClassName="gap-4"
      refreshControl={<RefreshControl refreshing={isScanning} onRefresh={handleScan} />}
    >
      {/* Actions */}
      <View className="flex-row gap-2">
        <Button
          variant="outline"
          onPress={handleScan}
          disabled={isScanning || isConnecting}
          className="flex-1 flex-row items-center gap-2"
        >
          {isScanning ? (
            <ActivityIndicator size="small" />
          ) : (
            <Icon as={RefreshCw} size={16} />
          )}
          <Text>{isScanning ? "MEMINDAI..." : "PINDAI ULANG"}</Text>
        </Button>
      </View>

      {/* Selected Printer */}
      <View className="gap-2">
        <View className="px-2">
          <Text variant="muted" className="text-xs uppercase">
            Printer yang Dipilih
          </Text>
        </View>
        {selectedPrinter ? (
          <SelectedPrinterCard
            printer={selectedPrinter}
            connectionState={connectionState}
            isPrinting={isPrinting}
            onTestPrint={handleTestPrint}
            onDeselect={deselectPrinter}
          />
        ) : (
          <View className="rounded-[--radius] border border-dashed border-border bg-muted/20 p-4">
            <Text variant="muted" className="text-center text-sm">
              Belum ada printer yang dipilih.
            </Text>
            <Text variant="muted" className="mt-1 text-center text-xs">
              Pilih printer dari daftar di bawah
            </Text>
          </View>
        )}
      </View>

      {/* Paired Devices */}
      <DeviceListSection
        title="Perangkat Terhubung"
        devices={pairedDevices}
        selectedAddress={selectedPrinter?.address}
        connectingAddress={connectingAddress ?? undefined}
        onSelect={handleSelectDevice}
        emptyMessage="Tidak ada perangkat terhubung. Pasangkan printer di pengaturan Bluetooth."
      />

      {/* Found Devices */}
      {foundDevices.length > 0 && (
        <DeviceListSection
          title="Perangkat Ditemukan"
          devices={foundDevices}
          selectedAddress={selectedPrinter?.address}
          connectingAddress={connectingAddress ?? undefined}
          onSelect={handleSelectDevice}
        />
      )}

      {/* Empty State */}
      {pairedDevices.length === 0 && foundDevices.length === 0 && !isScanning && (
        <View className="items-center gap-4 p-8">
          <View className="rounded-full bg-muted/50 p-4">
            <Icon as={Bluetooth} size={32} className="text-muted-foreground" />
          </View>
          <View className="gap-1">
            <Text className="text-center font-medium">Tidak Ada Perangkat</Text>
            <Text variant="muted" className="text-center text-sm">
              Tarik ke bawah atau tekan tombol pindai untuk mencari perangkat Bluetooth
            </Text>
          </View>
        </View>
      )}

      {/* Info */}
      <View className="border-t border-dashed border-border p-2">
        <View className="px-2">
          <Text variant="muted" className="text-xs uppercase">Catatan</Text>
        </View>
        <Text className="text-xs leading-5 text-muted-foreground">
          Pastikan printer RPP02N dalam keadaan menyala dan sudah dipasangkan via Bluetooth di
          pengaturan HP. Printer yang sudah terhubung akan otomatis terkoneksi saat aplikasi dibuka.
        </Text>
      </View>
    </ScrollView>
  )
}
