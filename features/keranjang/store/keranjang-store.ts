// ----- IMPORTS -----
import { create } from "zustand"
import type {
  StockRow,
  BasketItem,
} from "@/features/keranjang/types/keranjang.types"

// ----- TYPES -----
export type KeranjangState = {
  items: Record<string, BasketItem>
  addItem: (
    stock: StockRow,
    qty?: number,
    variasiId?: string | null,
    hargaUnit?: number,
    minQty?: number
  ) => void
  setQty: (
    stockId: string,
    qty: number,
    hargaUnit?: number,
    variasiId?: string | null,
    minQty?: number
  ) => void
  remove: (stockId: string) => void
  reset: () => void
  totalQty: () => number
  types: () => number
  remainingFor: (stock: StockRow) => number
}

// ----- LOGGING UTILITY -----
const logBasket = (items: Record<string, BasketItem>, action: string) => {
  return
  if (__DEV__) {
    console.group(`[KERANJANG] ${action}`)
    console.log("Time:", new Date().toLocaleTimeString())
    console.log("Items Count:", Object.values(items).length)
    if (Object.values(items).length > 0) {
      console.log(items)
    } else {
      console.log("Basket is empty")
    }
    console.groupEnd()
  }
}

// ----- STORE -----
export const useKeranjangStore = create<KeranjangState>()((set, get) => ({
  // ----- INITIAL STATE -----
  items: {},

  // ----- ATOMIC ACTIONS -----
  addItem(
    stock: StockRow,
    qty = 1,
    variasiId: string | null = null,
    hargaUnit?: number,
    minQty = 0
  ) {
    if (qty === 0) return

    set((s) => {
      const existingItem = s.items[stock.id]
      const currentQuantity = existingItem ? existingItem.qty : 0
      const newQuantity = currentQuantity + qty

      // Validate stock availability atomically
      const availableStock = stock.jumlah_stok ?? 0
      if (newQuantity > availableStock) {
        return s // Abort update if would exceed stock
      }

      if (newQuantity <= 0) {
        if (!existingItem) return s
        const itemsCopy = { ...s.items }
        delete itemsCopy[stock.id]
        const updatedState = { items: itemsCopy }
        logBasket(updatedState.items, "ADD_ITEM (REMOVE)")
        return updatedState
      }

      // Determine the price being used
      const currentPrice = hargaUnit ?? existingItem?.harga_satuan ?? stock.harga_jual ?? 0

      // If this is a new item or price is changing, set the original price
      const originalPrice = existingItem?.harga_satuan_asal ?? existingItem?.harga_satuan ?? currentPrice

      const updatedState = {
        items: {
          ...s.items,
          [stock.id]: {
            stock,
            qty: newQuantity,
            harga_satuan: currentPrice,
            variasi_harga_id: variasiId ?? existingItem?.variasi_harga_id ?? null,
            min_qty: minQty ?? existingItem?.min_qty ?? (variasiId ? 1 : 0),
            harga_satuan_asal: originalPrice,
          },
        },
      }

      logBasket(updatedState.items, "ADD_ITEM")
      return updatedState
    })
  },

  setQty(
    stockId: string,
    qty: number,
    hargaUnit?: number,
    variasiId?: string | null,
    minQty?: number
  ) {
    if (qty < 0) return

    set((s) => {
      const existingItem = s.items[stockId]
      if (!existingItem) return s

      // Validate stock availability atomically
      const availableStock = existingItem.stock.jumlah_stok ?? 0
      if (qty > availableStock) {
        return s // Abort update if would exceed stock
      }

      if (qty === 0) {
        const itemsCopy = { ...s.items }
        delete itemsCopy[stockId]
        const updatedState = { items: itemsCopy }
        logBasket(updatedState.items, "SET_QTY (REMOVE)")
        return updatedState
      }

      const updatedState = {
        items: {
          ...s.items,
          [stockId]: {
            ...existingItem,
            qty,
            harga_satuan: hargaUnit ?? existingItem.harga_satuan,
            variasi_harga_id:
              variasiId !== undefined
                ? (variasiId ?? null)
                : existingItem.variasi_harga_id,
            min_qty: minQty ?? existingItem.min_qty,
            harga_satuan_asal: existingItem.harga_satuan_asal ?? existingItem.harga_satuan,
          },
        },
      }

      logBasket(updatedState.items, "SET_QTY")
      return updatedState
    })
  },

  remove(stockId: string) {
    set((s) => {
      const itemsCopy = { ...s.items }
      delete itemsCopy[stockId]

      const updatedState = { items: itemsCopy }
      logBasket(updatedState.items, "REMOVE")
      return updatedState
    })
  },

  reset() {
    set(() => {
      const updatedState = { items: {} }
      logBasket(updatedState.items, "RESET")
      return updatedState
    })
  },

  totalQty() {
    return Object.values(get().items).reduce((sum, item) => sum + item.qty, 0)
  },

  types() {
    return Object.keys(get().items).length
  },

  remainingFor(stock: StockRow) {
    const quantityInCart = get().items[stock.id]?.qty ?? 0
    const totalStock = stock.jumlah_stok ?? 0
    return Math.max(0, totalStock - quantityInCart)
  },
}))

export default useKeranjangStore
