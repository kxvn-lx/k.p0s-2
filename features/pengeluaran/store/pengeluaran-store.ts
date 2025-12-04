import { create } from "zustand"
import type { PengeluaranDetailItem, PengeluaranKategori } from "../types/pengeluaran.types"

// ----- Types -----
export type PengeluaranState = {
  tanggal: Date
  keterangan: string
  items: Record<string, PengeluaranDetailItem>
}

type PengeluaranActions = {
  setTanggal: (date: Date) => void
  setKeterangan: (keterangan: string) => void
  addItem: (kategori: PengeluaranKategori, jumlah: number, keterangan: string | null) => void
  updateItem: (id: string, updates: Partial<Omit<PengeluaranDetailItem, "id">>) => void
  removeItem: (id: string) => void
  reset: () => void
}

// ----- Initial State -----
const initialState: PengeluaranState = {
  tanggal: new Date(),
  keterangan: "",
  items: {},
}

// ----- Store -----
const usePengeluaranStore = create<PengeluaranState & PengeluaranActions>((set) => ({
  ...initialState,

  setTanggal: (date) => set({ tanggal: date }),

  setKeterangan: (keterangan) => set({ keterangan }),

  addItem: (kategori, jumlah, keterangan) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    set((state) => ({
      items: {
        ...state.items,
        [id]: {
          id,
          kategori,
          jumlah_total: jumlah,
          keterangan: keterangan ?? null,
        },
      },
    }))
  },

  updateItem: (id, updates) =>
    set((state) => {
      if (!state.items[id]) return state
      return {
        items: {
          ...state.items,
          [id]: { ...state.items[id], ...updates },
        },
      }
    }),

  removeItem: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.items
      return { items: rest }
    }),

  reset: () => set(initialState),
}))

export default usePengeluaranStore
