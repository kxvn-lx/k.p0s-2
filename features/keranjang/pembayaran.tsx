// ----- IMPORTS -----
import { View } from "react-native"
import { useState, useMemo, useCallback, useRef } from "react"
import { useRouter } from "expo-router"
import { Delete } from "lucide-react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import InfoRow from "@/components/shared/info-row"
import useKeranjangStore from "./store/keranjang-store"
import { useAuth } from "@/lib/auth-context"
import { formatDateTime, cn } from "@/lib/utils"
import { usePenjualanMutation } from "@/features/penjualan/hooks/use-penjualan-mutation"
import { ProgressDialog } from "@/features/penjualan/components/progress-dialog"

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
  const { user } = useAuth()
  const items = useKeranjangStore((s) => s.items)
  const reset = useKeranjangStore((s) => s.reset)
  const [inputAmount, setInputAmount] = useState("")
  const pendingResult = useRef<Parameters<typeof router.replace>[0] | null>(null)
  const {
    mutateAsync: createPenjualan,
    isProcessing,
    dialogVisible,
    progress,
    closeDialogAndNavigate,
  } = usePenjualanMutation()

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
    if (!isValid || isProcessing) return

    try {
      const result = await createPenjualan({
        staffId: user?.id ?? "unknown",
        staffName: user?.email ?? "Staff",
        items,
        cashReceived: paymentAmount,
        tanggal: new Date().toISOString(),
      })

      reset()

      pendingResult.current = {
        pathname: "/(authenticated)/keranjang/selesai",
        params: { result: JSON.stringify(result) },
      }

      closeDialogAndNavigate(() => {
        if (pendingResult.current) router.replace(pendingResult.current)
      })
    } catch {
      //
    }
  }, [isValid, isProcessing, items, user, paymentAmount, reset, router, createPenjualan, closeDialogAndNavigate])

  // ----- RENDER -----
  return (
    <View className="flex-1 bg-background flex-col justify-between">
      {/* Progress Dialog */}
      <ProgressDialog visible={dialogVisible} progress={progress} />

      {/* Header Info  */}
      <View className="">
        <InfoRow 
          leadingElement="TANGGAL" 
          trailingElement={formatDateTime(new Date())} 
          className="bg-transparent p-2 pl-2 min-h-0"
        />

        <InfoRow 
          leadingElement="TOTAL" 
          trailingElement={totalAmount.toLocaleString()} 
          className="bg-transparent p-2 pl-2 min-h-0 gap-2"
        />

        {change > 0 && (
          <InfoRow 
            leadingElement="KEMBALIAN" 
            trailingElement={<Text className="text-green-500">{change.toLocaleString()}</Text>} 
            className="bg-transparent p-2 pl-2 min-h-0 gap-2"
          />
        )}

        {change < 0 && (
          <InfoRow 
            leadingElement="KURANG" 
            trailingElement={<Text className="text-destructive">{Math.abs(change).toLocaleString()}</Text>} 
            className="bg-transparent p-2 pl-2 min-h-0 gap-2"
          />
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
            disabled={isProcessing}
          />
          <Button
            title={isProcessing ? "MEMPROSES..." : "LANJUT"}
            onPress={handleProceed}
            disabled={!isValid || isProcessing}
            className="flex-1"
          />
        </View>
      </View>
    </View>
  )
}
