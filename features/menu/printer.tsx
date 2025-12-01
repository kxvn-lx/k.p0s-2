import { useState, useCallback } from "react"
import {
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { Text } from "@/components/ui/text"
import { bluetooth } from "@/lib/printer/services/bluetooth.service"
import { usePrinterPermissions } from "@/lib/printer/hooks/use-printer-permissions"
import { usePrinterScanner } from "@/lib/printer/hooks/use-printer-scanner"
import { usePrinterConnection } from "@/lib/printer/hooks/use-printer-connection"
import { useTestPrint } from "@/lib/printer/hooks/use-test-print"
import { SelectedPrinterCard } from "./components/selected-printer-card"
import { DeviceListSection } from "./components/device-list-section"
import { PermissionRequiredView } from "./components/permission-required-view"
import type { BluetoothDevice } from "@/lib/printer/printer.types"

// ----- Screen -----
export default function PrinterScreen() {
  // ----- Hooks -----
  const {
    hasPermissions,
    permissionsChecked,
    isChecking: isCheckingPermissions,
    ensurePermissions,
    openSettings,
  } = usePrinterPermissions()

  const { printerDevices, isScanning, scan } = usePrinterScanner()

  const { connectionState, selectedPrinter, connect, deselectPrinter } =
    usePrinterConnection()

  const { printTest, isPrinting } = useTestPrint()

  // ----- Handlers -----
  const handleScan = useCallback(async () => {
    bluetooth.init()
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
    await printTest(selectedPrinter)
  }, [selectedPrinter, printTest])

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

      {/* Found Devices */}
      <DeviceListSection
        title="Printer Tersedia"
        devices={printerDevices}
        selectedAddress={selectedPrinter?.address}
        onSelect={handleSelectDevice}
        emptyMessage="Tarik ke bawah untuk memuat ulang daftar printer Bluetooth yang tersedia"
      />
    </ScrollView>
  )
}
