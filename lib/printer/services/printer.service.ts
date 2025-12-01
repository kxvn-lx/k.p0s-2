import { bluetooth } from "./bluetooth.service"
import type { ReceiptData, PrinterErrorInfo, BluetoothDevice } from "@/lib/printer/printer.types"
import { formatCurrency } from "@/lib/printer/receipt-builder"

// Printer service: high-level printing and error handling
class PrinterService {
  async printReceipt(data: ReceiptData): Promise<void> {
    try {
      await bluetooth.initPrinter()

      // Header
      await bluetooth.printText(data.storeName, {
        bold: true,
        widthMultiplier: 1,
        heightMultiplier: 1,
      })
      await bluetooth.printBlank()
      await bluetooth.printText(`${data.date} ${data.time}`)
      await bluetooth.printLine("-")

      // Items header
      await bluetooth.printColumn(
        [16, 4, 12],
        [0, 1, 2],
        ["Item", "Qty", "Harga"]
      )
      await bluetooth.printLine("-")

      // Items
      for (const item of data.items) {
        await bluetooth.printColumn(
          [16, 4, 12],
          [0, 1, 2],
          [item.name, String(item.qty), formatCurrency(item.total)]
        )
      }

      await bluetooth.printLine("-")

      // Subtotal
      await bluetooth.printColumn(
        [20, 12],
        [0, 2],
        ["Subtotal", formatCurrency(data.subtotal)]
      )

      // Total
      await bluetooth.printColumn(
        [20, 12],
        [0, 2],
        ["TOTAL", formatCurrency(data.total)]
      )

      // Payment info
      if (data.paymentMethod) {
        await bluetooth.printLine("-")
        await bluetooth.printColumn(
          [20, 12],
          [0, 2],
          ["Bayar", data.paymentMethod]
        )
      }

      if (data.cashReceived !== undefined) {
        await bluetooth.printColumn(
          [20, 12],
          [0, 2],
          ["Tunai", formatCurrency(data.cashReceived)]
        )
      }

      if (data.change !== undefined) {
        await bluetooth.printColumn(
          [20, 12],
          [0, 2],
          ["Kembali", formatCurrency(data.change)]
        )
      }

      await bluetooth.printLine("-")
      await bluetooth.printBlank()
      await bluetooth.printText("Terima kasih!")
      await bluetooth.feed(3)
    } catch (error) {
      throw this.createError("PRINT_FAILED", "Gagal mencetak struk", error)
    }
  }

  // Print with reconnect helper
  async printWithReconnect(
    savedDevice: BluetoothDevice | null,
    printFn: () => Promise<void>
  ): Promise<{ success: boolean; error?: PrinterErrorInfo }> {
    if (!savedDevice) {
      return {
        success: false,
        error: this.createError("DEVICE_NOT_FOUND", "Tidak ada printer tersimpan"),
      }
    }

    // Reconnect before printing
    const reconnected = await bluetooth.reconnect(savedDevice)
    if (!reconnected) {
      return {
        success: false,
        error: this.createError("CONNECTION_FAILED", "Gagal terhubung ke printer. Pastikan printer menyala."),
      }
    }

    try {
      await printFn()
      return { success: true }
    } catch (error) {
      return { success: false, error: error as PrinterErrorInfo }
    } finally {
      await bluetooth.disconnect()
    }
  }

  // Helpers
  private createError(
    code: PrinterErrorInfo["code"],
    message: string,
    originalError?: unknown
  ): PrinterErrorInfo {
    return { code, message, originalError }
  }
}

// ----- Singleton Export -----
export const printerService = new PrinterService()
