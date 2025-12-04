import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/types/supabase-types"
import type { PostgrestError } from "@supabase/supabase-js"
import type { PengeluaranDetailItem } from "../types/pengeluaran.types"

// ----- Types -----
export type PengeluaranInsert = Database["public"]["Tables"]["pengeluaran"]["Insert"]
export type PengeluaranDetailInsert = Database["public"]["Tables"]["pengeluaran_detail"]["Insert"]
export type PengeluaranRow = Database["public"]["Tables"]["pengeluaran"]["Row"]
export type PengeluaranDetailRow = Database["public"]["Tables"]["pengeluaran_detail"]["Row"]

export type CreatePengeluaranPayload = {
  staffId: string
  staffName: string
  tanggal: string
  keterangan: string | null
  items: PengeluaranDetailItem[]
}

export type CreatePengeluaranResult = {
  pengeluaran: PengeluaranRow
  details: PengeluaranDetailRow[]
}

export type ProgressStep = {
  step: "validating" | "pengeluaran" | "details" | "completed" | "failed"
  message: string
  current?: number
  total?: number
}

export type ProgressCallback = (progress: ProgressStep) => void

type ServiceResult<T> = { data: T; error: null } | { data: null; error: PostgrestError | Error }

// ----- Service -----
export const PengeluaranService = {
  async create(
    payload: CreatePengeluaranPayload,
    onProgress?: ProgressCallback
  ): Promise<ServiceResult<CreatePengeluaranResult>> {
    const { staffId, staffName, tanggal, keterangan, items } = payload

    try {
      // ----- Validation -----
      onProgress?.({ step: "validating", message: "VALIDASI DATA..." })

      const validItems = items.filter((item) => item.jumlah_total > 0)

      if (validItems.length === 0) {
        return { data: null, error: new Error("ND ADA PENGELUARAN VALID") }
      }

      const jumlahTotal = validItems.reduce((sum, item) => sum + item.jumlah_total, 0)

      // ----- Insert Pengeluaran Header -----
      onProgress?.({ step: "pengeluaran", message: "BASIMPAN PENGELUARAN..." })

      const pengeluaranData: PengeluaranInsert = {
        staff_id: staffId,
        staff_name: staffName,
        jumlah_total: jumlahTotal,
        tanggal,
        keterangan,
      }

      const { data: pengeluaranRow, error: pengeluaranError } = await supabase
        .from("pengeluaran")
        .insert(pengeluaranData)
        .select()
        .single()

      if (pengeluaranError || !pengeluaranRow) {
        return { data: null, error: pengeluaranError || new Error("GAGAL BASIMPAN PENGELUARAN") }
      }

      const pengeluaranId = pengeluaranRow.id

      // ----- Insert Details -----
      onProgress?.({
        step: "details",
        message: "BASIMPAN DETAIL PENGELUARAN...",
        current: 0,
        total: validItems.length,
      })

      const detailsData: PengeluaranDetailInsert[] = validItems.map((item) => ({
        pengeluaran_id: pengeluaranId,
        kategori: item.kategori,
        jumlah_total: item.jumlah_total,
        keterangan: item.keterangan,
      }))

      const { data: detailRows, error: detailsError } = await supabase
        .from("pengeluaran_detail")
        .insert(detailsData)
        .select()

      if (detailsError || !detailRows) {
        // Rollback: delete pengeluaran header
        await supabase.from("pengeluaran").delete().eq("id", pengeluaranId)
        return { data: null, error: detailsError || new Error("GAGAL BASIMPAN DETAIL") }
      }

      onProgress?.({
        step: "details",
        message: "DETAIL TASIMPAN",
        current: validItems.length,
        total: validItems.length,
      })

      // ----- Completed -----
      onProgress?.({ step: "completed", message: "PENGELUARAN BERHASIL DISIMPAN" })

      return {
        data: {
          pengeluaran: pengeluaranRow,
          details: detailRows,
        },
        error: null,
      }
    } catch (err) {
      onProgress?.({
        step: "failed",
        message: err instanceof Error ? err.message : "KESALAHAN SISTEM",
      })
      return {
        data: null,
        error: err instanceof Error ? err : new Error("KESALAHAN SISTEM"),
      }
    }
  },
}
