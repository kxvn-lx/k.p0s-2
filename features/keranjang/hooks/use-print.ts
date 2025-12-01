import { useCallback, useState } from "react"
import { printerService } from "@/lib/printer/services/printer.service"
import { bluetooth } from "@/lib/printer/services/bluetooth.service"
import { toast } from "@/lib/store/toast-store"
import type { BluetoothDevice, PrinterErrorInfo } from "@/lib/printer/printer.types"
import type { PenjualanResult } from "../types/penjualan-result.types"

type PrintResult = {
  success: boolean
  error?: PrinterErrorInfo
}

// ----- Hook -----
export function usePrint() {
  const [isPrinting, setIsPrinting] = useState(false)

  const printReceipt = useCallback(
    async (result: PenjualanResult, device: BluetoothDevice | null): Promise<PrintResult> => {
      if (!device) {
        const error: PrinterErrorInfo = {
          code: "DEVICE_NOT_FOUND",
          message: "Pilih printer terlebih dahulu di menu pengaturan",
        }
        toast.warning("Printer Tidak Tersedia", error.message)
        return { success: false, error }
      }

      setIsPrinting(true)
      try {
        return await printerService.printWithReconnect(device, async () => {
          await bluetooth.initPrinter()
          await bluetooth.printText("K.POS", { bold: true, widthMultiplier: 1, heightMultiplier: 1 })
          await bluetooth.printBlank()

          const date = new Date(result.penjualan.tanggal)
          const dateStr = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
          const timeStr = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
          await bluetooth.printText(`${dateStr} ${timeStr}`)
          await bluetooth.printLine("-")

          for (const item of result.details) {
            await bluetooth.printColumn([16, 4, 12], [0, 1, 2], [
              item.nama.slice(0, 16),
              `x${item.qty}`,
              item.jumlah_total.toLocaleString("id-ID"),
            ])
          }

          await bluetooth.printLine("-")
          await bluetooth.printColumn([20, 12], [0, 2], ["TOTAL", result.penjualan.jumlah_total.toLocaleString("id-ID")])
          await bluetooth.printColumn([20, 12], [0, 2], ["Tunai", result.payment.cashReceived.toLocaleString("id-ID")])
          await bluetooth.printColumn([20, 12], [0, 2], ["Kembali", result.payment.change.toLocaleString("id-ID")])
          await bluetooth.printLine("-")
          await bluetooth.printBlank()
          await bluetooth.printText("Terima kasih!")
          await bluetooth.feed(3)
        })
      } finally {
        setIsPrinting(false)
      }
    },
    []
  )

  const printDebug = useCallback(async (result: PenjualanResult, device: BluetoothDevice | null): Promise<PrintResult> => {
    if (!device) {
      const error: PrinterErrorInfo = { code: "DEVICE_NOT_FOUND", message: "Pilih printer terlebih dahulu" }
      toast.warning("Printer Tidak Tersedia", error.message)
      return { success: false, error }
    }

    setIsPrinting(true)
    try {
      const itemCount = result.details.length
      const total = result.penjualan.jumlah_total.toLocaleString("id-ID")

      return await printerService.printWithReconnect(device, async () => {
        await bluetooth.initPrinter()
        await bluetooth.printText(`${itemCount} item | Rp${total}`)
        await bluetooth.feed(2)
      })
    } finally {
      setIsPrinting(false)
    }
  }, [])

  return { printReceipt, printDebug, isPrinting }
}
