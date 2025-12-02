import { BluetoothEscposPrinter } from "lx-react-native-bluetooth-printer"
import { bluetoothCore } from "./bluetooth-core.service"
import { PrinterConfig } from "@/lib/printer/types/printer.types"

// ----- Printer Core Service -----
// Handles low-level printing operations

class PrinterCoreService {
    private config: PrinterConfig = bluetoothCore.getConfig()

    async initPrinter(): Promise<void> {
        await BluetoothEscposPrinter.printerInit()
        await BluetoothEscposPrinter.setWidth(this.config.deviceWidth)
    }

    /**
     * Set alignment for subsequent print operations
     */
    async setAlignment(alignment: number): Promise<void> {
        await BluetoothEscposPrinter.printerAlign(alignment)
    }

    /**
     * Set left alignment (0)
     */
    async setLeftAlignment(): Promise<void> {
        await BluetoothEscposPrinter.printerAlign(0)
    }

    /**
     * Set center alignment (1)
     */
    async setCenterAlignment(): Promise<void> {
        await BluetoothEscposPrinter.printerAlign(1)
    }

    /**
     * Set right alignment (2)
     */
    async setRightAlignment(): Promise<void> {
        await BluetoothEscposPrinter.printerAlign(2)
    }

    async printText(
        text: string,
        options?: {
            bold?: boolean
            widthMultiplier?: number
            heightMultiplier?: number
        }
    ): Promise<void> {
        if (options?.bold) {
            try {
                await BluetoothEscposPrinter.setBold(1)
            } catch (error) {
                console.warn("setBold failed:", error)
            }
        }

        await BluetoothEscposPrinter.printText(text + "\n", {
            encoding: this.config.encoding,
            widthtimes: options?.widthMultiplier ?? 0,
            heigthtimes: options?.heightMultiplier ?? 0,
        })

        if (options?.bold) {
            try {
                await BluetoothEscposPrinter.setBold(0)
            } catch (error) {
                console.warn("setBold reset failed:", error)
            }
        }
    }

    async printColumn(
        columnWidths: number[],
        columnAligns: number[],
        columnTexts: string[]
    ): Promise<void> {
        await BluetoothEscposPrinter.printColumn(
            columnWidths,
            columnAligns,
            columnTexts,
            { encoding: this.config.encoding }
        )
    }

    async printLine(char = "-"): Promise<void> {
        const line = char.repeat(32) // Default character per line
        await BluetoothEscposPrinter.printText(line + "\n", {
            encoding: this.config.encoding,
        })
    }

    async printBlank(): Promise<void> {
        await BluetoothEscposPrinter.printText("\n", {})
    }

    async feed(lines = 1): Promise<void> {
        const feedText = "\n".repeat(lines)
        await BluetoothEscposPrinter.printText(feedText, {
            encoding: this.config.encoding,
        })
    }

    setConfig(config: Partial<PrinterConfig>): void {
        this.config = { ...this.config, ...config }
        bluetoothCore.setConfig(config)
    }

    getConfig(): PrinterConfig {
        return { ...this.config }
    }
}

// Singleton instance
export const printerCore = new PrinterCoreService()