import type { BasketItem } from "@/features/keranjang/types/keranjang.types"
import type { ReceiptData, ReceiptItem } from "@/features/menu/types/printer.types"

// ----- Constants -----
const DEFAULT_STORE_NAME = "TOKO ANDA"

// ----- Helpers -----
const formatDate = (date: Date): string => {
  const dd = date.getDate().toString().padStart(2, "0")
  const mm = (date.getMonth() + 1).toString().padStart(2, "0")
  return `${dd}/${mm}/${date.getFullYear()}`
}

const formatTime = (date: Date): string => {
  const hh = date.getHours().toString().padStart(2, "0")
  const mm = date.getMinutes().toString().padStart(2, "0")
  return `${hh}:${mm}`
}

// ----- Receipt Formatter -----
export function formatBasketToReceipt(
  items: Record<string, BasketItem>,
  options?: { storeName?: string; paymentMethod?: string; cashReceived?: number }
): ReceiptData {
  const now = new Date()
  const basketItems = Object.values(items)

  const receiptItems: ReceiptItem[] = basketItems.map((item) => ({
    name: item.stock.nama || "Item",
    qty: item.qty,
    price: item.harga_satuan,
    total: item.qty * item.harga_satuan,
  }))

  const subtotal = receiptItems.reduce((sum, item) => sum + item.total, 0)
  const change = options?.cashReceived !== undefined ? options.cashReceived - subtotal : undefined

  return {
    storeName: options?.storeName || DEFAULT_STORE_NAME,
    date: formatDate(now),
    time: formatTime(now),
    items: receiptItems,
    subtotal,
    total: subtotal,
    paymentMethod: options?.paymentMethod,
    cashReceived: options?.cashReceived,
    change: change !== undefined && change >= 0 ? change : undefined,
  }
}