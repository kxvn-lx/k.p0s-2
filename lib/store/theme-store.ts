import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type ThemeType = "metal" | "sunset"

interface ThemeState {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

// ----- Storage wrapper -----
// Use expo-secure-store on native (iOS/Android) and AsyncStorage on web.
const isWeb = Platform.OS === "web"

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (isWeb) return await AsyncStorage.getItem(name)
    return await SecureStore.getItemAsync(name)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (isWeb) return await AsyncStorage.setItem(name, value)
    return await SecureStore.setItemAsync(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    if (isWeb) return await AsyncStorage.removeItem(name)
    return await SecureStore.deleteItemAsync(name)
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
