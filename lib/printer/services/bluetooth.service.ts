import { DeviceEventEmitter } from "react-native"
import { BluetoothManager, BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import type { BluetoothDevice, ConnectionState, PrinterError, PrinterErrorInfo, PrinterConfig } from "@/lib/printer/printer.types"

// Constants
const CONNECTION_TIMEOUT_MS = 10000
const RECONNECT_ATTEMPTS = 3
const RECONNECT_DELAY_MS = 1000

// ----- Event Types -----
export type BluetoothEventType =
  | "DEVICE_FOUND"
  | "DEVICE_PAIRED"
  | "SCAN_DONE"
  | "CONNECTED"
  | "DISCONNECTED"
  | "CONNECTION_LOST"
  | "STATE_CHANGED"

export type BluetoothEventPayload = {
  DEVICE_FOUND: BluetoothDevice
  DEVICE_PAIRED: BluetoothDevice[]
  SCAN_DONE: void
  CONNECTED: BluetoothDevice
  DISCONNECTED: void
  CONNECTION_LOST: void
  STATE_CHANGED: ConnectionState
}

type Listener<T extends BluetoothEventType> = (payload: BluetoothEventPayload[T]) => void
type ListenerMap = Map<string, { type: BluetoothEventType; listener: Listener<BluetoothEventType> }>

// ----- Bluetooth Service -----
// Low-level Bluetooth operations: device discovery, connection, basic printing commands
class BluetoothService {
  private listeners: ListenerMap = new Map()
  private connectionState: ConnectionState = "disconnected"
  private connectedDevice: BluetoothDevice | null = null
  private eventSubscriptions: ReturnType<typeof DeviceEventEmitter.addListener>[] = []
  private isInitialized = false
  // Suppress next CONNECTION_LOST event for intentional disconnects
  private suppressNextConnectionLost = false
  private config: PrinterConfig = {
    deviceWidth: 384,
    encoding: "UTF-8",
    characterPerLine: 32,
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
    this.listeners.clear()
    this.isInitialized = false
  }

  private setupEventListeners(): void {
    const events = [
      {
        event: BluetoothManager.EVENT_DEVICE_FOUND,
        handler: (data: { device: string }) => {
          const device = this.parseDevice(data.device)
          if (device) this.emit("DEVICE_FOUND", device)
        },
      },
      {
        event: BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        handler: (data: { devices: string }) => {
          const devices = this.parseDevices(data.devices)
          this.emit("DEVICE_PAIRED", devices)
        },
      },
      {
        event: BluetoothManager.EVENT_DEVICE_DISCOVER_DONE,
        handler: () => this.emit("SCAN_DONE", undefined),
      },
      {
        event: BluetoothManager.EVENT_CONNECTED,
        handler: () => {
          if (this.connectedDevice) {
            this.setConnectionState("connected")
            this.emit("CONNECTED", this.connectedDevice)
          }
        },
      },
      {
        event: BluetoothManager.EVENT_CONNECTION_LOST,
        handler: () => {
          if (this.suppressNextConnectionLost) {
            this.suppressNextConnectionLost = false
            return
          }
          this.setConnectionState("disconnected")
          this.connectedDevice = null
          this.emit("CONNECTION_LOST", undefined)
        },
      },
      {
        event: BluetoothManager.EVENT_UNABLE_CONNECT,
        handler: () => {
          this.setConnectionState("disconnected")
          this.emit("DISCONNECTED", undefined)
        },
      },
    ]

    events.forEach(({ event, handler }) => {
      const sub = DeviceEventEmitter.addListener(event, handler)
      this.eventSubscriptions.push(sub)
    })
  }

  // ----- State Management -----
  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state
    this.emit("STATE_CHANGED", state)
  }

  getConnectionState(): ConnectionState {
    return this.connectionState
  }

  getConnectedDevice(): BluetoothDevice | null {
    return this.connectedDevice
  }

  // ----- Event Emitter -----
  on<T extends BluetoothEventType>(type: T, listener: Listener<T>): () => void {
    const id = Math.random().toString(36).slice(2)
    this.listeners.set(id, {
      type,
      listener: listener as Listener<BluetoothEventType>,
    })
    return () => this.listeners.delete(id)
  }

  private emit<T extends BluetoothEventType>(
    type: T,
    payload: BluetoothEventPayload[T]
  ): void {
    this.listeners.forEach(({ type: listenerType, listener }) => {
      if (listenerType === type) listener(payload)
    })
  }

  // ----- Bluetooth Control -----
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

  // Device discovery - wrapper around native scan and events
  async scanDevices(): Promise<{
    paired: BluetoothDevice[]
    found: BluetoothDevice[]
  }> {
    try {
      if (!this.isInitialized) {
        this.init()
      }

      // Call native scanDevices - returns promise when scan finishes
      const result = await BluetoothManager.scanDevices()

      // Parse the resulting JSON string
      const parsed = typeof result === "string" ? JSON.parse(result) : result

      return {
        paired: this.parseDevices(parsed.paired || []),
        found: this.parseDevices(parsed.found || []),
      }
    } catch (error) {
      if ((error as PrinterErrorInfo).code) throw error
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

  // ----- Connection Management -----
  async connect(device: BluetoothDevice): Promise<void> {
    if (
      this.connectionState === "connected" &&
      this.connectedDevice?.address === device.address
    ) {
      return
    }

    this.setConnectionState("connecting")
    this.connectedDevice = device

    try {
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

  async disconnect(): Promise<void> {
    if (!this.connectedDevice) return

    // Intentional disconnect: suppress next CONNECTION_LOST to avoid noisy UI toasts
    this.suppressNextConnectionLost = true
    try {
      await BluetoothManager.disconnect(this.connectedDevice.address)
    } catch {
      // Ignore disconnect errors
    } finally {
      this.setConnectionState("disconnected")
      this.connectedDevice = null
      this.emit("DISCONNECTED", undefined)
      // Ensure suppression is cleared even if native doesn't emit CONNECTION_LOST
      this.suppressNextConnectionLost = false
    }
  }

  async unpair(address: string): Promise<void> {
    try {
      // Disconnect if currently connected to the target device
      if (this.connectedDevice?.address === address) {
        this.suppressNextConnectionLost = true
        await this.disconnect()
      }

      // Attempt to unpair (Android only)
      const manager = BluetoothManager as typeof BluetoothManager & {
        unpaire?: (address: string) => Promise<void>
      }
      if (manager.unpaire) {
        await manager.unpaire(address)
      }
    } catch (error) {
      throw this.createError(
        "UNPAIR_FAILED",
        "Gagal menghapus perangkat",
        error
      )
    }
  }

  async reconnect(
    device: BluetoothDevice,
    attempts = RECONNECT_ATTEMPTS
  ): Promise<boolean> {
    this.setConnectionState("reconnecting")

    for (let i = 0; i < attempts; i++) {
      try {
        await this.connect(device)
        return true
      } catch {
        if (i < attempts - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, RECONNECT_DELAY_MS)
          )
        }
      }
    }

    this.setConnectionState("disconnected")
    return false
  }

  async isConnected(): Promise<boolean> {
    const address = await this.getConnectedAddress()
    return !!address
  }

  private async getConnectedAddress(): Promise<string | null> {
    try {
      const address: unknown =
        await BluetoothManager.getConnectedDeviceAddress()
      if (typeof address === "string" && address.length > 0) return address
      return null
    } catch {
      return null
    }
  }

  // Print commands (low-level wrapper)
  async initPrinter(): Promise<void> {
    await BluetoothEscposPrinter.printerInit()
    await BluetoothEscposPrinter.setWidth(this.config.deviceWidth)
  }

  async printText(
    text: string,
    options?: {
      align?: "left" | "center" | "right"
      bold?: boolean
      widthMultiplier?: number
      heightMultiplier?: number
    }
  ): Promise<void> {
    const alignMap = { left: 0, center: 1, right: 2 }

    if (options?.align) {
      await BluetoothEscposPrinter.printerAlign(alignMap[options.align])
    }
    if (options?.bold) await BluetoothEscposPrinter.setBlob(1)

    await BluetoothEscposPrinter.printText(text + "\n", {
      encoding: this.config.encoding,
      widthtimes: options?.widthMultiplier ?? 0,
      heigthtimes: options?.heightMultiplier ?? 0,
    })

    if (options?.bold) await BluetoothEscposPrinter.setBlob(0)
    if (options?.align) await BluetoothEscposPrinter.printerAlign(0)
  }

  async printColumn(
    columnWidths: number[],
    columnAligns: number[],
    columnTexts: string[]
  ): Promise<void> {
    await BluetoothEscposPrinter.printColumn(
      columnWidths,
      columnAligns,
      columnTexts,
      { encoding: this.config.encoding }
    )
  }

  async printLine(char = "-"): Promise<void> {
    const line = char.repeat(this.config.characterPerLine)
    await BluetoothEscposPrinter.printText(line + "\n", {
      encoding: this.config.encoding,
    })
  }

  async printBlank(): Promise<void> {
    await BluetoothEscposPrinter.printText("\n", {})
  }

  async feed(lines = 1): Promise<void> {
    await BluetoothEscposPrinter.printAndFeed(lines)
  }

  async cut(): Promise<void> {
    await BluetoothEscposPrinter.cutOnePoint()
  }

  // Parsing helpers
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
    code: PrinterError,
    message: string,
    originalError?: unknown
  ): PrinterErrorInfo {
    return { code, message, originalError }
  }

  // Configuration
  setConfig(config: Partial<PrinterConfig>): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): PrinterConfig {
    return { ...this.config }
  }
}

// ----- Singleton Export -----
export const bluetooth = new BluetoothService()
