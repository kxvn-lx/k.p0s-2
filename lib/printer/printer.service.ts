import { Platform, PermissionsAndroid, Linking } from "react-native"
import { BluetoothEscposPrinter, BluetoothManager } from "react-native-bluetooth-escpos-printer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { BluetoothDevice } from "./printer.types"

// ----- Constants -----
const STORAGE_KEY = "printer_selected"

// ----- Device Detection -----
export const isRPP02NDevice = (deviceName: string): boolean => {
  if (!deviceName) return false
  const name = deviceName.toLowerCase().trim()
  return name.includes("rpp02n") || name.includes("rpp-02n") || name.includes("rpp_02n")
}

// ----- Storage -----
export const saveSelectedPrinter = async (device: BluetoothDevice) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(device))
}

export const getSelectedPrinter = async (): Promise<BluetoothDevice | null> => {
  const stored = await AsyncStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export const clearSelectedPrinter = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY)
}

// ----- Permissions -----
export const hasBluetoothPermissions = async (): Promise<boolean> => {
  if (Platform.OS === "ios") return true

  const [scan, connect] = await Promise.all([
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN),
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT),
  ])
  return scan && connect
}

export const requestBluetoothPermissions = async (): Promise<boolean> => {
  if (Platform.OS === "ios") return true

  const results = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  ])
  return (
    results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === "granted" &&
    results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === "granted"
  )
}

export const openAppSettings = () => Linking.openSettings()

export const openBluetoothSettings = () => {
  Platform.OS === "android"
    ? Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS")
    : Linking.openURL("App-Prefs:Bluetooth")
}

// ----- Bluetooth Devices -----
export const getPairedDevices = async (): Promise<BluetoothDevice[]> => {
  try {
    const result = await BluetoothManager.enableBluetooth()
    if (!result || !Array.isArray(result)) return []

    return result
      .map((str) => {
        try {
          const parsed = JSON.parse(str)
          return { id: parsed.address, name: parsed.name || "Unknown", address: parsed.address }
        } catch {
          return null
        }
      })
      .filter((d): d is BluetoothDevice => d !== null)
  } catch {
    return []
  }
}

export const isDeviceStillPaired = async (address: string): Promise<boolean> => {
  const devices = await getPairedDevices()
  return devices.some((d) => d.address === address)
}

// ----- Initialize (check saved printer still valid) -----
export const initializePrinterState = async (): Promise<BluetoothDevice | null> => {
  const saved = await getSelectedPrinter()
  if (!saved) return null

  const stillPaired = await isDeviceStillPaired(saved.address)
  if (!stillPaired) {
    await clearSelectedPrinter()
    return null
  }
  return saved
}

// ----- Printing -----
export const connectForPrinting = async (): Promise<boolean> => {
  const printer = await getSelectedPrinter()
  if (!printer) return false

  const stillPaired = await isDeviceStillPaired(printer.address)
  if (!stillPaired) {
    await clearSelectedPrinter()
    return false
  }

  try {
    await BluetoothManager.connect(printer.address)
    return true
  } catch {
    return false
  }
}

export const printTestPage = async (): Promise<boolean> => {
  if (!(await connectForPrinting())) return false

  try {
    await BluetoothEscposPrinter.printerInit()
    await BluetoothEscposPrinter.printText("TEST OK\n", {})
    await BluetoothEscposPrinter.printAndFeed(1)
    return true
  } catch {
    return false
  }
}