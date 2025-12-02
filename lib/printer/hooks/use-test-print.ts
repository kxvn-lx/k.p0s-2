import { useCallback, useState } from "react"
import { usePrinter } from "./use-printer"
import { toast } from "@/lib/store/toast-store"

export function useTestPrint() {
  const [isPrinting, setIsPrinting] = useState(false)
  const { printerService, selectedPrinter, printerCore } = usePrinter()

  const printTest = useCallback(async (): Promise<boolean> => {
    if (!selectedPrinter) {
      toast.warning("Tidak Ada Printer", "Pilih printer terlebih dahulu")
      return false
    }

    setIsPrinting(true)
    try {
      const result = await printerService.printWithReconnect(selectedPrinter, async () => {
        await printerCore.initPrinter()
        await printerCore.printText("Tes OK")
      })

      if (result.success) {
        toast.success("Berhasil", "Tes cetak berhasil")
      } else if (result.error) {
        toast.error("Gagal Mencetak", result.error.message)
      }

      return result.success
    } finally {
      setIsPrinting(false)
    }
  }, [selectedPrinter, printerService, printerCore])

  return { printTest, isPrinting }
}
