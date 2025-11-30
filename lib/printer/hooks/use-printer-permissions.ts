import { useState, useCallback } from "react"
import { Platform, PermissionsAndroid, Linking, Alert } from "react-native"
import { usePrinterStore } from "@/lib/printer/store/printer.store"

type PermissionStatus = "granted" | "denied" | "blocked" | "undetermined"
type PermissionResult = { status: PermissionStatus; canAskAgain: boolean }

export function usePrinterPermissions() {
  const [isChecking, setIsChecking] = useState(false)
  const { hasPermissions, permissionsChecked, setHasPermissions, setPermissionsChecked } = usePrinterStore()

  const openSettings = useCallback(() => {
    Linking.openSettings()
  }, [])

  const showPermissionDeniedAlert = useCallback(() => {
    Alert.alert(
      "Izin Diperlukan",
      "Aplikasi memerlukan akses Bluetooth untuk menghubungkan ke printer. Silakan aktifkan di pengaturan.",
      [
        { text: "Batal", style: "cancel" },
        { text: "Buka Pengaturan", onPress: openSettings },
      ]
    )
  }, [openSettings])

  const checkAndroidPermissions = useCallback(async (): Promise<PermissionResult> => {
    try {
      const bluetoothConnect = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      )
      const bluetoothScan = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
      )
      const fineLocation = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )

      if (bluetoothConnect && bluetoothScan && fineLocation) {
        return { status: "granted", canAskAgain: true }
      }

      return { status: "undetermined", canAskAgain: true }
    } catch {
      return { status: "denied", canAskAgain: false }
    }
  }, [])

  const requestAndroidPermissions = useCallback(async (): Promise<PermissionResult> => {
    try {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ])

      const connectResult = results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
      const scanResult = results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN]
      const locationResult = results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]

      const allGranted =
        connectResult === PermissionsAndroid.RESULTS.GRANTED &&
        scanResult === PermissionsAndroid.RESULTS.GRANTED &&
        locationResult === PermissionsAndroid.RESULTS.GRANTED

      if (allGranted) {
        return { status: "granted", canAskAgain: true }
      }

      const neverAskAgain =
        connectResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        scanResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        locationResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN

      return {
        status: neverAskAgain ? "blocked" : "denied",
        canAskAgain: !neverAskAgain,
      }
    } catch {
      return { status: "denied", canAskAgain: false }
    }
  }, [])

  const checkPermissions = useCallback(async (): Promise<boolean> => {
    setIsChecking(true)

    try {
      if (Platform.OS === "ios") {
        // iOS: CoreBluetooth handles permissions via Info.plist, prompts on first use
        setHasPermissions(true)
        setPermissionsChecked(true)
        return true
      }

      const result = await checkAndroidPermissions()
      const granted = result.status === "granted"
      setHasPermissions(granted)
      setPermissionsChecked(true)
      return granted
    } finally {
      setIsChecking(false)
    }
  }, [checkAndroidPermissions, setHasPermissions, setPermissionsChecked])

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    setIsChecking(true)

    try {
      if (Platform.OS === "ios") {
        setHasPermissions(true)
        setPermissionsChecked(true)
        return true
      }

      const result = await requestAndroidPermissions()

      if (result.status === "granted") {
        setHasPermissions(true)
        setPermissionsChecked(true)
        return true
      }

      if (result.status === "blocked") {
        showPermissionDeniedAlert()
      }

      setHasPermissions(false)
      setPermissionsChecked(true)
      return false
    } finally {
      setIsChecking(false)
    }
  }, [requestAndroidPermissions, setHasPermissions, setPermissionsChecked, showPermissionDeniedAlert])

  const ensurePermissions = useCallback(async (): Promise<boolean> => {
    const hasCurrentPermissions = await checkPermissions()
    if (hasCurrentPermissions) return true
    return requestPermissions()
  }, [checkPermissions, requestPermissions])

  return {
    hasPermissions,
    permissionsChecked,
    isChecking,
    checkPermissions,
    requestPermissions,
    ensurePermissions,
    openSettings,
  }
}
