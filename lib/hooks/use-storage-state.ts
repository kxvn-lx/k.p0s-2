import { useEffect, useReducer } from "react"
import { largeSecureStore } from "../large-secure-store"

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void]

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>
}

// ----- Storage Functions -----

export async function setStorageItemAsync(key: string, value: string | null) {
  try {
    if (value == null) {
      await largeSecureStore.removeItem(key)
    } else {
      await largeSecureStore.setItem(key, value)
    }
  } catch (e) {
    console.error("Storage error:", e)
  }
}

// ----- Hook -----

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>()

  useEffect(() => {
    largeSecureStore.getItem(key).then((value: string | null) => {
      setState(value)
    })
  }, [key, setState])

  const setValue = (value: string | null) => {
    setState(value)
    setStorageItemAsync(key, value)
  }

  return [state, setValue]
}
