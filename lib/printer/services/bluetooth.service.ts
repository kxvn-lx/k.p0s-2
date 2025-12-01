import { DeviceEventEmitter, Platform } from "react-native"
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  PAGE_WIDTH,
} from "lx-react-native-bluetooth-printer"
import type {
  BluetoothDevice,
  ConnectionState,
  PrinterError,
  PrinterErrorInfo,
  PrinterConfig,
} from "../printer.types"

const CONNECTION_TIMEOUT_MS = 2500
const DEFAULT_CHARACTER_PER_LINE = 32

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

type Listener<T extends BluetoothEventType> = (
  payload: BluetoothEventPayload[T]
) => void
type ListenerMap = Map<
  string,
  { type: BluetoothEventType; listener: Listener<BluetoothEventType> }
>

class BluetoothService {
  private listeners: ListenerMap = new Map()
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
    this.listeners.clear()
    this.isInitialized = false
  }

  private setupEventListeners(): void {
    const nativeManager = BluetoothManager as unknown as Record<string, string>

    const events = [
      {
        event: nativeManager.EVENT_DEVICE_FOUND || "EVENT_DEVICE_FOUND",
        handler: (data: { device: string }) => {
          const device = this.parseDevice(data.device)
          if (device) this.emit("DEVICE_FOUND", device)
        },
      },
      {
        event:
          nativeManager.EVENT_DEVICE_ALREADY_PAIRED ||
          "EVENT_DEVICE_ALREADY_PAIRED",
        handler: (data: { devices: string }) => {
          const devices = this.parseDevices(data.devices)
          this.emit("DEVICE_PAIRED", devices)
        },
      },
      {
        event:
          nativeManager.EVENT_DEVICE_DISCOVER_DONE ||
          "EVENT_DEVICE_DISCOVER_DONE",
        handler: () => this.emit("SCAN_DONE", undefined),
      },
      {
        event: nativeManager.EVENT_CONNECTED || "EVENT_CONNECTED",
        handler: () => {
          if (this.connectedDevice) {
            this.setConnectionState("connected")
            this.emit("CONNECTED", this.connectedDevice)
          }
        },
      },
      {
        event: nativeManager.EVENT_CONNECTION_LOST || "EVENT_CONNECTION_LOST",
        handler: () => {
          this.setConnectionState("disconnected")
          this.connectedDevice = null
          this.emit("CONNECTION_LOST", undefined)
        },
      },
      {
        event: nativeManager.EVENT_UNABLE_CONNECT || "EVENT_UNABLE_CONNECT",
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

      const result = await BluetoothManager.scanDevices()

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

  async disconnect(): Promise<void> {
    if (!this.connectedDevice) return

    try {
      await BluetoothManager.disconnect(this.connectedDevice.address)
    } catch {
      // Ignore disconnect errors
    } finally {
      this.setConnectionState("disconnected")
      this.connectedDevice = null
      this.emit("DISCONNECTED", undefined)
    }
  }

  async unpair(address: string): Promise<void> {
    try {
      // Disconnect if currently connected to the target device
      if (this.connectedDevice?.address === address) {
        await this.disconnect()
      }

      const manager = BluetoothManager as unknown as typeof BluetoothManager & {
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

  async initPrinter(): Promise<void> {
    await BluetoothEscposPrinter.printerInit()
    await BluetoothEscposPrinter.setWidth(this.config.deviceWidth)
    // Don't automatically set alignment here - let individual print operations control it
  }

  /**
   * Set alignment for subsequent print operations
   */
  async setAlignment(alignment: number): Promise<void> {
    await BluetoothEscposPrinter.printerAlign(alignment)
  }

  /**
   * Set left alignment (0)
   */
  async setLeftAlignment(): Promise<void> {
    await BluetoothEscposPrinter.printerAlign(0)
  }

  /**
   * Set center alignment (1)
   */
  async setCenterAlignment(): Promise<void> {
    await BluetoothEscposPrinter.printerAlign(1)
  }

  /**
   * Set right alignment (2)
   */
  async setRightAlignment(): Promise<void> {
    await BluetoothEscposPrinter.printerAlign(2)
  }

  async printText(
    text: string,
    options?: {
      bold?: boolean
      widthMultiplier?: number
      heightMultiplier?: number
    }
  ): Promise<void> {
    if (options?.bold) {
      try {
        await BluetoothEscposPrinter.setBold(1)
      } catch (error) {
        console.warn("setBold failed:", error)
      }
    }

    await BluetoothEscposPrinter.printText(text + "\n", {
      encoding: this.config.encoding,
      widthtimes: options?.widthMultiplier ?? 0,
      heigthtimes: options?.heightMultiplier ?? 0,
    })

    if (options?.bold) {
      try {
        await BluetoothEscposPrinter.setBold(0)
      } catch (error) {
        console.warn("setBold reset failed:", error)
      }
    }
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
    const line = char.repeat(DEFAULT_CHARACTER_PER_LINE)
    await BluetoothEscposPrinter.printText(line + "\n", {
      encoding: this.config.encoding,
    })
  }

  async printBlank(): Promise<void> {
    await BluetoothEscposPrinter.printText("\n", {})
  }

  async feed(lines = 1): Promise<void> {
    const feedText = "\n".repeat(lines)
    await BluetoothEscposPrinter.printText(feedText, {
      encoding: this.config.encoding,
    })
  }

  async cut(): Promise<void> {
    console.warn(
      "Cut functionality not available in lx-react-native-bluetooth-printer"
    )
  }

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

  setConfig(config: Partial<PrinterConfig>): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): PrinterConfig {
    return { ...this.config }
  }
}

export const bluetooth = new BluetoothService()
