import { supabase } from "@/lib/config/supabase"
import type { Database } from "@/lib/types/supabase-types"
import type { PostgrestError } from "@supabase/supabase-js"
import { endOfDay, startOfDay } from "date-fns"

// ----- Helpers -----
export const getDateKey = (dateISO: string): string => {
  // Extract date part before 'T' from ISO string
  // This works regardless of timezone because ISO strings are timezone-agnostic
  return dateISO.split("T")[0]
}

// ----- Types -----
export type TimPenjualanHarianRow = Database["public"]["Tables"]["tim_penjualan_harian"]["Row"]
export type TimPenjualanHarianInsert = Database["public"]["Tables"]["tim_penjualan_harian"]["Insert"]

// ----- Service -----
export const TimPenjualanService = {
  async getByDate(dateISO: string): Promise<{
    data: TimPenjualanHarianRow | null
    error: PostgrestError | null
  }> {
    const parsedDate = new Date(dateISO)
    const startOfDayDate = startOfDay(parsedDate).toISOString()
    const endOfDayDate = endOfDay(parsedDate).toISOString()

    const { data, error } = await supabase
      .from("tim_penjualan_harian")
      .select("*")
      .gte("created_at", startOfDayDate)
      .lte("created_at", endOfDayDate)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    return { data, error }
  },

  async create(payload: {
    date: string
    staffId: string
    staffName: string
    rekan: string
  }): Promise<{
    data: TimPenjualanHarianRow | null
    error: PostgrestError | null
  }> {
    const { data, error } = await supabase
      .from("tim_penjualan_harian")
      .insert({
        created_at: payload.date,
        staff_id: payload.staffId,
        staff_name: payload.staffName,
        rekan: payload.rekan,
      })
      .select()
      .single()

    return { data, error }
  },

  async update(
    id: string,
    payload: { staffId: string; staffName: string; rekan: string }
  ): Promise<{
    data: TimPenjualanHarianRow | null
    error: PostgrestError | null
  }> {
    const { data, error } = await supabase
      .from("tim_penjualan_harian")
      .update({
        staff_id: payload.staffId,
        staff_name: payload.staffName,
        rekan: payload.rekan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    return { data, error }
  },

  async delete(id: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
      .from("tim_penjualan_harian")
      .delete()
      .eq("id", id)

    return { error }
  },
}
