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
}

// ----- LOGGING UTILITY -----
const logBasket = (items: Record<string, BasketItem>, action: string) => {
  if (__DEV__) {
    return
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

  // ----- ACTIONS -----
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

      if (newQuantity <= 0) {
        if (!existingItem) return s
        const itemsCopy = { ...s.items }
        delete itemsCopy[stock.id]
        const updatedState = { items: itemsCopy }
        logBasket(updatedState.items, "ADD_ITEM (REMOVE)")
        return updatedState
      }

      const updatedState = {
        items: {
          ...s.items,
          [stock.id]: {
            stock,
            qty: newQuantity,
            harga_jual:
              hargaUnit ?? existingItem?.harga_jual ?? stock.harga_jual ?? 0,
            variasi_harga_id: variasiId ?? existingItem?.variasi_harga_id ?? null,
            min_qty:
              minQty ??
              existingItem?.min_qty ??
              (variasiId ? 1 : 0),
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
            harga_jual: hargaUnit ?? existingItem.harga_jual,
            variasi_harga_id:
              variasiId !== undefined
                ? (variasiId ?? null)
                : existingItem.variasi_harga_id,
            min_qty: minQty ?? existingItem.min_qty,
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
}))

export default useKeranjangStore
