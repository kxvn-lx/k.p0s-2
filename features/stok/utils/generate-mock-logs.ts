import type { StockLogRow, StockRow } from "../api/stock.service"

const MOVEMENT_TYPES = [
  "PEMBELIAN",
  "PENJUALAN",
  "MANUAL_MASUK",
  "MANUAL_KELUAR",
] as const
const STAFF_POOL = [
  { id: "stf1", name: "Andi" },
  { id: "stf2", name: "Budi" },
  { id: "stf3", name: "Cici" },
  { id: "stf4", name: "Dewi" },
  { id: "stf5", name: "Erik" },
  { id: "stf6", name: "Fajar" },
  { id: "stf7", name: "Gita" },
  { id: "stf8", name: "Hadi" },
  { id: "stf9", name: "Ika" },
]

const DESCRIPTIONS = {
  PEMBELIAN: [
    "Restock supplier",
    "Topup stok",
    "Replenish",
    "Pengiriman drop ship",
    "Suplemen stok",
  ],
  PENJUALAN: [
    "Penjualan counter",
    "Penjualan online",
    "POS sale",
    "Retail sale",
    "Bulk sale",
    "Event sale",
    "Promo weekend",
  ],
  MANUAL_MASUK: [
    "Koreksi inventori",
    "Adjust stock",
    "Tally correction",
    "Small correction",
  ],
  MANUAL_KELUAR: ["Sample keluar", "Sample for QA"],
}

export function generateMockLogs(count: number, stock: StockRow): StockLogRow[] {
  const logs: StockLogRow[] = []
  let runningStock = stock.jumlah_stok ?? 50
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const daysAgo = i
    const hoursOffset = Math.floor(Math.random() * 24)
    const minutesOffset = Math.floor(Math.random() * 60)
    const timestamp = new Date(
      now.getTime() -
        daysAgo * 24 * 60 * 60 * 1000 -
        hoursOffset * 60 * 60 * 1000 -
        minutesOffset * 60 * 1000
    )

    const movementType =
      MOVEMENT_TYPES[Math.floor(Math.random() * MOVEMENT_TYPES.length)]
    const staff = STAFF_POOL[Math.floor(Math.random() * STAFF_POOL.length)]
    const descriptions = DESCRIPTIONS[movementType]
    const description =
      descriptions[Math.floor(Math.random() * descriptions.length)]

    let masuk = 0
    let keluar = 0
    let referenceId = null
    let referenceTable = null

    if (movementType === "PEMBELIAN") {
      masuk = Math.floor(Math.random() * 100) + 10
      referenceId = `pemb-${i + 1}`
      referenceTable = "pembelian"
    } else if (movementType === "PENJUALAN") {
      keluar = Math.floor(Math.random() * 30) + 1
      referenceId = `penj-${i + 1}`
      referenceTable = "penjualan"
    } else if (movementType === "MANUAL_MASUK") {
      masuk = Math.floor(Math.random() * 25) + 1
    } else {
      keluar = Math.floor(Math.random() * 10) + 1
    }

    const previousStock = runningStock
    runningStock =
      movementType === "PEMBELIAN" || movementType === "MANUAL_MASUK"
        ? runningStock - masuk
        : runningStock + keluar

    logs.push({
      id: `mock-log-${i + 1}`,
      kode_stock: stock.kode,
      nama_stock: stock.nama,
      tanggal: timestamp.toISOString().slice(0, 16).replace("T", " "),
      tipe_pergerakan: movementType,
      masuk,
      keluar,
      stok_akhir: previousStock,
      keterangan: description,
      reference_id: referenceId,
      reference_table: referenceTable,
      staff_id: staff.id,
      staff_name: staff.name,
      created_at: timestamp.toISOString(),
    })
  }

  return logs
}
