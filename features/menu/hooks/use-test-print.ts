import { useCallback, useState } from "react"
import { printerService } from "@/lib/printer/services/printer.service"
import { usePrinter } from "@/lib/printer/hooks/use-printer"
import { toast } from "@/lib/store/toast-store"
import { BluetoothDevice } from "@/lib/printer/types/bluetooth.types"

// ----- Hook -----
export function useTestPrint() {
  const [isPrinting, setIsPrinting] = useState(false)
  const { printerCore } = usePrinter()

  const printTest = useCallback(async (device: BluetoothDevice | null): Promise<boolean> => {
    if (!device) {
      toast.warning("Tidak Ada Printer", "Pilih printer terlebih dahulu")
      return false
    }

    setIsPrinting(true)
    try {
      const result = await printerService.printWithReconnect(device, async () => {
        await printerCore.initPrinter()
        await printerCore.printText("Tes OK")
        await printerCore.feed(2)
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
  }, [])

  return { printTest, isPrinting }
}
