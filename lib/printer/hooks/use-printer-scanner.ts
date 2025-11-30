import { useCallback, useRef } from "react"
import { usePrinterStore } from "@/lib/printer/store/printer.store"
import { bluetooth } from "@/lib/printer/services/bluetooth.service"
import type { BluetoothDevice, PrinterErrorInfo } from "@/lib/printer/printer.types"
import { toast } from "@/lib/store/toast-store"

// Scan and manage device lists
export function usePrinterScanner() {
  const unsubscribesRef = useRef<(() => void)[]>([])
  const {
    pairedDevices,
    foundDevices,
    isScanning,
    setPairedDevices,
    setFoundDevices,
    addFoundDevice,
    setIsScanning,
    clearDevices,
    setLastError,
  } = usePrinterStore()

  const setupListeners = useCallback(() => {
    unsubscribesRef.current.forEach((unsub) => unsub())
    unsubscribesRef.current = []

    const unsubPaired = bluetooth.on("DEVICE_PAIRED", (devices) => {
      setPairedDevices(devices)
    })

    const unsubFound = bluetooth.on("DEVICE_FOUND", (device) => {
      addFoundDevice(device)
    })

    const unsubDone = bluetooth.on("SCAN_DONE", () => {
      setIsScanning(false)
    })


    unsubscribesRef.current = [unsubPaired, unsubFound, unsubDone]
  }, [setPairedDevices, addFoundDevice, setIsScanning])

  const scan = useCallback(async (): Promise<{
    paired: BluetoothDevice[]
    found: BluetoothDevice[]
  } | null> => {
    setIsScanning(true)
    clearDevices()
    setLastError(null)
    setupListeners()

    try {
      const result = await bluetooth.scanDevices()
      setPairedDevices(result.paired)
      setFoundDevices(result.found)
      return result
    } catch (error) {
      const printerError = error as PrinterErrorInfo
      setLastError(printerError)
      toast.error("Gagal Memindai", printerError.message)
      return null
    } finally {
      setIsScanning(false)
    }
  }, [setupListeners, clearDevices, setLastError, setPairedDevices, setFoundDevices, setIsScanning])

  const cleanup = useCallback(() => {
    unsubscribesRef.current.forEach((unsub) => unsub())
    unsubscribesRef.current = []
  }, [])

  // Filter devices by keywords
  const filterPrinters = useCallback((devices: BluetoothDevice[]): BluetoothDevice[] => {
    const printerKeywords = ["printer", "rpp", "thermal", "pos", "58mm", "80mm", "escpos"]
    return devices.filter((device) => {
      const nameLower = device.name.toLowerCase()
      return printerKeywords.some((keyword) => nameLower.includes(keyword))
    })
  }, [])

  // Combine and deduplicate paired and found devices
  const allDevices = [...pairedDevices, ...foundDevices].filter(
    (device, index, self) => self.findIndex((d) => d.address === device.address) === index
  )

  // Filter to only printer devices
  const printerDevices = filterPrinters(allDevices)

  return {
    pairedDevices,
    foundDevices,
    allDevices,
    printerDevices,
    isScanning,
    scan,
    cleanup,
    filterPrinters,
  }
}
