import { View } from "react-native"
import { useCallback, useState, useMemo } from "react"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Printer } from "lucide-react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import ReceiptPreview from "@/components/shared/receipt-preview"
import { usePrinter } from "@/lib/hooks/use-printer"
import { toast } from "@/lib/store/toast-store"
import { receipt, formatCurrency, formatReceiptDate, formatReceiptTime, ReceiptBuilder } from "@/lib/printer/receipt-builder"
import type { PenjualanResult } from "./types/penjualan-result.types"
import type { PrintCommand } from "@/lib/printer/printer.types"

// ----- Helpers -----
const parseResult = (resultString: string | undefined): PenjualanResult | null => {
  if (!resultString) return null
  try {
    return JSON.parse(resultString) as PenjualanResult
  } catch {
    return null
  }
}

// ----- Build Receipt Commands -----
const buildReceiptCommands = (result: PenjualanResult): PrintCommand[] => {
  const now = new Date(result.penjualan.tanggal)
  const totalAmount = result.penjualan.jumlah_total
  const cashReceived = result.payment.cashReceived
  const change = result.payment.change

  const builder = receipt()

  // Header
  builder
    .center("TOKO ANDA", { bold: true, size: "large" })
    .center(formatReceiptDate(now) + " " + formatReceiptTime(now))
    .line()

  // Items
  for (const detail of result.details) {
    builder.left(detail.nama)
    builder.row(`  ${detail.qty} x ${formatCurrency(detail.harga_jual)}`, formatCurrency(detail.jumlah_total))
  }

  // Totals
  builder
    .line()
    .row("TOTAL", `Rp ${formatCurrency(totalAmount)}`)

  // Payment info
  if (cashReceived > 0) {
    builder
      .row("TUNAI", `Rp ${formatCurrency(cashReceived)}`)
      .row("KEMBALI", `Rp ${formatCurrency(change)}`)
  }

  // Footer
  builder
    .line()
    .blank()
    .center("Terima Kasih")
    .center("Selamat Berbelanja")
    .feed(2)

  return builder.getCommands()
}

// ----- Component -----
export default function SelesaiScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const result = useMemo(() => parseResult(params.result as string), [params.result])

  const { hasSelectedPrinter, selectedPrinter } = usePrinter()
  const [isPrinting, setIsPrinting] = useState(false)

  // ----- Receipt Commands (memoized, single source of truth) -----
  const receiptCommands = useMemo(() => {
    if (!result) return []
    return buildReceiptCommands(result)
  }, [result])

  // ----- Handlers -----
  const handleFinish = useCallback(() => {
    router.dismissAll()
  }, [router])

  const handlePrint = useCallback(async () => {
    if (!hasSelectedPrinter || !selectedPrinter) {
      toast.warning("Printer Belum Dipilih", "Pilih printer di menu Pengaturan")
      return
    }

    if (receiptCommands.length === 0) {
      toast.error("Data Tidak Valid", "Data transaksi tidak ditemukan")
      return
    }

    setIsPrinting(true)
    toast.info("Mencetak...", "Mengirim struk ke printer")

    try {
      const success = await ReceiptBuilder.printFromCommands(receiptCommands)

      if (success) {
        toast.success("Berhasil", "Struk berhasil dicetak")
      } else {
        toast.error("Gagal Cetak", "Pastikan printer menyala dan terhubung")
      }
    } catch (error) {
      console.error("Print error:", error)
      toast.error("Gagal Cetak", "Terjadi kesalahan saat mencetak")
    } finally {
      setIsPrinting(false)
    }
  }, [hasSelectedPrinter, selectedPrinter, receiptCommands])

  // ----- Render -----
  return (
    <View className="flex-1 bg-background">
      {/* Receipt Preview - Centered */}
      <View className="flex-1 justify-center items-center">
        <ReceiptPreview commands={receiptCommands} />
      </View>

      {/* Action Buttons */}
      <View className="flex-row h-14 p-2 gap-2">
        <Button
          onPress={handlePrint}
          disabled={isPrinting || receiptCommands.length === 0}
          className="flex-1 flex-row items-center gap-2"
          title={isPrinting ? "MENCETAK..." : "PRINT STRUK"}
        />
        <Button variant="outline" onPress={handleFinish} title="SELESAI" className="flex-1" />
      </View>
    </View>
  )
}
