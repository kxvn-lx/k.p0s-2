import * as SecureStore from "expo-secure-store"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type ThemeType = "metal" | "sunset"

interface ThemeState {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name)
  },
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "metal", // Default to Metal
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
)
