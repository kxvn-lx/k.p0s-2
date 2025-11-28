// ----- IMPORTS -----
import { View } from "react-native"
import { useState, useMemo, useCallback } from "react"
import { useRouter } from "expo-router"
import { Delete } from "lucide-react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import InfoRow from "@/components/shared/info-row"
import useKeranjangStore from "./store/keranjang-store"
import { formatDateTime, cn } from "@/lib/utils"

// ----- CONSTANTS -----
const MAX_INPUT_LENGTH = 12

const KEYPAD_GRID = [
  ["7", "8", "9", "clear"],
  ["4", "5", "6", "backspace"],
  ["1", "2", "3", null],
  ["00", "0", "000", null],
] as const

// ----- COMPONENT -----
export default function PembayaranScreen() {
  // ----- STATE -----
  const router = useRouter()
  const items = useKeranjangStore((s) => s.items)
  const reset = useKeranjangStore((s) => s.reset)
  const [inputAmount, setInputAmount] = useState("")

  // ----- COMPUTED VALUES -----
  const totalAmount = useMemo(() => {
    return Object.values(items).reduce(
      (sum, item) => sum + item.qty * item.harga_satuan,
      0
    )
  }, [items])

  const paymentAmount = parseInt(inputAmount || "0", 10)
  const change = paymentAmount - totalAmount
  const isValid = paymentAmount >= totalAmount

  // ----- HANDLERS -----
  const handlePressKey = useCallback((key: string) => {
    setInputAmount((prev) => {
      if (prev === "" && (key === "0" || key === "00" || key === "000"))
        return ""
      if (prev.length > MAX_INPUT_LENGTH) return prev
      return prev + key
    })
  }, [])

  const handleClear = useCallback(() => {
    setInputAmount("")
  }, [])

  const handleBackspace = useCallback(() => {
    setInputAmount((prev) => prev.slice(0, -1))
  }, [])

  const handleExactAmount = useCallback(() => {
    setInputAmount(totalAmount.toString())
  }, [totalAmount])

  const handleProceed = useCallback(async () => {
    if (!isValid) return

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const itemCount = Object.keys(items).length
      const totalQty = Object.values(items).reduce((sum, item) => sum + item.qty, 0)

      // Clear the basket
      reset()

      router.push({
        pathname: "/(authenticated)/keranjang/selesai",
        params: {
          totalAmount: totalAmount.toString(),
          itemCount: itemCount.toString(),
          totalQty: totalQty.toString(),
        },
      })
    } catch (error) {
      // Handle error, perhaps show toast
      console.error("Payment failed:", error)
    }
  }, [isValid, items, totalAmount, reset, router])

  // ----- RENDER -----
  return (
    <View className="flex-1 bg-background flex-col justify-between">
      {/* Header Info  */}
      <View className="">
        <InfoRow label="TANGGAL" value={formatDateTime(new Date())} />

        <InfoRow label="TOTAL" value={totalAmount.toLocaleString()} containerClassName="gap-2" />

        {change > 0 && (
          <InfoRow label="KEMBALIAN" value={change.toLocaleString()} containerClassName="gap-2" valueClassName="text-green-500" />
        )}

        {change < 0 && (
          <InfoRow label="KURANG" value={Math.abs(change).toLocaleString()} containerClassName="gap-2" valueClassName="text-destructive" />
        )}
      </View>

      <View>
        {/* Payment Input & Keypad */}
        <View>
          <View className="flex-row gap-x-2 items-center justify-end">
            <Text variant="muted">Rp</Text>
            <Text
              className={cn(
                !inputAmount && "text-muted-foreground/50",
                "m-2 font-mono-bold text-6xl"
              )}
            >
              {inputAmount ? parseInt(inputAmount).toLocaleString() : "0"}
            </Text>
          </View>

          {/* Keypad & Actions */}
          <View>
            {/* Grid Keypad */}
            <View className="px-2 gap-2">
              {KEYPAD_GRID.map((row, rowIndex) => (
                <View key={rowIndex} className="flex-row gap-2 h-16">
                  {row.map((cell, cellIndex) => {
                    if (cell === null) {
                      return <View key={cellIndex} className="flex-1" />
                    }

                    if (cell === "clear") {
                      return (
                        <Button
                          key={cellIndex}
                          variant="secondary"
                          onPress={handleClear}
                          className="flex-1"
                          textClassName="text-destructive text-3xl"
                          title="C"
                        ></Button>
                      )
                    }

                    if (cell === "backspace") {
                      return (
                        <Button
                          key={cellIndex}
                          variant="secondary"
                          onPress={handleBackspace}
                          className="flex-1"
                        >
                          <Icon
                            as={Delete}
                            className="text-foreground"
                            size={22}
                          />
                        </Button>
                      )
                    }

                    return (
                      <Button
                        key={cellIndex}
                        onPress={() => handlePressKey(cell)}
                        variant="secondary"
                        className="flex-1"
                        textClassName="text-3xl"
                        title={cell}
                      />
                    )
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="flex-row items-center justify-between h-14 p-2 gap-2">
          <Button
            title="DOI PAS"
            variant="outline"
            onPress={handleExactAmount}
            className="flex-1"
          />
          <Button
            title="LANJUT"
            onPress={handleProceed}
            disabled={!isValid}
            className="flex-1"
          />
        </View>
      </View>
    </View>
  )
}
