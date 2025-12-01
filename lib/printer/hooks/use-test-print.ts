import { useCallback, useState } from "react"
import { printerService } from "@/lib/printer/services/printer.service"
import { bluetooth } from "@/lib/printer/services/bluetooth.service"
import { toast } from "@/lib/store/toast-store"
import type { BluetoothDevice } from "@/lib/printer/printer.types"

export function useTestPrint() {
  const [isPrinting, setIsPrinting] = useState(false)

  const printTest = useCallback(async (device: BluetoothDevice | null): Promise<boolean> => {
    if (!device) {
      toast.warning("Tidak Ada Printer", "Pilih printer terlebih dahulu")
      return false
    }

    setIsPrinting(true)
    try {
      const result = await printerService.printWithReconnect(device, async () => {
        await bluetooth.initPrinter()
        await bluetooth.printText("Tes OK")
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
