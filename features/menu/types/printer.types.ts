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