import { bluetooth } from "./bluetooth.service"
import type { PrinterErrorInfo, BluetoothDevice } from "@/lib/printer/printer.types"

export const LINE_WIDTH = 32

// Printer service: high-level printing and error handling
class PrinterService {
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
