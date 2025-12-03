import { useCallback } from "react"
import {
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { Text } from "@/components/ui/text"
import { usePrinter } from "@/lib/printer/hooks/use-printer"
import { useTestPrint } from "@/lib/printer/hooks/use-test-print"
import { SelectedPrinterCard } from "./components/selected-printer-card"
import { DeviceListSection } from "./components/device-list-section"
import { PermissionRequiredView } from "./components/permission-required-view"
import { BluetoothDevice } from "@/lib/printer/types/bluetooth.types"
import { SectionHeader } from "@/components/ui/section-header"

// ----- Screen -----
export default function PrinterScreen() {
  // ----- Hooks -----
  const {
    hasPermissions,
    permissionsChecked,
    isChecking: isCheckingPermissions,
    ensurePermissions,
    openSettings,
    connectionState,
    selectedPrinter,
    printerDevices,
    isScanning,
    scan,
    connect,
    deselectPrinter,
    bluetoothCore,
  } = usePrinter()

  const { printTest, isPrinting } = useTestPrint()

  // ----- Handlers -----
  const handleScan = useCallback(async () => {
    bluetoothCore.init()
    const granted = await ensurePermissions()
    if (!granted) return
    await scan()
  }, [ensurePermissions, scan])

  const handleRequestPermission = useCallback(async () => {
    await ensurePermissions()
  }, [ensurePermissions])

  const handleSelectDevice = useCallback(
    async (device: BluetoothDevice) => {
      await connect(device, false)
    },
    [connect]
  )

  const handleTestPrint = useCallback(async () => {
    await printTest()
  }, [printTest])

  // ----- Loading State -----
  if (!permissionsChecked || isCheckingPermissions) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text variant="muted" className="mt-4">
          Memeriksa izin...
        </Text>
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
      contentContainerClassName="gap-2"
      refreshControl={
        <RefreshControl refreshing={isScanning} onRefresh={handleScan} />
      }
    >
      {/* Selected Printer */}
      <View className="gap-2">
        <View>
          <SectionHeader title="PRINTER YANG TAPILIH" />
          {selectedPrinter ? (
            <SelectedPrinterCard
              printer={selectedPrinter}
              connectionState={connectionState}
              isPrinting={isPrinting}
              onTestPrint={handleTestPrint}
              onDeselect={deselectPrinter}
            />
          ) : (
            <View className="rounded-[--radius] border border-dashed border-border bg-card p-4">
              <Text variant="muted" className="text-center text-sm">
                ND ADA PRINTER YG TAPILIH
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Found Devices */}
      <DeviceListSection
        title="Printer Tersedia"
        devices={printerDevices}
        selectedAddress={selectedPrinter?.address}
        onSelect={handleSelectDevice}
        emptyMessage="TARIK KA BAWAH FOR MUAT ULANG DAFTAR PRINTER BLUETOOTH YG ADA"
      />
    </ScrollView>
  )
}
