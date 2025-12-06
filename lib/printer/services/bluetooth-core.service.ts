import { DeviceEventEmitter, Platform } from "react-native"
import {
    BluetoothDevice,
    BluetoothManager,
    PAGE_WIDTH,
} from "lx-react-native-bluetooth-printer"
import { ConnectionState, BluetoothErrorInfo, BluetoothError } from "@/lib/printer/types/bluetooth.types"
import { PrinterConfig } from "@/lib/printer/types/printer.types"

const CONNECTION_TIMEOUT_MS = 2500
const DEFAULT_CHARACTER_PER_LINE = 32

// ----- Bluetooth Core Service -----
// Handles low-level Bluetooth operations

class BluetoothCoreService {
    private connectionState: ConnectionState = "disconnected"
    private connectedDevice: BluetoothDevice | null = null
    private eventSubscriptions: ReturnType<
        typeof DeviceEventEmitter.addListener
    >[] = []
    private isInitialized = false
    private config: PrinterConfig = {
        deviceWidth: PAGE_WIDTH.WIDTH_58,
        encoding: "UTF-8",
        characterPerLine: DEFAULT_CHARACTER_PER_LINE,
    }

    // ----- Initialization -----
    init(): void {
        if (this.isInitialized) return
        this.setupEventListeners()
        this.isInitialized = true
    }

    destroy(): void {
        this.eventSubscriptions.forEach((sub) => sub.remove())
        this.eventSubscriptions = []
        this.isInitialized = false
    }

    private setupEventListeners(): void {
        const nativeManager = BluetoothManager as unknown as Record<string, string>

        const events = [
            {
                event: nativeManager.EVENT_CONNECTED || "EVENT_CONNECTED",
                handler: () => {
                    if (this.connectedDevice) {
                        this.setConnectionState("connected")
                    }
                },
            },
            {
                event: nativeManager.EVENT_CONNECTION_LOST || "EVENT_CONNECTION_LOST",
                handler: () => {
                    this.setConnectionState("disconnected")
                    this.connectedDevice = null
                },
            },
            {
                event: nativeManager.EVENT_UNABLE_CONNECT || "EVENT_UNABLE_CONNECT",
                handler: () => {
                    this.setConnectionState("disconnected")
                },
            },
        ]

        events.forEach(({ event, handler }) => {
            const sub = DeviceEventEmitter.addListener(event, handler)
            this.eventSubscriptions.push(sub)
        })
    }

    private setConnectionState(state: ConnectionState): void {
        this.connectionState = state
    }

    getConnectionState(): ConnectionState {
        return this.connectionState
    }

    getConnectedDevice(): BluetoothDevice | null {
        return this.connectedDevice
    }

    async enable(): Promise<{
        success: boolean
        pairedDevices: BluetoothDevice[]
    }> {
        try {
            const result = await BluetoothManager.enableBluetooth()
            if (!result) return { success: true, pairedDevices: [] }
            return { success: true, pairedDevices: this.parseDevices(result) }
        } catch (error) {
            throw this.createError(
                "BLUETOOTH_DISABLED",
                "Gagal mengaktifkan Bluetooth",
                error
            )
        }
    }

    async scanDevices(): Promise<{
        paired: BluetoothDevice[]
        found: BluetoothDevice[]
    }> {
        try {
            if (!this.isInitialized) {
                this.init()
            }

            if (Platform.OS === "ios") {
                await this.waitForCentralManagerReady()
            }

            const result = await BluetoothManager.scanDevices(1.5)

            const parsed = typeof result === "string" ? JSON.parse(result) : result

            return {
                paired: this.parseDevices(parsed.paired || []),
                found: this.parseDevices(parsed.found || []),
            }
        } catch (error) {
            if ((error as BluetoothErrorInfo).code) throw error
            const errorMessage = String(error)
            if (
                errorMessage.includes("not enabled") ||
                errorMessage.includes("Bluetooth")
            ) {
                throw this.createError(
                    "BLUETOOTH_DISABLED",
                    "Bluetooth tidak aktif. Pastikan Bluetooth diaktifkan."
                )
            }
            throw this.createError("SCAN_FAILED", "Gagal mencari perangkat", error)
        }
    }

    private async waitForCentralManagerReady(): Promise<void> {
        const maxWaitTime = 3000
        const checkInterval = 100
        const startTime = Date.now()

        while (Date.now() - startTime < maxWaitTime) {
            try {
                const isEnabled = await BluetoothManager.isBluetoothEnabled()
                if (String(isEnabled) === "true") {
                    return
                }
            } catch {
                // Continue waiting if check fails
            }

            await new Promise((resolve) => setTimeout(resolve, checkInterval))
        }

        throw this.createError(
            "BLUETOOTH_DISABLED",
            "Bluetooth tidak tersedia atau tidak diaktifkan"
        )
    }

    async connect(device: BluetoothDevice): Promise<void> {
        if (
            this.connectionState === "connected" &&
            this.connectedDevice?.address === device.address
        ) {
            return
        }

        this.setConnectionState("connecting")
        this.connectedDevice = device

        if (!this.isInitialized) {
            this.init()
        }

        try {
            if (Platform.OS === "ios") {
                await this.waitForCentralManagerReady()
            }

            const connectionPromise = BluetoothManager.connect(device.address)
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(
                    () => reject(new Error("Connection timeout")),
                    CONNECTION_TIMEOUT_MS
                )
            })

            await Promise.race([connectionPromise, timeoutPromise])

            this.setConnectionState("connected")
        } catch (error) {
            this.setConnectionState("disconnected")
            this.connectedDevice = null
            throw this.createError(
                "CONNECTION_FAILED",
                "Gagal terhubung ke printer",
                error
            )
        }
    }

    async disconnect(address?: string): Promise<void> {
        const targetAddress = address || this.connectedDevice?.address

        try {
            if (targetAddress) {
                await BluetoothManager.disconnect(targetAddress)
            }
        } catch {
            // Ignore disconnect errors - connection may already be closed
        } finally {
            this.setConnectionState("disconnected")
            this.connectedDevice = null
        }
    }

    async unpair(address: string): Promise<void> {
        try {
            // Disconnect if currently connected to the target device
            if (this.connectedDevice?.address === address) {
                await this.disconnect()
            }

            await BluetoothManager.unpair(address)
        } catch (error) {
            throw this.createError(
                "UNPAIR_FAILED",
                "Gagal menghapus perangkat",
                error
            )
        }
    }

    async reconnect(device: BluetoothDevice): Promise<boolean> {
        this.setConnectionState("reconnecting")

        try {
            await this.connect(device)
            return true
        } catch {
            this.setConnectionState("disconnected")
            return false
        }
    }

    async isConnected(): Promise<boolean> {
        const address = await this.getConnectedAddress()
        return !!address
    }

    private async getConnectedAddress(): Promise<string | null> {
        try {
            const address = await BluetoothManager.getConnectedDeviceAddress()
            if (typeof address === "string" && address.length > 0) return address
            return null
        } catch {
            return null
        }
    }

    // ----- Device Parsing Utilities -----
    private parseDevice(
        data: string | Record<string, string>
    ): BluetoothDevice | null {
        try {
            const parsed = typeof data === "string" ? JSON.parse(data) : data
            if (!parsed.address) return null
            return {
                name: parsed.name || "-",
                address: parsed.address,
            }
        } catch {
            return null
        }
    }

    private parseDevices(
        data: string | string[] | Record<string, string>[]
    ): BluetoothDevice[] {
        try {
            let items: Record<string, string>[]
            if (typeof data === "string") {
                items = JSON.parse(data)
            } else if (Array.isArray(data)) {
                items = data.map((d) => (typeof d === "string" ? JSON.parse(d) : d))
            } else {
                return []
            }

            return items
                .map((item) => this.parseDevice(item))
                .filter((d): d is BluetoothDevice => d !== null)
        } catch {
            return []
        }
    }

    private createError(
        code: BluetoothError,
        message: string,
        originalError?: unknown
    ): BluetoothErrorInfo {
        return { code, message, originalError }
    }

    setConfig(config: Partial<PrinterConfig>): void {
        this.config = { ...this.config, ...config }
    }

    getConfig(): PrinterConfig {
        return { ...this.config }
    }
}

// Singleton instance
export const bluetoothCore = new BluetoothCoreService()