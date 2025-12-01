// Device
export type BluetoothDevice = {
  name: string
  address: string
}

// Connection State
export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"

export type PrinterError =
  | "BLUETOOTH_DISABLED"
  | "PERMISSION_DENIED"
  | "DEVICE_NOT_FOUND"
  | "CONNECTION_FAILED"
  | "CONNECTION_LOST"
  | "PRINT_FAILED"
  | "SCAN_FAILED"
  | "UNPAIR_FAILED"
  | "UNKNOWN"

export type PrinterErrorInfo = {
  code: PrinterError
  message: string
  originalError?: unknown
}

// Receipt
export type ReceiptItem = {
  name: string
  qty: number
  price: number
  total: number
}

export type ReceiptData = {
  storeName: string
  date: string
  time: string
  items: ReceiptItem[]
  subtotal: number
  total: number
  paymentMethod?: string
  cashReceived?: number
  change?: number
}

// Print command types
export type Alignment = "left" | "center" | "right"
export type TextSize = "normal" | "wide" | "tall" | "large" | "xlarge"

export type PrintCommand =
  | {
    type: "text"
    content: string
    align: Alignment
    bold: boolean
    size: TextSize
  }
  | { type: "line"; char: string }
  | { type: "row"; left: string; right: string }
  | { type: "feed"; lines: number }
  | { type: "blank" }

// Printer config
export type PrinterConfig = {
  deviceWidth: 384 | 576 // 58mm = 384, 80mm = 576
  encoding: "UTF-8" | "GBK"
  characterPerLine: 32 | 48 // 58mm = 32, 80mm = 48
}

export const DEFAULT_PRINTER_CONFIG: PrinterConfig = {
  deviceWidth: 384,
  encoding: "UTF-8",
  characterPerLine: 32,
}
