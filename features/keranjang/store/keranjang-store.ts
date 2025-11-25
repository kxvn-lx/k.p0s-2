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
  increment: (stockId: string, step?: number) => void
  decrement: (stockId: string, step?: number) => void
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

export const useKeranjangStore = create<KeranjangState>()((set, get) => ({
  items: {},

  addItem(
    stock: StockRow,
    qty = 1,
    variasiId: string | null = null,
    hargaUnit?: number
  ) {
    if (qty <= 0) return

    set((s) => {
      const existing = s.items[stock.id]
      const newQty = existing ? existing.qty + qty : qty

      return {
        items: {
          ...s.items,
          [stock.id]: {
            stock,
            qty: newQty,
            harga_unit:
              hargaUnit ?? existing?.harga_unit ?? stock.harga_jual ?? 0,
            variasiId: variasiId ?? existing?.variasiId ?? null,
          },
        },
      }
    })
  },

  increment(stockId: string, step = 1) {
    if (step <= 0) return

    set((s) => {
      const existing = s.items[stockId]
      if (!existing) return s

      return {
        items: {
          ...s.items,
          [stockId]: { ...existing, qty: existing.qty + step },
        },
      }
    })
  },

  decrement(stockId: string, step = 1) {
    if (step <= 0) return

    set((s) => {
      const existing = s.items[stockId]
      if (!existing) return s

      const newQty = existing.qty - step
      const copy = { ...s.items }

      if (newQty <= 0) {
        delete copy[stockId]
      } else {
        copy[stockId] = { ...existing, qty: newQty }
      }

      return { items: copy }
    })
  },

  setQty(
    stockId: string,
    qty: number,
    hargaUnit?: number,
    variasiId?: string | null
  ) {
    if (qty < 0) return

    set((s) => {
      const existing = s.items[stockId]
      if (!existing) return s

      if (qty === 0) {
        const copy = { ...s.items }
        delete copy[stockId]
        return { items: copy }
      }

      return {
        items: {
          ...s.items,
          [stockId]: {
            ...existing,
            qty,
            harga_unit: hargaUnit ?? existing.harga_unit,
            variasiId:
              variasiId !== undefined
                ? (variasiId ?? null)
                : existing.variasiId,
          },
        },
      }
    })
  },

  remove(stockId: string) {
    set((s) => {
      const copy = { ...s.items }
      delete copy[stockId]
      return { items: copy }
    })
  },

  reset() {
    set({ items: {} })
  },

  totalQty() {
    return Object.values(get().items).reduce((sum, item) => sum + item.qty, 0)
  },

  types() {
    return Object.keys(get().items).length
  },
}))

export default useKeranjangStore
