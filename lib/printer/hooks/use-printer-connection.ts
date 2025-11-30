import { useCallback, useRef } from "react"
import { usePrinterStore } from "@/lib/printer/store/printer.store"
import { bluetooth } from "@/lib/printer/services/bluetooth.service"
import type { BluetoothDevice, PrinterErrorInfo } from "@/lib/printer/printer.types"
import { toast } from "@/lib/store/toast-store"

// ----- Hook: Printer Connection Management -----
// Purpose: Handle device connection lifecycle (connect/disconnect/reconnect/autoConnect)
export function usePrinterConnection() {
  const unsubscribesRef = useRef<(() => void)[]>([])
  const {
    connectionState,
    selectedPrinter,
    lastError,
    setConnectionState,
    setSelectedPrinter,
    setLastError,
  } = usePrinterStore()

  const setupConnectionListeners = useCallback(() => {
    unsubscribesRef.current.forEach((unsub) => unsub())
    unsubscribesRef.current = []

    const unsubState = bluetooth.on("STATE_CHANGED", (state) => {
      setConnectionState(state)
    })

    const unsubLost = bluetooth.on("CONNECTION_LOST", () => {
      setConnectionState("disconnected")
      toast.warning("Koneksi Terputus", "Koneksi ke printer terputus")
    })

    unsubscribesRef.current = [unsubState, unsubLost]
  }, [setConnectionState])

  const connect = useCallback(
    async (device: BluetoothDevice): Promise<boolean> => {
      setLastError(null)
      setupConnectionListeners()

      try {
        await bluetooth.connect(device)
        setSelectedPrinter(device)
        toast.success("Terhubung", `Terhubung ke ${device.name}`)
        return true
      } catch (error) {
        const printerError = error as PrinterErrorInfo
        setLastError(printerError)
        toast.error("Gagal Terhubung", printerError.message)
        return false
      }
    },
    [setupConnectionListeners, setSelectedPrinter, setLastError]
  )

  const disconnect = useCallback(async (): Promise<void> => {
    await bluetooth.disconnect()
    setConnectionState("disconnected")
  }, [setConnectionState])

  const reconnect = useCallback(async (): Promise<boolean> => {
    if (!selectedPrinter) {
      toast.warning("Tidak Ada Printer", "Pilih printer terlebih dahulu")
      return false
    }

    setLastError(null)
    setupConnectionListeners()

    const success = await bluetooth.reconnect(selectedPrinter)
    if (success) {
      toast.success("Terhubung Kembali", `Terhubung ke ${selectedPrinter.name}`)
    } else {
      const error: PrinterErrorInfo = {
        code: "CONNECTION_FAILED",
        message: "Gagal terhubung kembali. Pastikan printer menyala.",
      }
      setLastError(error)
      toast.error("Gagal Terhubung", error.message)
    }

    return success
  }, [selectedPrinter, setupConnectionListeners, setLastError])

  const autoConnect = useCallback(async (): Promise<boolean> => {
    if (!selectedPrinter) return false

    const isConnected = await bluetooth.isConnected()
    if (isConnected) return true

    return reconnect()
  }, [selectedPrinter, reconnect])

  const deselectPrinter = useCallback(async (): Promise<void> => {
    await disconnect()
    setSelectedPrinter(null)
  }, [disconnect, setSelectedPrinter])

  const cleanup = useCallback(() => {
    unsubscribesRef.current.forEach((unsub) => unsub())
    unsubscribesRef.current = []
  }, [])

  const isConnected = connectionState === "connected"
  const isConnecting = connectionState === "connecting"
  const isReconnecting = connectionState === "reconnecting"
  const isDisconnected = connectionState === "disconnected"

  return {
    connectionState,
    selectedPrinter,
    lastError,
    isConnected,
    isConnecting,
    isReconnecting,
    isDisconnected,
    connect,
    disconnect,
    reconnect,
    autoConnect,
    deselectPrinter,
    cleanup,
  }
}
