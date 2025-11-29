import type { Database } from "@/lib/types/supabase-types"

// ----- Database Row Types -----
export type PenjualanRow = Database["public"]["Tables"]["penjualan"]["Row"]
export type PenjualanDetailRow = Database["public"]["Tables"]["penjualan_detail"]["Row"]

// ----- Penjualan Result (passed from pembayaran to selesai) -----
export type PenjualanResult = {
  penjualan: PenjualanRow
  details: PenjualanDetailRow[]
  payment: {
    cashReceived: number
    change: number
  }
}