import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/types/supabase-types"
import type { PostgrestError } from "@supabase/supabase-js"

export type PenjualanRow = Database["public"]["Tables"]["penjualan"]["Row"]
export type PembelianRow = Database["public"]["Tables"]["pembelian"]["Row"]
export type PengeluaranRow = Database["public"]["Tables"]["pengeluaran"]["Row"]
export type PenjualanDetailRow =
  Database["public"]["Tables"]["penjualan_detail"]["Row"]
export type PembelianDetailRow =
  Database["public"]["Tables"]["pembelian_detail"]["Row"]
export type PengeluaranDetailRow =
  Database["public"]["Tables"]["pengeluaran_detail"]["Row"]

export const RingkasanService = {
  async getPenjualan(
    startDate: string,
    endDate: string
  ): Promise<{
    data: (PenjualanRow & { penjualan_detail: PenjualanDetailRow[] })[] | null
    error: PostgrestError | null
  }> {
    const { data, error } = await supabase
      .from("penjualan")
      .select(`
        *,
        penjualan_detail (*)
      `)
      .gte("tanggal", startDate)
      .lte("tanggal", endDate)
      .order("tanggal", { ascending: false })

    return { data, error }
  },

  async getPembelian(
    startDate: string,
    endDate: string
  ): Promise<{
    data: (PembelianRow & { pembelian_detail: PembelianDetailRow[] })[] | null
    error: PostgrestError | null
  }> {
    const { data, error } = await supabase
      .from("pembelian")
      .select(`
        *,
        pembelian_detail (*)
      `)
      .gte("tanggal", startDate)
      .lte("tanggal", endDate)
      .order("tanggal", { ascending: false })

    return { data, error }
  },

  async getPengeluaran(
    startDate: string,
    endDate: string
  ): Promise<{
    data: (PengeluaranRow & { pengeluaran_detail: PengeluaranDetailRow[] })[] | null
    error: PostgrestError | null
  }> {
    const { data, error } = await supabase
      .from("pengeluaran")
      .select(`
        *,
        pengeluaran_detail (*)
      `)
      .gte("tanggal", startDate)
      .lte("tanggal", endDate)
      .order("tanggal", { ascending: false })

    return { data, error }
  },

  async getPenjualanDetail(id: string): Promise<{
    data: { header: PenjualanRow; details: PenjualanDetailRow[] } | null
    error: PostgrestError | null
  }> {
    const { data: header, error: headerError } = await supabase
      .from("penjualan")
      .select("*")
      .eq("id", id)
      .single()

    if (headerError) return { data: null, error: headerError }

    const { data: details, error: detailsError } = await supabase
      .from("penjualan_detail")
      .select("*")
      .eq("penjualan_id", id)

    if (detailsError) return { data: null, error: detailsError }

    return { data: { header, details: details || [] }, error: null }
  },

  async getPembelianDetail(id: string): Promise<{
    data: { header: PembelianRow; details: PembelianDetailRow[] } | null
    error: PostgrestError | null
  }> {
    const { data: header, error: headerError } = await supabase
      .from("pembelian")
      .select("*")
      .eq("id", id)
      .single()

    if (headerError) return { data: null, error: headerError }

    const { data: details, error: detailsError } = await supabase
      .from("pembelian_detail")
      .select("*")
      .eq("pembelian_id", id)

    if (detailsError) return { data: null, error: detailsError }

    return { data: { header, details: details || [] }, error: null }
  },

  async getPengeluaranDetail(id: string): Promise<{
    data: { header: PengeluaranRow; details: PengeluaranDetailRow[] } | null
    error: PostgrestError | null
  }> {
    const { data: header, error: headerError } = await supabase
      .from("pengeluaran")
      .select("*")
      .eq("id", id)
      .single()

    if (headerError) return { data: null, error: headerError }

    const { data: details, error: detailsError } = await supabase
      .from("pengeluaran_detail")
      .select("*")
      .eq("pengeluaran_id", id)

    if (detailsError) return { data: null, error: detailsError }

    return { data: { header, details: details || [] }, error: null }
  },
}
