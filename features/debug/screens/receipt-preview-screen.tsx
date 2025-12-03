import { View, ScrollView } from "react-native"
import { ReceiptPreview } from "@/components/shared/receipt-preview"
import type { PenjualanResult } from "@/features/keranjang/types/penjualan-result.types"

// Dummy data for preview
const DUMMY_RESULT: PenjualanResult = {
  penjualan: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tanggal: new Date().toISOString(),
    staff_id: "user-123",
    staff_name: "Kevin Laminto",
    jumlah_total: 150000,
    keterangan: "Test transaction",
  },
  details: [
    {
      id: "detail-1",
      penjualan_id: "550e8400-e29b-41d4-a716-446655440000",
      stock_id: "stock-1",
      nama: "Ayam Goreng Spesial",
      qty: 2,
      harga_jual: 25000,
      jumlah_total: 50000,
      satuan_utama: "Porsi",
      variasi: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "detail-2",
      penjualan_id: "550e8400-e29b-41d4-a716-446655440000",
      stock_id: "stock-2",
      nama: "Nasi Putih",
      qty: 2,
      harga_jual: 5000,
      jumlah_total: 10000,
      satuan_utama: "Piring",
      variasi: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "detail-3",
      penjualan_id: "550e8400-e29b-41d4-a716-446655440000",
      stock_id: "stock-3",
      nama: "Es Teh Manis",
      qty: 2,
      harga_jual: 5000,
      jumlah_total: 10000,
      satuan_utama: "Gelas",
      variasi: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "detail-4",
      penjualan_id: "550e8400-e29b-41d4-a716-446655440000",
      stock_id: "stock-4",
      nama: "Kerupuk Udang (Long Name Test to see wrapping)",
      qty: 5,
      harga_jual: 2000,
      jumlah_total: 10000,
      satuan_utama: "Bks",
      variasi: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  payment: {
    cashReceived: 100000,
    change: 20000,
  },
}

export default function ReceiptPreviewScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow">
        <ReceiptPreview result={DUMMY_RESULT} />
      </ScrollView>
    </View>
  )
}
