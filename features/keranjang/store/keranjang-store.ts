import { create } from "zustand"
import type {
  StockRow,
  BasketItem,
} from "@/features/keranjang/types/keranjang.types"

export type KeranjangState = {
  items: Record<string, BasketItem>
  addItem: (
    stock: StockRow,
    qty?: number,
    variasiId?: string | null,
    hargaUnit?: number
  ) => void
  setQty: (
    stockId: string,
    qty: number,
    hargaUnit?: number,
    variasiId?: string | null
  ) => void
  remove: (stockId: string) => void
  reset: () => void
  totalQty: () => number
  types: () => number
}

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

export const useKeranjangStore = create<KeranjangState>()((set, get) => ({
  items: {},

  addItem(
    stock: StockRow,
    qty = 1,
    variasiId: string | null = null,
    hargaUnit?: number
  ) {
    if (qty === 0) return

    set((s) => {
      const existing = s.items[stock.id]
      const currentQty = existing ? existing.qty : 0
      const newQty = currentQty + qty

      // If new quantity is 0 or less, remove the item
      if (newQty <= 0) {
        if (!existing) return s // Nothing to remove
        const copy = { ...s.items }
        delete copy[stock.id]
        const nextState = { items: copy }
        logBasket(nextState.items, "ADD_ITEM (REMOVE)")
        return nextState
      }

      const nextState = {
        items: {
          ...s.items,
          [stock.id]: {
            stock,
            qty: newQty,
            harga_jual:
              hargaUnit ?? existing?.harga_jual ?? stock.harga_jual ?? 0,
            variasi_harga_id: variasiId ?? existing?.variasi_harga_id ?? null,
          },
        },
      }

      logBasket(nextState.items, "ADD_ITEM")
      return nextState
    })
  },

  setQty(
    stockId: string,
    qty: number,
    hargaUnit?: number,
    variasi_harga_id?: string | null
  ) {
    if (qty < 0) return

    set((s) => {
      const existing = s.items[stockId]
      if (!existing) return s

      if (qty === 0) {
        const copy = { ...s.items }
        delete copy[stockId]
        const nextState = { items: copy }
        logBasket(nextState.items, "SET_QTY (REMOVE)")
        return nextState
      }

      const nextState = {
        items: {
          ...s.items,
          [stockId]: {
            ...existing,
            qty,
            harga_jual: hargaUnit ?? existing.harga_jual,
            variasi_harga_id:
              variasi_harga_id !== undefined
                ? (variasi_harga_id ?? null)
                : existing.variasi_harga_id,
          },
        },
      }

      logBasket(nextState.items, "SET_QTY")
      return nextState
    })
  },

  remove(stockId: string) {
    set((s) => {
      const copy = { ...s.items }
      delete copy[stockId]

      const nextState = { items: copy }
      logBasket(nextState.items, "REMOVE")
      return nextState
    })
  },

  reset() {
    set(() => {
      const nextState = { items: {} }
      logBasket(nextState.items, "RESET")
      return nextState
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
