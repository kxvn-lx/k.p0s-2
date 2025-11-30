import { useState, useCallback } from "react"
import { usePrinterStore } from "@/lib/printer/store/printer.store"
import { printerService } from "@/lib/printer/services/printer.service"
import type { ReceiptData, PrinterErrorInfo } from "@/lib/printer/printer.types"
import { toast } from "@/lib/store/toast-store"

// ----- Types -----
type PrintReceiptResult = {
  success: boolean
  error?: PrinterErrorInfo
}

// ----- Hook: Receipt Printing -----
// Purpose: Execute receipt printing with error handling and UI feedback
export function usePrintReceipt() {
  const [isPrinting, setIsPrinting] = useState(false)
  const { selectedPrinter } = usePrinterStore()

  const print = useCallback(
    async (data: ReceiptData): Promise<PrintReceiptResult> => {
      if (!selectedPrinter) {
        const error: PrinterErrorInfo = {
          code: "DEVICE_NOT_FOUND",
          message: "Belum ada printer yang dipilih. Silakan pilih printer di menu.",
        }
        toast.warning("Tidak Ada Printer", error.message)
        return { success: false, error }
      }

      setIsPrinting(true)

      try {
        const result = await printerService.printWithReconnect(selectedPrinter, async () => {
          await printerService.printReceipt(data)
        })

        if (result.success) {
          toast.success("Berhasil", "Struk berhasil dicetak")
        } else if (result.error) {
          toast.error("Gagal Mencetak", result.error.message)
        }

        return result
      } finally {
        setIsPrinting(false)
      }
    },
    [selectedPrinter]
  )

  const canPrint = !!selectedPrinter

  return {
    print,
    isPrinting,
    canPrint,
    selectedPrinter,
  }
}
