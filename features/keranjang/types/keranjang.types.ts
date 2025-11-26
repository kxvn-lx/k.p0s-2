import type { Database } from "@/lib/types/supabase-types"

export type StockRow = Database["public"]["Tables"]["stock"]["Row"]
export type VariasiHargaRow =
  Database["public"]["Tables"]["variasi_harga_barang"]["Row"]

export type StockWithVariations = StockRow & {
  variasi_harga_barang?: VariasiHargaRow[] | null
}

/**
 * BasketItem represents an item in the shopping basket.
 * It contains the stock reference, quantity, price at time of selection,
 * and optional variation reference with minimum quantity constraint.
 */
export type BasketItem = {
  stock: StockRow
  qty: number
  harga_jual: number
  variasi_harga_id: string | null
  min_qty: number
}
