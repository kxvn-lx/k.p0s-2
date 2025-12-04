import type { Database } from "@/lib/types/supabase-types"

// ----- Database Types -----
export type PengeluaranKategori = Database["public"]["Enums"]["pengeluaran_kategori"]
export type PengeluaranRow = Database["public"]["Tables"]["pengeluaran"]["Row"]
export type PengeluaranInsert = Database["public"]["Tables"]["pengeluaran"]["Insert"]
export type PengeluaranDetailRow = Database["public"]["Tables"]["pengeluaran_detail"]["Row"]
export type PengeluaranDetailInsert = Database["public"]["Tables"]["pengeluaran_detail"]["Insert"]

// ----- Form Types -----
export type PengeluaranDetailItem = {
  id: string
  kategori: PengeluaranKategori
  jumlah_total: number
  keterangan: string | null
}

export type PengeluaranFormData = {
  tanggal: Date
  keterangan: string | null
  items: Record<string, PengeluaranDetailItem>
}

// ----- Constants -----
export const PENGELUARAN_KATEGORI_OPTIONS: { value: PengeluaranKategori; label: string }[] = [
  { value: "PARKIR", label: "Parkir" },
  { value: "BENSIN", label: "Bensin" },
  { value: "LAINNYA", label: "Lainnya" },
]
