import type { ProgressStep } from "@/features/penjualan/api/penjualan.service"

export async function simulateProgressFlow(
  onProgress: (step: ProgressStep) => void,
  delayMs = 1000
): Promise<void> {
  const steps: ProgressStep[] = [
    { step: "validating", message: "MEMULAI..." },
    { step: "validating", message: "VALIDASI DATA..." },
    { step: "validating", message: "PERIKSA STOK ADA ATO ND..." },
    { step: "penjualan", message: "BASIMPAN TRANSAKSI..." },
    { step: "barang-penjualan", message: "BASIMPAN BARANG PENJUALAN...", current: 0, total: 3 },
    { step: "barang-penjualan", message: "BARANG PENJUALAN TERSIMPAN", current: 3, total: 3 },
    { step: "stock", message: 'GANTI JMLH QTY STOK: "AYAM GORENG"...', current: 1, total: 3 },
    { step: "stock", message: 'GANTI JMLH QTY STOK: "NASI PUTIH"...', current: 2, total: 3 },
    { step: "stock", message: 'GANTI JMLH QTY STOK: "TEH MANIS"...', current: 3, total: 3 },
    { step: "audit", message: "MENCATAT RIWAYAT PERGERAKAN STOK...", current: 0, total: 3 },
    { step: "audit", message: "PERGERAKAN STOK TA CATAT", current: 3, total: 3 },
    { step: "completed", message: "PENJUALAN BERHASIL" },
  ]

  for (const step of steps) {
    onProgress(step)
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
}

export async function simulateProgressFlowQuick(
  onProgress: (step: ProgressStep) => void
): Promise<void> {
  return simulateProgressFlow(onProgress, 500)
}
