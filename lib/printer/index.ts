// ----- Services -----
export { bluetooth } from "./services/bluetooth.service"
export type { BluetoothEventType, BluetoothEventPayload } from "./services/bluetooth.service"

export { printerService } from "./services/printer.service"

// ----- Store -----
export { usePrinterStore } from "./store/printer.store"

// ----- Hooks -----
export { usePrinterConnection } from "./hooks/use-printer-connection"
export { usePrinterScanner } from "./hooks/use-printer-scanner"
export { usePrinterPermissions } from "./hooks/use-printer-permissions"
export { usePrintReceipt } from "./hooks/use-print-receipt"
export { useTestPrint } from "./hooks/use-test-print"

// ----- Types -----
export type {
  BluetoothDevice,
  ConnectionState,
  PrinterError,
  PrinterErrorInfo,
  ReceiptItem,
  ReceiptData,
  Alignment,
  TextSize,
  PrintCommand,
  PrinterConfig,
} from "./printer.types"

// ----- Utils -----
export { ReceiptBuilder, receipt, formatCurrency, formatReceiptDate, formatReceiptTime } from "./receipt-builder"
