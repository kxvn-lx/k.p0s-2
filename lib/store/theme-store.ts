import Storage from "expo-sqlite/kv-store"
import { create } from "zustand"
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware"

type ThemeType = "metal" | "solar" | "teduh"

interface ThemeState {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

// ----- Synchronous SQLite KV Storage -----
const sqliteStorage: StateStorage = {
  getItem: (key) => Storage.getItemSync(key),
  setItem: (key, value) => Storage.setItemSync(key, value),
  removeItem: (key) => Storage.removeItemSync(key),
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "metal",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => sqliteStorage),
    }
  )
)

