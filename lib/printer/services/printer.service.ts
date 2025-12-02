import { BluetoothErrorInfo } from "@/lib/printer/types/bluetooth.types";
import { bluetoothCore } from "./bluetooth-core.service"
import { BluetoothDevice } from "lx-react-native-bluetooth-printer";

// ----- Printer Service -----
// High-level printing service with reconnect logic
class PrinterService {
  // Print with reconnect helper
  async printWithReconnect(
    savedDevice: BluetoothDevice | null,
    printFn: () => Promise<void>
  ): Promise<{ success: boolean; error?: BluetoothErrorInfo }> {
    if (!savedDevice) {
      return {
        success: false,
        error: this.createError("DEVICE_NOT_FOUND", "Tidak ada printer tersimpan"),
      }
    }

    // Reconnect before printing
    const reconnected = await bluetoothCore.reconnect(savedDevice)
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
      return { success: false, error: error as BluetoothErrorInfo }
    } finally {
      await bluetoothCore.disconnect()
    }
  }

  // Helpers
  private createError(
    code: BluetoothErrorInfo["code"],
    message: string,
    originalError?: unknown
  ): BluetoothErrorInfo {
    return { code, message, originalError }
  }
}

// Singleton instance
export const printerService = new PrinterService()
