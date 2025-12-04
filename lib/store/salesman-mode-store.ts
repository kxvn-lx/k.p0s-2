import Storage from "expo-sqlite/kv-store"
import { create } from "zustand"
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware"

// ----- Types -----
interface SalesmanModeState {
  isSalesmanModeEnabled: boolean
  setIsSalesmanModeEnabled: (enabled: boolean) => void
}

// ----- Synchronous SQLite KV Storage -----
const sqliteStorage: StateStorage = {
  getItem: (key) => Storage.getItemSync(key),
  setItem: (key, value) => Storage.setItemSync(key, value),
  removeItem: (key) => Storage.removeItemSync(key),
}

// ----- Store -----
export const useSalesmanModeStore = create<SalesmanModeState>()(
  persist(
    (set) => ({
      isSalesmanModeEnabled: false,
      setIsSalesmanModeEnabled: (enabled) => set({ isSalesmanModeEnabled: enabled }),
    }),
    {
      name: "salesman-mode-storage",
      storage: createJSONStorage(() => sqliteStorage),
    }
  )
)
