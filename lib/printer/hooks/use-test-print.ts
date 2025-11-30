import { useCallback, useState } from "react"
import { printerService, bluetooth } from "@/lib/printer"
import { toast } from "@/lib/store/toast-store"
import type { BluetoothDevice } from "@/lib/printer"

// ----- Hook -----
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
        await bluetooth.printText("Tes OK", { align: "center" })
        await bluetooth.feed(2)
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
