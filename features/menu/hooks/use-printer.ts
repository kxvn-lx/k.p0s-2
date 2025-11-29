import { useCallback, useState, useRef, useEffect } from "react"
import usePrinterStore from "@/features/menu/store/printer-store"
import { toast } from "@/lib/store/toast-store"
import {
  hasBluetoothPermissions,
  requestBluetoothPermissions,
  getPairedDevices,
  saveSelectedPrinter,
  clearSelectedPrinter,
  getSelectedPrinter,
  printTestPage,
  printReceipt as printReceiptService,
  openAppSettings,
  openBluetoothSettings,
  isRPP02NDevice,
  isDeviceStillPaired,
  initializePrinterState,
} from "@/features/menu/utils/printer-service"
import { formatBasketToReceipt } from "@/features/menu/utils/receipt-formatter"
import type { BluetoothDevice, ReceiptData } from "@/features/menu/types/printer.types"
import type { BasketItem } from "@/features/keranjang/types/keranjang.types"

// ----- Hook -----
export function usePrinter() {
  const store = usePrinterStore()
  const [isLoading, setIsLoading] = useState(false)
  const initRef = useRef(false)

  // ----- Auto-init on mount -----
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    ;(async () => {
      const hasPerms = await hasBluetoothPermissions()
      store.setHasPermissions(hasPerms)
      store.setPermissionsChecked(true)

      if (!hasPerms) return

      const printer = await initializePrinterState()
      if (printer) store.setSelectedPrinter(printer)
    })()
  }, [])

  // ----- Permissions -----
  const checkPermissions = useCallback(async () => {
    const hasPerms = await hasBluetoothPermissions()
    store.setHasPermissions(hasPerms)
    store.setPermissionsChecked(true)
    return hasPerms
  }, [store])

  const requestPermissions = useCallback(async () => {
    const granted = await requestBluetoothPermissions()
    store.setHasPermissions(granted)
    store.setPermissionsChecked(true)
    if (!granted) toast.warning("Izin Diperlukan", "Buka pengaturan untuk mengaktifkan izin Bluetooth")
    return granted
  }, [store])

  // ----- Devices -----
  const loadPairedDevices = useCallback(async () => {
    setIsLoading(true)
    try {
      const devices = await getPairedDevices()
      store.setAvailableDevices(devices)
      if (devices.length === 0) toast.info("Tidak Ada Perangkat", "Pasangkan printer di pengaturan Bluetooth")
    } catch {
      toast.error("Gagal", "Gagal memuat perangkat")
    } finally {
      setIsLoading(false)
    }
  }, [store])

  const selectDevice = useCallback(async (device: BluetoothDevice) => {
    if (!isRPP02NDevice(device.name)) {
      toast.warning("Tidak Didukung", "Hanya printer RPP02N yang didukung")
      return false
    }
    await saveSelectedPrinter(device)
    store.setSelectedPrinter(device)
    toast.success("Printer Dipilih", device.name)
    return true
  }, [store])

  const deselectDevice = useCallback(async () => {
    await clearSelectedPrinter()
    store.setSelectedPrinter(null)
    toast.info("Printer Dihapus", "Pilih printer baru untuk mencetak")
  }, [store])

  const refreshPrinterStatus = useCallback(async () => {
    const selected = await getSelectedPrinter()
    if (!selected) {
      store.setSelectedPrinter(null)
      return
    }
    const stillPaired = await isDeviceStillPaired(selected.address)
    if (!stillPaired) {
      await clearSelectedPrinter()
      store.setSelectedPrinter(null)
      toast.warning("Printer Tidak Ditemukan", "Printer sudah tidak dipasangkan")
    } else {
      store.setSelectedPrinter(selected)
    }
  }, [store])

  // ----- Printing -----
  const testPrint = useCallback(async () => {
    if (!store.selectedPrinter) {
      toast.warning("Tidak Ada Printer", "Pilih printer terlebih dahulu")
      return false
    }
    toast.info("Mencetak...", "Mengirim halaman tes")
    const success = await printTestPage()
    success
      ? toast.success("Berhasil", "Halaman tes berhasil dicetak")
      : toast.error("Gagal Cetak", "Pastikan printer menyala dan terhubung")
    return success
  }, [store.selectedPrinter])

  const printReceipt = useCallback(async (data: ReceiptData): Promise<boolean> => {
    if (!store.selectedPrinter) {
      toast.warning("Tidak Ada Printer", "Pilih printer terlebih dahulu")
      return false
    }
    toast.info("Mencetak...", "Mengirim struk")
    const success = await printReceiptService(data)
    success
      ? toast.success("Berhasil", "Struk berhasil dicetak")
      : toast.error("Gagal Cetak", "Pastikan printer menyala dan terhubung")
    return success
  }, [store.selectedPrinter])

  const printBasketReceipt = useCallback(
    async (
      items: Record<string, BasketItem>,
      options?: { storeName?: string; paymentMethod?: string; cashReceived?: number }
    ): Promise<boolean> => {
      if (!store.selectedPrinter) {
        toast.warning("Printer Belum Dipilih", "Pilih printer di menu Pengaturan")
        return false
      }
      return printReceipt(formatBasketToReceipt(items, options))
    },
    [store.selectedPrinter, printReceipt]
  )

  // ----- Computed -----
  const sortedDevices = [...store.availableDevices].sort((a, b) => {
    const aRPP = isRPP02NDevice(a.name)
    const bRPP = isRPP02NDevice(b.name)
    return aRPP === bRPP ? 0 : aRPP ? -1 : 1
  })

  return {
    // State
    hasPermissions: store.hasPermissions,
    permissionsChecked: store.permissionsChecked,
    selectedPrinter: store.selectedPrinter,
    isLoading,
    availableDevices: sortedDevices,
    // Computed
    hasSelectedPrinter: store.selectedPrinter !== null,
    needsPermissions: !store.hasPermissions,
    // Actions
    checkPermissions,
    requestPermissions,
    loadPairedDevices,
    selectDevice,
    deselectDevice,
    refreshPrinterStatus,
    testPrint,
    printReceipt,
    printBasketReceipt,
    openAppSettings,
    openBluetoothSettings,
  }
}

export default usePrinter