import { useCallback, useRef, useState, useEffect } from "react"
import { Platform, PermissionsAndroid, Linking, Alert } from "react-native"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { bluetoothCore } from "../services/bluetooth-core.service"
import { printerCore } from "../services/printer-core.service"
import { printerService } from "../services/printer.service"
import { toast } from "@/lib/store/toast-store"
import { filterPrinters, deduplicateDevices } from "../utils/device-utils"
import { ConnectionState, BluetoothErrorInfo, BluetoothDevice } from "@/lib/printer/types/bluetooth.types"

// ----- Store Types -----
type PrinterState = {
    // Permission state
    hasPermissions: boolean
    permissionsChecked: boolean
    // Connection state
    connectionState: ConnectionState
    selectedPrinter: BluetoothDevice | null
    lastError: BluetoothErrorInfo | null
    // Device discovery
    pairedDevices: BluetoothDevice[]
    foundDevices: BluetoothDevice[]
    isScanning: boolean
    // Actions
    setHasPermissions: (has: boolean) => void
    setPermissionsChecked: (checked: boolean) => void
    setConnectionState: (state: ConnectionState) => void
    setSelectedPrinter: (device: BluetoothDevice | null) => void
    setLastError: (error: BluetoothErrorInfo | null) => void
    setPairedDevices: (devices: BluetoothDevice[]) => void
    setFoundDevices: (devices: BluetoothDevice[]) => void
    addFoundDevice: (device: BluetoothDevice) => void
    setIsScanning: (scanning: boolean) => void
    clearDevices: () => void
    reset: () => void
}

// ----- Store -----
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

// ----- Permission Management -----

type PermissionStatus = "granted" | "denied" | "blocked" | "undetermined"
type PermissionResult = { status: PermissionStatus; canAskAgain: boolean }

const checkAndroidPermissionsInternal = async (): Promise<PermissionResult> => {
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
}

const requestAndroidPermissions = async (): Promise<PermissionResult> => {
    try {
        const results = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ])

        const connectResult =
            results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
        const scanResult =
            results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN]
        const locationResult =
            results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]

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
}

// ----- Main Printer Hook -----

export function usePrinter() {
    const unsubscribesRef = useRef<(() => void)[]>([])
    const {
        connectionState,
        selectedPrinter,
        lastError,
        pairedDevices,
        foundDevices,
        isScanning,
        hasPermissions,
        permissionsChecked,
        setConnectionState,
        setSelectedPrinter,
        setLastError,
        setPairedDevices,
        setFoundDevices,
        setIsScanning,
        clearDevices,
        setHasPermissions,
        setPermissionsChecked,
    } = usePrinterStore()

    const [isChecking, setIsChecking] = useState(false)

    // ----- Auto-check permissions on mount -----
    useEffect(() => {
        const initPermissions = async () => {
            if (permissionsChecked) return

            setIsChecking(true)
            try {
                if (Platform.OS === "ios") {
                    setHasPermissions(true)
                    setPermissionsChecked(true)
                    return
                }

                const result = await checkAndroidPermissionsInternal()
                const granted = result.status === "granted"
                setHasPermissions(granted)
                setPermissionsChecked(true)
            } finally {
                setIsChecking(false)
            }
        }

        initPermissions()
    }, [permissionsChecked, setHasPermissions, setPermissionsChecked])

    const openSettings = useCallback(() => {
        Linking.openSettings()
    }, [])

    const showPermissionDeniedAlert = useCallback(() => {
        Alert.alert(
            "Izin Diperlukan",
            "Aplikasi perlu akses Bluetooth for hubungi printer. kase manyala di pengaturan.",
            [
                { text: "Batal", style: "cancel" },
                { text: "Buka Pengaturan", onPress: openSettings },
            ]
        )
    }, [openSettings])

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
    }, [
        requestAndroidPermissions,
        setHasPermissions,
        setPermissionsChecked,
        showPermissionDeniedAlert,
    ])

    const ensurePermissions = useCallback(async (): Promise<boolean> => {
        if (hasPermissions) return true
        return requestPermissions()
    }, [hasPermissions, requestPermissions])

    // ----- Connection Management -----

    const setupConnectionListeners = useCallback(() => {
        unsubscribesRef.current.forEach((unsub) => unsub())
        unsubscribesRef.current = []

        // Listen for state changes
        const stateChangeListener = () => {
            const state = bluetoothCore.getConnectionState()
            setConnectionState(state)
        }

        // Setup interval to check state changes
        const intervalId = setInterval(stateChangeListener, 100)
        unsubscribesRef.current = [
            () => clearInterval(intervalId),
            () => { }, // Placeholder for connection lost listener
        ]
    }, [setConnectionState])

    const connect = useCallback(
        async (
            device: BluetoothDevice,
            shouldConnect = false
        ): Promise<boolean> => {
            setLastError(null)

            // If we just need to select the printer without connecting
            if (!shouldConnect) {
                setSelectedPrinter(device)
                toast.success(
                    "Printer Dipilih",
                    `${device.name} dipilih sebagai printer default`
                )
                return true
            }

            // Actually connect to the printer
            setupConnectionListeners()

            try {
                await bluetoothCore.connect(device)
                setSelectedPrinter(device)
                toast.success("Terhubung", `Terhubung ka ${device.name}`)
                return true
            } catch (error) {
                const printerError = error as BluetoothErrorInfo
                setLastError(printerError)
                toast.error("Gagal Terhubung", printerError.message)
                return false
            }
        },
        [setupConnectionListeners, setSelectedPrinter, setLastError]
    )

    const disconnect = useCallback(async (): Promise<void> => {
        await bluetoothCore.disconnect()
        setConnectionState("disconnected")
    }, [setConnectionState])

    const reconnect = useCallback(async (): Promise<boolean> => {
        if (!selectedPrinter) {
            toast.warning("Tidak Ada Printer", "Pilih printer dulu")
            return false
        }

        setLastError(null)
        setupConnectionListeners()

        const success = await bluetoothCore.reconnect(selectedPrinter)
        if (success) {
            toast.success("Terhubung Kembali", `Terhubung ka ${selectedPrinter.name}`)
        } else {
            const error: BluetoothErrorInfo = {
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

        const isConnected = await bluetoothCore.isConnected()
        if (isConnected) return true

        return reconnect()
    }, [selectedPrinter, reconnect])

    const deselectPrinter = useCallback(async (): Promise<void> => {
        if (selectedPrinter) {
            try {
                await bluetoothCore.unpair(selectedPrinter.address)
                toast.success(
                    "Perangkat Dihapus",
                    `${selectedPrinter.name}tahapus dari daftar`
                )
            } catch (error) {
                // If unpair fails, at least disconnect
                await disconnect()
                toast.warning(
                    "Taputus",
                    "Perangkat so kase putus dari apk tapi mungkin masih terpasang"
                )
            }
        }
        setSelectedPrinter(null)
    }, [selectedPrinter, disconnect, setSelectedPrinter])

    const cleanup = useCallback(() => {
        unsubscribesRef.current.forEach((unsub) => unsub())
        unsubscribesRef.current = []
    }, [])

    // ----- Device Scanning -----

    const scan = useCallback(async (): Promise<{
        paired: BluetoothDevice[]
        found: BluetoothDevice[]
    } | null> => {
        setIsScanning(true)
        clearDevices()
        setLastError(null)

        try {
            const result = await bluetoothCore.scanDevices()
            setPairedDevices(result.paired)
            setFoundDevices(result.found)
            return result
        } catch (error) {
            const printerError = error as BluetoothErrorInfo
            setLastError(printerError)
            toast.error("Gagal Memindai", printerError.message)
            return null
        } finally {
            setIsScanning(false)
        }
    }, [clearDevices, setLastError, setPairedDevices, setFoundDevices, setIsScanning])

    // ----- Device Utilities -----

    // Combine and deduplicate paired and found devices
    const allDevices = deduplicateDevices([...pairedDevices, ...foundDevices])

    // Filter to only printer devices
    const printerDevices = filterPrinters(allDevices)

    // ----- State Derivations -----

    const isConnected = connectionState === "connected"
    const isConnecting = connectionState === "connecting"
    const isReconnecting = connectionState === "reconnecting"
    const isDisconnected = connectionState === "disconnected"

    return {
        // Permission state
        hasPermissions,
        permissionsChecked,
        isChecking,
        // Connection state
        connectionState,
        selectedPrinter,
        lastError,
        isConnected,
        isConnecting,
        isReconnecting,
        isDisconnected,
        // Device state
        pairedDevices,
        foundDevices,
        allDevices,
        printerDevices,
        isScanning,
        // Permission methods
        requestPermissions,
        ensurePermissions,
        openSettings,
        // Connection methods
        connect,
        disconnect,
        reconnect,
        autoConnect,
        deselectPrinter,
        cleanup,
        // Scanning methods
        scan,
        // Core services
        bluetoothCore,
        printerCore,
        printerService,
    }
}