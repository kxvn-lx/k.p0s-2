import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { useRouter } from "expo-router"
import { useState, useMemo, useCallback } from "react"
import useKeranjangStore from "./store/keranjang-store"
import PaymentKeypad from "./components/payment-keypad"
import { formatCurrency, formatDateTime, cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import { StatusMessage } from "@/components/shared/status-message"

export default function PembayaranScreen() {
    const router = useRouter()
    const items = useKeranjangStore((s) => s.items)

    const [inputAmount, setInputAmount] = useState("")

    const totalAmount = useMemo(() => {
        return Object.values(items).reduce(
            (sum, item) => sum + item.qty * item.harga_satuan,
            0
        )
    }, [items])

    const paymentAmount = parseInt(inputAmount || "0", 10)
    const change = paymentAmount - totalAmount
    const isValid = paymentAmount >= totalAmount

    const handlePressKey = useCallback((key: string) => {
        setInputAmount((prev) => {
            if (prev === "" && (key === "0" || key === "00" || key === "000")) return ""
            if (prev.length > 12) return prev // Limit length
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

    const handleProceed = useCallback(() => {
        if (!isValid) {
            toast.error("Pembayaran kurang")
            return
        }
        // TODO: Navigate to Selesai page
        toast.info("Navigasi ke Selesai (Belum dibuat)")
    }, [isValid])

    const itemCount = useMemo(() => Object.keys(items).length, [items])

    if (itemCount === 0) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <StatusMessage type="muted" message="KERANJANG KOSONG" />
                <Button
                    variant="ghost"
                    title="Kembali"
                    onPress={() => router.back()}
                    className="mt-4"
                />
            </View>
        )
    }

    return (
        <View className="flex-1 bg-background flex-col">
            {/* Header Info */}
            <View className="p-2 gap-2 flex-1">
                <View className="flex-row justify-between items-center">
                    <Text className="text-muted-foreground font-mono uppercase">TANGGAL</Text>
                    <Text className="font-medium font-mono">{formatDateTime(new Date())}</Text>
                </View>

                <View className="items-end gap-1 mt-4">
                    <Text className="text-muted-foreground text-sm font-mono uppercase">TOTAL TAGIHAN</Text>
                    <Text className="text-4xl font-bold text-primary font-mono">
                        {formatCurrency(totalAmount)}
                    </Text>
                </View>

                <Separator className="my-2" />

                <View className="items-end gap-1 justify-center bg-card/50 p-4 rounded-md border border-border/50">
                    <Text className="text-muted-foreground text-sm font-mono uppercase">BAYAR</Text>
                    <Text className={cn("text-3xl font-mono", !inputAmount && "text-muted-foreground")}>
                        {inputAmount ? formatCurrency(parseInt(inputAmount)) : "Rp 0"}
                    </Text>
                </View>

                <View className="items-end gap-1 mt-2">
                    <Text className="text-muted-foreground text-sm font-mono uppercase">KEMBALIAN</Text>
                    <Text className={cn("text-2xl font-bold font-mono", change < 0 ? "text-destructive" : "text-green-600")}>
                        {formatCurrency(change)}
                    </Text>
                </View>
            </View>

            {/* Keypad & Actions */}
            <View className="p-2 bg-card border-t border-border pb-8">
                <PaymentKeypad
                    onPress={handlePressKey}
                    onClear={handleClear}
                    onBackspace={handleBackspace}
                    className="mb-4"
                />

                <View className="flex-row gap-2 h-14">
                    <Button
                        className="flex-1 h-full"
                        variant="outline"
                        onPress={handleExactAmount}
                        title="UANG PAS"
                        textClassName="font-mono text-lg"
                    />
                    <Button
                        className="flex-1 h-full"
                        onPress={handleProceed}
                        disabled={!isValid}
                        title="LANJUT"
                        textClassName="font-mono text-lg font-bold"
                    />
                </View>
            </View>
        </View>
    )
}
