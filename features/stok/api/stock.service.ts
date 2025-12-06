import { supabase } from "@/lib/config/supabase"
import type { Database } from "@/lib/types/supabase-types"
import type { PostgrestError } from "@supabase/supabase-js"

export type StockRow = Database["public"]["Tables"]["stock"]["Row"]
export type StockLogRow = Database["public"]["Tables"]["stock_logs"]["Row"]
export type StockInsert = Database["public"]["Tables"]["stock"]["Insert"]
export type StockUpdate = Database["public"]["Tables"]["stock"]["Update"]
export type StockLokasi = Database["public"]["Enums"]["lokasi_type"]

export const StockService = {
  async getAll(search?: string): Promise<{
    data: StockRow[] | null
    error: PostgrestError | null
  }> {
    const query = supabase
      .from("stock")
      .select("*")
      .order("nama", { ascending: true })

    if (search && search.trim().length) {
      const q = `%${search.trim()}%`
      query.ilike("nama", q).or(`kode.ilike.${q}`)
    }

    const { data, error } = await query
    return { data, error }
  },

  async getById(id: string): Promise<{
    data: StockRow | null
    error: PostgrestError | null
  }> {
    const { data, error } = await supabase
      .from("stock")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single()

    return { data, error }
  },

  async getLogsById(stockId: string): Promise<{
    data: StockLogRow[] | null
    error: PostgrestError | null
  }> {
    const { data, error } = await supabase
      .from("stock_logs")
      .select("*")
      .eq("stock_id", stockId)
      .order("tanggal", { ascending: false })
      .limit(200)

    return { data, error }
  },

  async getTruckStocks(
    search?: string
  ): Promise<{ data: StockRow[] | null; error: PostgrestError | null }> {
    const query = supabase
      .from("stock")
      .select("*, variasi_harga_barang(*)")
      .eq("lokasi", "TRUK")
      .order("nama", { ascending: true })

    if (search && search.trim().length) {
      const q = `%${search.trim()}%`
      query.ilike("nama", q).or(`kode.ilike.${q}`)
    }

    const { data, error } = await query
    return { data, error }
  },

  async getVariasiByStock(stockId: string): Promise<{
    data: Database["public"]["Tables"]["variasi_harga_barang"]["Row"][] | null
    error: PostgrestError | null
  }> {
    const { data, error } = await supabase
      .from("variasi_harga_barang")
      .select("*")
      .eq("stock_id", stockId)
      .order("min_qty", { ascending: true })

    return { data, error }
  },

  async getByIdWithVariations(id: string): Promise<{
    data: StockRow | null
    error: PostgrestError | null
  }> {

    const { data, error } = await supabase
      .from("stock")
      .select("*, variasi_harga_barang(*)")
      .eq("id", id)
      .maybeSingle()

    if (error) return { data: null, error }
    return { data, error }
  },

  async updateLokasi(
    id: string,
    lokasi: StockLokasi
  ): Promise<{ data: StockRow | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from("stock")
      .update({ lokasi })
      .eq("id", id)
      .select()
      .single()

    return { data, error }
  },
}
