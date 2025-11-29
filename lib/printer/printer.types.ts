// ----- Device -----
export type BluetoothDevice = {
  id: string
  name: string
  address: string
}

// ----- Receipt -----
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

// ----- Print Command Types -----
export type Alignment = "left" | "center" | "right"
export type TextSize = "normal" | "wide" | "tall" | "large"

export type PrintCommand =
  | { type: "text"; content: string; align: Alignment; bold: boolean; size: TextSize }
  | { type: "line"; char: string }
  | { type: "row"; left: string; right: string }
  | { type: "feed"; lines: number }
  | { type: "blank" }