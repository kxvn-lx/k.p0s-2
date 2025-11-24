// ----- Keranjang zustand store -----
import { create } from 'zustand'
import type { StockRow } from '@/features/stok/api/stock.service'

export type BasketItem = {
  stock: StockRow
  qty: number
  harga_unit: number
  variasiId?: string | null
}

export type KeranjangState = {
  items: Record<string, BasketItem>
  addItem: (stock: StockRow, qty?: number, variasiId?: string | null, hargaUnit?: number) => void
  increment: (stockId: string, step?: number) => void
  decrement: (stockId: string, step?: number) => void
  setQty: (stockId: string, qty: number, harga_unit?: number, variasiId?: string | null) => void
  remove: (stockId: string) => void
  reset: () => void
  totalQty: () => number
  types: () => number
}

export const useKeranjangStore = create<KeranjangState>()((set, get) => ({
  items: {},

  addItem(stock: StockRow, qty = 1, variasiId: string | null = null, hargaUnit?: number) {
    set((s) => {
      const existing = s.items[stock.id]
      const newQty = existing ? existing.qty + qty : qty
      return {
        items: {
          ...s.items,
          [stock.id]: {
            stock,
            qty: newQty,
            harga_unit: hargaUnit ?? existing?.harga_unit ?? stock.harga_jual ?? 0,
            variasiId: variasiId ?? existing?.variasiId ?? null,
          },
        },
      }
    })
  },

  increment(stockId: string, step = 1) {
    set((s) => {
      const existing = s.items[stockId]
      if (!existing) return s
      return { items: { ...s.items, [stockId]: { ...existing, qty: existing.qty + step } } }
    })
  },

  decrement(stockId: string, step = 1) {
    set((s) => {
      const existing = s.items[stockId]
      if (!existing) return s
      const newQty = existing.qty - step
      const copy = { ...s.items }
      if (newQty <= 0) delete copy[stockId]
      else copy[stockId] = { ...existing, qty: newQty }
      return { items: copy }
    })
  },

  setQty(stockId: string, qty: number, harga_unit: number | undefined = undefined, variasiId: string | null | undefined = undefined) {
    set((s) => {
      const existing = s.items[stockId]
      if (!existing) return s
      return {
        items: {
          ...s.items,
          [stockId]: {
            ...existing,
            qty,
            harga_unit: harga_unit ?? existing.harga_unit,
            variasiId: variedadesOf(variasiId, existing.variasiId),
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
    return Object.values(get().items).reduce((s, i: BasketItem) => s + i.qty, 0)
  },

  types() {
    return Object.keys(get().items).length
  },
}))

function variedadesOf(next: string | null | undefined, prev: string | null | undefined) {
  if (next === undefined) return prev ?? null
  return next ?? null
}

export default useKeranjangStore
