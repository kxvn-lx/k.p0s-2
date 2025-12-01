import type { PrintCommand } from "@/lib/printer/printer.types"
import type { PenjualanResult } from "../types/penjualan-result.types"
import {
  formatCurrency,
  formatReceiptDate,
  formatReceiptTime,
  LINE_WIDTH,
} from "@/lib/printer/receipt-builder"

// ----- Constants -----
const STORE_NAME = "K.POS"
const SEPARATOR_LINE = "-" // Basic ASCII for ESC/POS compatibility

// ----- Helpers -----
const padEnd = (str: string, len: number): string => {
  if (str.length >= len) return str.substring(0, len)
  return str + " ".repeat(len - str.length)
}

const padStart = (str: string, len: number): string => {
  if (str.length >= len) return str.substring(0, len)
  return " ".repeat(len - str.length) + str
}

const formatRow = (left: string, right: string): string => {
  const totalLen = LINE_WIDTH
  const rightLen = Math.min(right.length, totalLen - 2)
  const leftLen = totalLen - rightLen
  return padEnd(left, leftLen) + padStart(right, rightLen)
}

const truncateWithEllipsis = (str: string, maxLen: number): string => {
  if (str.length <= maxLen) return str
  return str.substring(0, maxLen - 3) + "..."
}

const formatTransactionNo = (uuid: string): string => {
  return uuid.substring(0, 6).toUpperCase()
}

// ----- Builder -----
export const buildReceiptCommands = (
  result: PenjualanResult
): PrintCommand[] => {
  const commands: PrintCommand[] = []
  const date = new Date(result.penjualan.tanggal)

  // Line 1: Store name (left) and date/time (right) on SAME line
  const dateTimeStr = `${formatReceiptDate(date)} ${formatReceiptTime(date)}`
  const line1 = formatRow(STORE_NAME, dateTimeStr)
  commands.push({
    type: "text",
    content: line1,
    align: "left",
    bold: false,
    size: "normal",
  })

  // Separator line
  commands.push({ type: "line", char: SEPARATOR_LINE })

  // Transaction no
  const transactionNo = formatTransactionNo(result.penjualan.id)
  commands.push({
    type: "text",
    content: `no: ${transactionNo}`,
    align: "left",
    bold: false,
    size: "normal",
  })

  // Separator line
  commands.push({ type: "line", char: SEPARATOR_LINE })

  // Items header (qty, stock_nama, harga_satuan, harga_total)
  // Table layout: <qty:2> <stock_nama:14> <harga_satuan:6> <harga_total:7>
  // Total width: 32 chars
  // Spaces between columns: 3 spaces total
  // qty(2) + space(1) + nama(14) + space(1) + satuan(6) + space(1) + total(7) = 32

  const QTY_WIDTH = 2
  const NAMA_WIDTH = 14
  const SATUAN_WIDTH = 6
  const TOTAL_WIDTH = 7

  // Items
  for (const item of result.details) {
    const qtyStr = item.qty.toString()
    const namaStr = truncateWithEllipsis(item.nama, NAMA_WIDTH)
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
  commands.push({ type: "line", char: SEPARATOR_LINE })

  // TOTAL
  commands.push({
    type: "text",
    content: formatRow("TOTAL", formatCurrency(result.penjualan.jumlah_total)),
    align: "left",
    bold: false,
    size: "normal",
  })

  // Separator line after total
  commands.push({ type: "line", char: SEPARATOR_LINE })

  // Feed lines
  commands.push({ type: "feed", lines: 3 })

  return commands
}
