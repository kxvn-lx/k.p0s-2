import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { BluetoothDevice, ConnectionState, PrinterErrorInfo } from "@/lib/printer/printer.types"

// ----- Types -----
type PrinterState = {
  // Permission state
  hasPermissions: boolean
  permissionsChecked: boolean
  // Connection state
  connectionState: ConnectionState
  selectedPrinter: BluetoothDevice | null
  lastError: PrinterErrorInfo | null
  // Device discovery
  pairedDevices: BluetoothDevice[]
  foundDevices: BluetoothDevice[]
  isScanning: boolean
  // Actions
  setHasPermissions: (has: boolean) => void
  setPermissionsChecked: (checked: boolean) => void
  setConnectionState: (state: ConnectionState) => void
  setSelectedPrinter: (device: BluetoothDevice | null) => void
  setLastError: (error: PrinterErrorInfo | null) => void
  setPairedDevices: (devices: BluetoothDevice[]) => void
  setFoundDevices: (devices: BluetoothDevice[]) => void
  addFoundDevice: (device: BluetoothDevice) => void
  setIsScanning: (scanning: boolean) => void
  clearDevices: () => void
  reset: () => void
}

// ----- Initial State -----
const initialState = {
  hasPermissions: false,
  permissionsChecked: false,
  connectionState: "disconnected" as ConnectionState,
  selectedPrinter: null,
  lastError: null,
  pairedDevices: [],
  foundDevices: [],
  isScanning: false,
}

// ----- Store -----
export const usePrinterStore = create<PrinterState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setHasPermissions: (has) => set({ hasPermissions: has }),
      setPermissionsChecked: (checked) => set({ permissionsChecked: checked }),
      setConnectionState: (state) => set({ connectionState: state }),
      setSelectedPrinter: (device) => set({ selectedPrinter: device }),
      setLastError: (error) => set({ lastError: error }),
      setPairedDevices: (devices) => set({ pairedDevices: devices }),
      setFoundDevices: (devices) => set({ foundDevices: devices }),
      addFoundDevice: (device) => {
        const current = get().foundDevices
        const exists = current.some((d) => d.address === device.address)
        if (!exists) set({ foundDevices: [...current, device] })
      },
      setIsScanning: (scanning) => set({ isScanning: scanning }),
      clearDevices: () => set({ pairedDevices: [], foundDevices: [] }),
      reset: () => set({ ...initialState, selectedPrinter: get().selectedPrinter }),
    }),
    {
      name: "printer-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ selectedPrinter: state.selectedPrinter }),
    }
  )
)

export default usePrinterStore
