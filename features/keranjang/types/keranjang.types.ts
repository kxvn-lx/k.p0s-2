import type { Database } from "@/lib/types/supabase-types"

export type StockRow = Database["public"]["Tables"]["stock"]["Row"]
export type VariasiHargaRow =
  Database["public"]["Tables"]["variasi_harga_barang"]["Row"]

export type StockWithVariations = StockRow & {
  variasi_harga_barang?: VariasiHargaRow[] | null
}

export type BasketItem = {
  stock: StockRow
  qty: number
  harga_unit: number
  variasiId: string | null
}
