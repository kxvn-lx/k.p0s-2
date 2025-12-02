import type { ProgressStep } from "@/features/penjualan/api/penjualan.service"

export async function simulateProgressFlow(
  onProgress: (step: ProgressStep) => void,
  delayMs = 1000
): Promise<void> {
  const steps: ProgressStep[] = [
    { step: "validating", message: "Memvalidasi data..." },
    { step: "validating", message: "Memeriksa ketersediaan stok..." },
    { step: "penjualan", message: "Menyimpan transaksi..." },
    { step: "details", message: "Menyimpan detail item...", current: 0, total: 3 },
    { step: "details", message: "Menyimpan detail item...", current: 1, total: 3 },
    { step: "details", message: "Menyimpan detail item...", current: 2, total: 3 },
    { step: "details", message: "Menyimpan detail item...", current: 3, total: 3 },
    { step: "details", message: "Detail item tersimpan", current: 3, total: 3 },
    { step: "stock", message: 'Memperbarui stok "Ayam Goreng"...', current: 1, total: 3 },
    { step: "stock", message: 'Memperbarui stok "Nasi Putih"...', current: 2, total: 3 },
    { step: "stock", message: 'Memperbarui stok "Teh Manis"...', current: 3, total: 3 },
    { step: "audit", message: "Mencatat riwayat pergerakan stok...", current: 0, total: 3 },
    { step: "audit", message: "Mencatat riwayat pergerakan stok...", current: 1, total: 3 },
    { step: "audit", message: "Mencatat riwayat pergerakan stok...", current: 2, total: 3 },
    { step: "audit", message: "Riwayat tercatat", current: 3, total: 3 },
    { step: "completed", message: "Transaksi berhasil" },
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
