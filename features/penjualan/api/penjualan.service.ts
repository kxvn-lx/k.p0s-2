import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/types/supabase-types"
import type { BasketItem } from "@/features/keranjang/types/keranjang.types"
import type { PostgrestError } from "@supabase/supabase-js"

// ----- TYPES -----
export type PenjualanInsert = Database["public"]["Tables"]["penjualan"]["Insert"]
export type PenjualanDetailInsert = Database["public"]["Tables"]["penjualan_detail"]["Insert"]
export type StockLogInsert = Database["public"]["Tables"]["stock_logs"]["Insert"]
export type PenjualanRow = Database["public"]["Tables"]["penjualan"]["Row"]
export type PenjualanDetailRow = Database["public"]["Tables"]["penjualan_detail"]["Row"]

export type CreatePenjualanPayload = {
  staffId: string
  staffName: string
  items: Record<string, BasketItem>
  cashReceived: number
  tanggal: string
  keterangan?: string | null
}

export type CreatePenjualanResult = {
  penjualan: PenjualanRow
  details: PenjualanDetailRow[]
  payment: { cashReceived: number; change: number }
}

export type ProgressStep = {
  step:
  | "validating"
  | "penjualan"
  | "barang-penjualan"
  | "stock"
  | "audit"
  | "completed"
  | "failed"
  message: string
  current?: number
  total?: number
}

export type ProgressCallback = (progress: ProgressStep) => void

type ServiceResult<T> = { data: T; error: null } | { data: null; error: PostgrestError | Error }

// ----- SERVICE -----
export const PenjualanService = {
  async create(
    payload: CreatePenjualanPayload,
    onProgress?: ProgressCallback
  ): Promise<ServiceResult<CreatePenjualanResult>> {
    const { staffId, staffName, items, cashReceived, tanggal, keterangan } = payload
    const itemsArray = Object.values(items)

    try {
      // ----- VALIDATION -----
      onProgress?.({ step: "validating", message: "VALIDASI DATA..." })

      if (itemsArray.length === 0) {
        return { data: null, error: new Error("KERANJANG KOSONG") }
      }

      const jumlahTotal = itemsArray.reduce(
        (sum, item) => sum + item.qty * item.harga_satuan,
        0
      )

      if (cashReceived < jumlahTotal) {
        return {
          data: null,
          error: new Error(`PEMBAYARAN KURANG (Rp ${jumlahTotal.toLocaleString()})`),
        }
      }

      // ----- STOCK VALIDATION -----
      onProgress?.({ step: "validating", message: "PERIKSA STOK ADA ATO ND..." })

      const stockIds = itemsArray.map((item) => item.stock.id)
      const { data: currentStocks, error: stockFetchError } = await supabase
        .from("stock")
        .select("id, jumlah_stok, nama")
        .in("id", stockIds)

      if (stockFetchError) return { data: null, error: stockFetchError }

      if (!currentStocks || currentStocks.length !== itemsArray.length) {
        return { data: null, error: new Error("BBRAPA STOK ND ADA") }
      }

      const stockMap = new Map<string, { id: string; jumlah_stok: number; nama: string }>(
        (currentStocks as Array<{ id: string; jumlah_stok: number; nama: string }>).map((s) => [s.id, s])
      )

      const validationErrors: string[] = []
      for (const item of itemsArray) {
        const current = stockMap.get(item.stock.id)
        if (!current) {
          validationErrors.push(`"${item.stock.nama}" ND DAPA DI DATABASE`)
        } else if (current.jumlah_stok < item.qty) {
          validationErrors.push(`"${item.stock.nama}": STOK ${current.jumlah_stok}, DIMINTA ${item.qty}`)
        }
      }

      if (validationErrors.length > 0) {
        return { data: null, error: new Error(validationErrors.join("\n")) }
      }

      // ----- INSERT PENJUALAN -----
      onProgress?.({ step: "penjualan", message: "BASIMPAN TRANSAKSI..." })

      const penjualanData: PenjualanInsert = {
        staff_id: staffId,
        staff_name: staffName,
        jumlah_total: jumlahTotal,
        tanggal,
        keterangan: keterangan ?? null,
      }

      const { data: penjualanRow, error: penjualanError } = await supabase
        .from("penjualan")
        .insert(penjualanData)
        .select()
        .single()

      if (penjualanError || !penjualanRow) {
        return { data: null, error: penjualanError || new Error("GAGAL BASIMPAN penjualan") }
      }

      const penjualanId = penjualanRow.id

      // ----- INSERT DETAILS -----
      onProgress?.({
        step: "barang-penjualan",
        message: "BASIMPAN BARANG PENJUALAN...",
        current: 0,
        total: itemsArray.length,
      })

      const detailsData: PenjualanDetailInsert[] = itemsArray.map((item) => ({
        penjualan_id: penjualanId,
        stock_id: item.stock.id,
        nama: item.stock.nama,
        qty: item.qty,
        harga_jual: item.harga_satuan,
        jumlah_total: item.qty * item.harga_satuan,
        satuan_utama: item.stock.satuan_utama,
        variasi: item.variasi_harga_id
          ? { variasi_harga_id: item.variasi_harga_id, min_qty: item.min_qty }
          : null,
      }))

      const { data: detailRows, error: detailsError } = await supabase
        .from("penjualan_detail")
        .insert(detailsData)
        .select()

      if (detailsError || !detailRows) {
        await supabase.from("penjualan").delete().eq("id", penjualanId)
        return { data: null, error: detailsError || new Error("GAGAL BASIMPAN STOK KE PENJUALAN") }
      }

      onProgress?.({
        step: "barang-penjualan",
        message: "BARANG PENJUALAN TERSIMPAN",
        current: itemsArray.length,
        total: itemsArray.length,
      })

      // ----- UPDATE STOCK -----
      const stockUpdateErrors: string[] = []
      for (let i = 0; i < itemsArray.length; i++) {
        const item = itemsArray[i]
        const current = stockMap.get(item.stock.id)!
        const newQty = current.jumlah_stok - item.qty

        onProgress?.({
          step: "stock",
          message: `GANTI JMLH QTY STOK: "${item.stock.nama}"...`,
          current: i + 1,
          total: itemsArray.length,
        })

        const { error: updateError } = await supabase
          .from("stock")
          .update({ jumlah_stok: newQty, updated_at: new Date().toISOString() })
          .eq("id", item.stock.id)

        if (updateError) {
          stockUpdateErrors.push(`${item.stock.nama}: ${updateError.message}`)
        }
      }

      if (stockUpdateErrors.length > 0) {
        await supabase.from("penjualan_detail").delete().eq("penjualan_id", penjualanId)
        await supabase.from("penjualan").delete().eq("id", penjualanId)
        return { data: null, error: new Error(`GAGAL MENGGANTI JMLH QTY STOK :\n${stockUpdateErrors.join("\n")}`) }
      }

      // ----- INSERT AUDIT LOGS -----
      onProgress?.({
        step: "audit",
        message: "MENCATAT RIWAYAT PERGERAKAN STOK...",
        current: 0,
        total: itemsArray.length,
      })

      const stockLogsData: StockLogInsert[] = itemsArray.map((item) => {
        const current = stockMap.get(item.stock.id)!
        return {
          stock_id: item.stock.id,
          nama_stock: item.stock.nama,
          tanggal,
          keluar: item.qty,
          masuk: 0,
          stok_akhir: current.jumlah_stok - item.qty,
          tipe_pergerakan: "PENJUALAN" as const,
          reference_id: penjualanId,
          reference_table: "penjualan",
          staff_id: staffId,
          staff_name: staffName,
          keterangan: null,
        }
      })

      const { error: logsError } = await supabase.from("stock_logs").insert(stockLogsData)

      if (logsError) {
        console.warn("Audit log gagal (non-critical):", logsError)
      }

      onProgress?.({
        step: "audit",
        message: "PERGERAKAN STOK TA CATAT",
        current: itemsArray.length,
        total: itemsArray.length,
      })

      // ----- COMPLETED -----
      onProgress?.({ step: "completed", message: "PENJUALAN BERHASIL" })

      return {
        data: {
          penjualan: penjualanRow,
          details: detailRows,
          payment: { cashReceived, change: cashReceived - jumlahTotal },
        },
        error: null,
      }
    } catch (err) {
      onProgress?.({
        step: "failed",
        message: err instanceof Error ? err.message : "KESALAHAN SISTEM"
      })
      return {
        data: null,
        error: err instanceof Error ? err : new Error("KESALAHAN SISTEM"),
      }
    }
  },
}
