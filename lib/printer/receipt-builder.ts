import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import { connectForPrinting } from "./printer.service"
import type { Alignment, TextSize, PrintCommand } from "./printer.types"

// ----- Constants -----
// 58mm thermal paper = 32 characters per line (standard font)
export const LINE_WIDTH = 32
const SEPARATOR_CHAR = "-"

// ----- Size Mapping (widthTimes, heightTimes) -----
const SIZE_MAP: Record<TextSize, { width: number; height: number }> = {
  normal: { width: 0, height: 0 },
  wide: { width: 1, height: 0 },
  tall: { width: 0, height: 1 },
  large: { width: 1, height: 1 },
}

// ----- Helper Functions -----
const padRight = (str: string, len: number): string => str.padEnd(len).slice(0, len)
const padLeft = (str: string, len: number): string => str.padStart(len).slice(-len)

export const formatRow = (left: string, right: string, width: number = LINE_WIDTH): string => {
  const rightLen = right.length
  const leftLen = width - rightLen - 1 // -1 for space between
  return `${padRight(left, leftLen)} ${padLeft(right, rightLen)}`
}

// ----- Receipt Builder Class -----
export class ReceiptBuilder {
  private commands: PrintCommand[] = []

  // ----- Get Commands (for preview) -----
  getCommands(): PrintCommand[] {
    return [...this.commands]
  }

  // ----- Text Methods -----
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

  // ----- Layout Methods -----
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

  // ----- Execution -----
  async print(): Promise<boolean> {
    const connected = await connectForPrinting()
    if (!connected) {
      console.error("[ReceiptBuilder] Failed to connect to printer")
      return false
    }

    try {
      await BluetoothEscposPrinter.printerInit()

      for (const cmd of this.commands) {
        await this.executeCommand(cmd)
      }

      await BluetoothEscposPrinter.printAndFeed(3)
      return true
    } catch (error) {
      console.error("[ReceiptBuilder] Print error:", error)
      return false
    }
  }

  private async executeCommand(cmd: PrintCommand): Promise<void> {
    switch (cmd.type) {
      case "text": {
        const size = SIZE_MAP[cmd.size]
        await BluetoothEscposPrinter.printText(cmd.content + "\n", {
          encoding: "UTF-8",
          codepage: 0,
          widthtimes: size.width,
          heigthtimes: size.height,
          fonttype: cmd.bold ? 1 : 0,
        })
        break
      }

      case "line": {
        const line = cmd.char.repeat(LINE_WIDTH)
        await BluetoothEscposPrinter.printText(line + "\n", {})
        break
      }

      case "row": {
        const formatted = formatRow(cmd.left, cmd.right)
        await BluetoothEscposPrinter.printText(formatted + "\n", {})
        break
      }

      case "feed": {
        await BluetoothEscposPrinter.printAndFeed(cmd.lines)
        break
      }

      case "blank": {
        await BluetoothEscposPrinter.printText("\n", {})
        break
      }
    }
  }

  // ----- Print from existing commands -----
  static async printFromCommands(commands: PrintCommand[]): Promise<boolean> {
    const connected = await connectForPrinting()
    if (!connected) {
      console.error("[ReceiptBuilder] Failed to connect to printer")
      return false
    }

    try {
      await BluetoothEscposPrinter.printerInit()
      const builder = new ReceiptBuilder()

      for (const cmd of commands) {
        await builder.executeCommand(cmd)
      }

      await BluetoothEscposPrinter.printAndFeed(3)
      return true
    } catch (error) {
      console.error("[ReceiptBuilder] Print error:", error)
      return false
    }
  }

  // ----- Debug: Print single line -----
  static async debug(message: string): Promise<boolean> {
    const connected = await connectForPrinting()
    if (!connected) {
      console.error("[ReceiptBuilder] Debug: Failed to connect to printer")
      return false
    }

    try {
      await BluetoothEscposPrinter.printerInit()
      await BluetoothEscposPrinter.printText(message + "\n", {})
      await BluetoothEscposPrinter.printAndFeed(2)
      return true
    } catch (error) {
      console.error("[ReceiptBuilder] Debug print error:", error)
      return false
    }
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