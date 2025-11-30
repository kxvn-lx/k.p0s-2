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

// ----- Helpers -----
const padRight = (str: string, len: number): string => str.slice(0, len).padEnd(len)
const padLeft = (str: string, len: number): string => str.slice(-len).padStart(len)

const formatRow = (left: string, right: string): string => {
  const rightLen = right.length
  const leftLen = LINE_WIDTH - rightLen - 1
  return `${padRight(left, leftLen)} ${padLeft(right, rightLen)}`
}

// ----- Builder -----
export const buildReceiptCommands = (result: PenjualanResult): PrintCommand[] => {
  const commands: PrintCommand[] = []
  const date = new Date(result.penjualan.tanggal)

  // Header
  commands.push({ type: "text", content: STORE_NAME, align: "center", bold: true, size: "large" })
  commands.push({ type: "blank" })
  commands.push({
    type: "text",
    content: `${formatReceiptDate(date)} ${formatReceiptTime(date)}`,
    align: "center",
    bold: false,
    size: "normal",
  })
  commands.push({ type: "line", char: "-" })

  // Items
  for (const item of result.details) {
    const itemName = item.nama.length > 16 ? item.nama.slice(0, 15) + "." : item.nama
    const qtyStr = `x${item.qty}`
    const priceStr = formatCurrency(item.jumlah_total)

    // Format: ItemName    x2   10.000
    const qtyWidth = 4
    const priceWidth = priceStr.length
    const nameWidth = LINE_WIDTH - qtyWidth - priceWidth - 2

    const line =
      padRight(itemName, nameWidth) +
      " " +
      padLeft(qtyStr, qtyWidth) +
      " " +
      padLeft(priceStr, priceWidth)

    commands.push({ type: "text", content: line, align: "left", bold: false, size: "normal" })
  }

  commands.push({ type: "line", char: "-" })

  // Total
  commands.push({
    type: "text",
    content: formatRow("TOTAL", formatCurrency(result.penjualan.jumlah_total)),
    align: "left",
    bold: true,
    size: "normal",
  })

  // Payment info
  commands.push({
    type: "text",
    content: formatRow("Tunai", formatCurrency(result.payment.cashReceived)),
    align: "left",
    bold: false,
    size: "normal",
  })
  commands.push({
    type: "text",
    content: formatRow("Kembali", formatCurrency(result.payment.change)),
    align: "left",
    bold: false,
    size: "normal",
  })

  commands.push({ type: "line", char: "-" })
  commands.push({ type: "blank" })
  commands.push({ type: "text", content: "Terima kasih!", align: "center", bold: false, size: "normal" })
  commands.push({ type: "feed", lines: 3 })

  return commands
}
