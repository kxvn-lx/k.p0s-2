import type { Alignment, TextSize, PrintCommand } from "./printer.types"

export const LINE_WIDTH = 32
const SEPARATOR_CHAR = "-"

const padRight = (str: string, len: number): string => str.padEnd(len).slice(0, len)
const padLeft = (str: string, len: number): string => str.padStart(len).slice(-len)

export const formatRow = (left: string, right: string, width: number = LINE_WIDTH): string => {
  const rightLen = right.length
  const leftLen = width - rightLen - 1
  return `${padRight(left, leftLen)} ${padLeft(right, rightLen)}`
}

// ----- Receipt Builder Class -----
export class ReceiptBuilder {
  private commands: PrintCommand[] = []

  getCommands(): PrintCommand[] {
    return [...this.commands]
  }

  // Text methods
  text(content: string, options?: { align?: Alignment; bold?: boolean; size?: TextSize }): this {
    this.commands.push({
      type: "text",
      content,
      align: options?.align ?? "left",
      bold: options?.bold ?? false,
      size: options?.size ?? "normal",
    })
    return this
  }

  // Center text with larger size and bold formatting
  centerTitle(content: string): this {
    return this.text(content, { align: "center", bold: true, size: "large" })
  }

  left(content: string, options?: { bold?: boolean; size?: TextSize }): this {
    return this.text(content, { ...options, align: "left" })
  }

  center(content: string, options?: { bold?: boolean; size?: TextSize }): this {
    return this.text(content, { ...options, align: "center" })
  }

  right(content: string, options?: { bold?: boolean; size?: TextSize }): this {
    return this.text(content, { ...options, align: "right" })
  }

  bold(content: string, options?: { align?: Alignment; size?: TextSize }): this {
    return this.text(content, { ...options, bold: true })
  }

  // Layout methods
  line(char: string = SEPARATOR_CHAR): this {
    this.commands.push({ type: "line", char })
    return this
  }

  row(left: string, right: string): this {
    this.commands.push({ type: "row", left, right })
    return this
  }

  blank(): this {
    this.commands.push({ type: "blank" })
    return this
  }

  feed(lines: number = 1): this {
    this.commands.push({ type: "feed", lines })
    return this
  }
}

// ----- Factory Function -----
export const receipt = (): ReceiptBuilder => new ReceiptBuilder()

// ----- Utility: Format currency -----
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("id-ID")
}

// ----- Utility: Format date/time -----
export const formatReceiptDate = (date: Date): string => {
  const dd = date.getDate().toString().padStart(2, "0")
  const mm = (date.getMonth() + 1).toString().padStart(2, "0")
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export const formatReceiptTime = (date: Date): string => {
  const hh = date.getHours().toString().padStart(2, "0")
  const mm = date.getMinutes().toString().padStart(2, "0")
  return `${hh}:${mm}`
}

// Indonesian month names
const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

// Format date in Indonesian: DD, month name, year HH:mm
export const formatReceiptDateTime = (date: Date): string => {
  const dd = date.getDate().toString().padStart(2, "0")
  const monthName = INDONESIAN_MONTHS[date.getMonth()]
  const yyyy = date.getFullYear()
  const hh = date.getHours().toString().padStart(2, "0")
  const mm = date.getMinutes().toString().padStart(2, "0")
  return `${dd}, ${monthName} ${yyyy} ${hh}:${mm}`
}

// Center text within specified width
export const centerText = (text: string, width: number = LINE_WIDTH): string => {
  const textLength = text.length
  if (textLength >= width) return text.slice(0, width)

  const spacesNeeded = width - textLength
  const leftSpaces = Math.floor(spacesNeeded / 2)
  const rightSpaces = spacesNeeded - leftSpaces

  return " ".repeat(leftSpaces) + text + " ".repeat(rightSpaces)
}