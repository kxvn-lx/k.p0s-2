import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { BluetoothDevice } from "@/lib/printer/printer.types"

// ----- Types -----
type PrinterState = {
  hasPermissions: boolean
  permissionsChecked: boolean
  selectedPrinter: BluetoothDevice | null
  availableDevices: BluetoothDevice[]
  setHasPermissions: (has: boolean) => void
  setPermissionsChecked: (checked: boolean) => void
  setSelectedPrinter: (device: BluetoothDevice | null) => void
  setAvailableDevices: (devices: BluetoothDevice[]) => void
}

// ----- Store -----
export const usePrinterStore = create<PrinterState>()(
  persist(
    (set) => ({
      hasPermissions: false,
      permissionsChecked: false,
      selectedPrinter: null,
      availableDevices: [],
      setHasPermissions: (has) => set({ hasPermissions: has }),
      setPermissionsChecked: (checked) => set({ permissionsChecked: checked }),
      setSelectedPrinter: (device) => set({ selectedPrinter: device }),
      setAvailableDevices: (devices) => set({ availableDevices: devices }),
    }),
    {
      name: "printer-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ selectedPrinter: state.selectedPrinter }),
    }
  )
)

export default usePrinterStore