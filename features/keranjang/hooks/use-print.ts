import { useCallback, useState } from "react"
import { printerService } from "@/lib/printer/services/printer.service"
import { bluetooth } from "@/lib/printer/services/bluetooth.service"
import { toast } from "@/lib/store/toast-store"
import type {
  BluetoothDevice,
  PrinterErrorInfo,
  PrintCommand,
} from "@/lib/printer/printer.types"
import type { PenjualanResult } from "../types/penjualan-result.types"

type PrintResult = {
  success: boolean
  error?: PrinterErrorInfo
  commands?: PrintCommand[] // Commands generated for preview
}

// ----- Constants for 58mm thermal printer -----
const LINE_WIDTH = 32

/**
 * Pad string to exact length, truncate if too long
 */
const padEnd = (str: string, len: number): string => {
  if (str.length >= len) return str.substring(0, len)
  return str + " ".repeat(len - str.length)
}

const padStart = (str: string, len: number): string => {
  if (str.length >= len) return str.substring(0, len)
  return " ".repeat(len - str.length) + str
}

/**
 * Format two-column row: left text and right text
 * Total width must be exactly LINE_WIDTH (32 chars)
 */
const formatRow = (left: string, right: string): string => {
  const totalLen = LINE_WIDTH
  const rightLen = Math.min(right.length, totalLen - 2) // Reserve 2 spaces minimum for left
  const leftLen = totalLen - rightLen
  return padEnd(left, leftLen) + padStart(right, rightLen)
}

/**
 * Truncate text with ellipsis if too long
 */
const truncate = (text: string, maxLen: number): string => {
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen - 3) + "..."
}

/**
 * Format Indonesian currency (no "Rp" prefix, just numbers)
 */
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("id-ID")
}

/**
 * Format date in Indonesian: DD, month name, year
 */
const formatDateIndonesian = (date: Date): string => {
  const INDONESIAN_MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]

  const dd = String(date.getDate()).padStart(2, "0")
  const monthName = INDONESIAN_MONTHS[date.getMonth()]
  const yyyy = date.getFullYear()
  return `${dd} ${monthName} ${yyyy}`
}

/**
 * Format time as HH:MM
 */
const formatTime = (date: Date): string => {
  const hh = String(date.getHours()).padStart(2, "0")
  const mm = String(date.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

/**
 * Get first 6 chars of UUID in uppercase
 */
const formatTransactionNo = (uuid: string): string => {
  return uuid.substring(0, 6).toUpperCase()
}

// ----- Generate Print Commands for Receipt -----
const generateReceiptCommands = (result: PenjualanResult): PrintCommand[] => {
  const commands: PrintCommand[] = []
  const date = new Date(result.penjualan.tanggal)
  const transactionNo = formatTransactionNo(result.penjualan.id)

  // Constants
  const STORE_NAME = "PIRAMID"
  const QTY_WIDTH = 2
  const NAMA_WIDTH = 14
  const SATUAN_WIDTH = 6
  const TOTAL_WIDTH = 7

  // Line 1: Store name (centered with width multiplier 1)
  commands.push({
    type: "text",
    content: STORE_NAME,
    align: "center",
    bold: false,
    size: "large", // width multiplier 1 equivalent
  })

  // Line 2: Date and time (centered)
  const dateTimeStr = `${formatDateIndonesian(date)} ${formatTime(date)}`
  commands.push({
    type: "text",
    content: dateTimeStr,
    align: "center",
    bold: false,
    size: "normal",
  })

  // Separator line
  commands.push({ type: "line", char: "-" })

  // Transaction no and staff name
  const staffName = result.penjualan.staff_name.split('@')[0].charAt(0).toUpperCase()
  commands.push({
    type: "row",
    left: `no: ${transactionNo}`,
    right: staffName,
  })

  // Separator line
  commands.push({ type: "line", char: "-" })

  // Items
  for (const item of result.details) {
    const qtyStr = item.qty.toString()
    const namaStr = truncate(item.nama, NAMA_WIDTH)
    const satuanStr = formatCurrency(item.harga_jual)
    const totalStr = formatCurrency(item.jumlah_total)

    // Build the line with proper spacing
    const qtyPart = padStart(qtyStr, QTY_WIDTH)
    const namaPart = padEnd(namaStr, NAMA_WIDTH)
    const satuanPart = padStart(satuanStr, SATUAN_WIDTH)
    const totalPart = padStart(totalStr, TOTAL_WIDTH)

    const line = `${qtyPart} ${namaPart} ${satuanPart} ${totalPart}`

    commands.push({
      type: "text",
      content: line,
      align: "left",
      bold: false,
      size: "normal",
    })
  }

  // Separator line before total
  commands.push({ type: "line", char: "-" })

  // TOTAL
  commands.push({
    type: "row",
    left: "TOTAL",
    right: formatCurrency(result.penjualan.jumlah_total),
  })

  // Separator line after total
  commands.push({ type: "line", char: "-" })

  // Closing message (centered)
  commands.push({
    type: "text",
    content: "Makase Banyak",
    align: "center",
    bold: false,
    size: "normal",
  })

  // Feed lines
  commands.push({ type: "feed", lines: 2 })

  return commands
}

// ----- Hook -----
export function usePrint() {
  const [isPrinting, setIsPrinting] = useState(false)

  const printReceipt = useCallback(
    async (
      result: PenjualanResult,
      device: BluetoothDevice | null
    ): Promise<PrintResult> => {
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
        // Generate commands for preview (100% match with actual print)
        const commands = generateReceiptCommands(result)

        const printResult = await printerService.printWithReconnect(device, async () => {
          // Execute each command exactly as generated for preview
          for (const cmd of commands) {
            switch (cmd.type) {
              case "text":
                // Set alignment before printing
                switch (cmd.align) {
                  case "center":
                    await bluetooth.setCenterAlignment()
                    break
                  case "right":
                    await bluetooth.setRightAlignment()
                    break
                  case "left":
                  default:
                    await bluetooth.setLeftAlignment()
                    break
                }

                // Handle size multipliers (width multiplier 1 for "large" size)
                const widthMultiplier = cmd.size === "large" ? 1 : 0
                await bluetooth.printText(cmd.content, {
                  widthMultiplier,
                  bold: cmd.bold
                })

                // Reset to left alignment after center/right
                if (cmd.align !== "left") {
                  await bluetooth.setLeftAlignment()
                }
                break

              case "line":
                await bluetooth.printText(cmd.char.repeat(LINE_WIDTH))
                break

              case "row":
                const rowText = formatRow(cmd.left, cmd.right)
                await bluetooth.printText(rowText)
                break

              case "feed":
                await bluetooth.feed(cmd.lines)
                break

              case "blank":
                await bluetooth.printBlank()
                break
            }
          }
        })

        return { ...printResult, commands }
      } finally {
        setIsPrinting(false)
      }
    },
    []
  )

  const printDebug = useCallback(
    async (
      result: PenjualanResult,
      device: BluetoothDevice | null
    ): Promise<PrintResult> => {
      if (!device) {
        const error: PrinterErrorInfo = {
          code: "DEVICE_NOT_FOUND",
          message: "Pilih printer terlebih dahulu",
        }
        toast.warning("Printer Tidak Tersedia", error.message)
        return { success: false, error }
      }

      setIsPrinting(true)
      try {
        const itemCount = result.details.length
        const total = formatCurrency(result.penjualan.jumlah_total)

        return await printerService.printWithReconnect(device, async () => {
          await bluetooth.initPrinter()
          await bluetooth.printText(`${itemCount} item | ${total}`)
        })
      } finally {
        setIsPrinting(false)
      }
    },
    []
  )

  return { printReceipt, printDebug, isPrinting }
}

// Export generateReceiptCommands for reuse
export { generateReceiptCommands, formatDateIndonesian, formatTime }
