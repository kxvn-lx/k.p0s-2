import React, { useRef, useCallback, useMemo } from "react"
import { View, ScrollView } from "react-native"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/utils"
import InfoRow from "@/components/shared/info-row"
import { Separator } from "@/components/ui/separator"
import { SectionHeader } from "@/components/ui/section-header"
import SharedBottomSheetModal, { type BottomSheetModalRef } from "@/components/shared/bottom-sheet-modal"
import { ReceiptPreview } from "@/components/shared/receipt-preview"
import { usePrint } from "@/features/keranjang/hooks/use-print"
import { toast } from "@/lib/store/toast-store"
import type { PenjualanResult } from "@/features/keranjang/types/penjualan-result.types"
import type { PenjualanDetailRow } from "../api/ringkasan.service"

// ----- Types -----
interface ReceiptData {
    penjualanId: string
    details: PenjualanDetailRow[]
}

interface SharedDetailContentProps<T> {
    infoTitle: string
    staffName: string
    tanggal: string
    jumlahTotal: number
    keterangan?: string | null
    detailsTitle: string
    details: T[]
    idExtractor: (item: T) => string
    renderDetail: (item: T) => React.ReactElement
    receiptData?: ReceiptData
}

// ----- Component -----
export function SharedDetailContent<T>({
    infoTitle,
    staffName,
    tanggal,
    jumlahTotal,
    keterangan,
    detailsTitle,
    details,
    idExtractor,
    renderDetail,
    receiptData,
}: SharedDetailContentProps<T>) {
    const modalRef = useRef<BottomSheetModalRef>(null)
    const { selectedPrinter, printReceipt, isPrinting } = usePrint()

    // ----- Build PenjualanResult for receipt -----
    const penjualanResult = useMemo<PenjualanResult | null>(() => {
        if (!receiptData) return null
        return {
            penjualan: {
                id: receiptData.penjualanId,
                tanggal,
                jumlah_total: jumlahTotal,
                staff_id: "",
                staff_name: staffName,
                keterangan: keterangan ?? null,
                created_at: tanggal,
                updated_at: tanggal,
            },
            details: receiptData.details,
            payment: { cashReceived: jumlahTotal, change: 0 },
        }
    }, [receiptData, tanggal, jumlahTotal, staffName, keterangan])

    const handleViewReceipt = useCallback(() => modalRef.current?.present(), [])

    const handlePrint = useCallback(async () => {
        if (!penjualanResult) return

        const result = await printReceipt(penjualanResult, selectedPrinter)
        if (result.success) {
            toast.success("Berhasil", "Struk berhasil dicetak")
        } else if (result.error) {
            toast.error("Gagal Mencetak", result.error.message)
        }
    }, [penjualanResult, selectedPrinter, printReceipt])

    return (
        <View className="flex-1 bg-background">
            <ScrollView className="flex-1">
                <View className="gap-4">
                    <View>
                        <SectionHeader title={infoTitle} />
                        <View className="bg-card">
                            <InfoRow
                                primarySide="trailing"
                                leadingElement="STAFF"
                                trailingElement={<Text className="uppercase text-foreground">{staffName}</Text>}
                            />
                            <InfoRow
                                primarySide="trailing"
                                leadingElement="TANGGAL"
                                trailingElement={<Text className="uppercase text-foreground">{formatDateTime(tanggal, true, true)}</Text>}
                            />
                            <InfoRow
                                leadingElement="TOTAL"
                                trailingElement={jumlahTotal.toLocaleString("id-ID")}
                                primarySide="trailing"
                            />
                            <InfoRow leadingElement="KETERANGAN" trailingElement={keterangan ?? "-"} primarySide="trailing" />
                        </View>
                    </View>

                    <View>
                        <SectionHeader title={detailsTitle} secondary={`${details.length} ITEM`} />
                        {details.map((item, index) => (
                            <View key={idExtractor(item)}>
                                {index > 0 && <Separator />}
                                <View>{renderDetail(item)}</View>
                            </View>
                        ))}
                    </View>

                    {/* ----- Receipt Actions (penjualan only) ----- */}
                    {receiptData && (
                        <View className="flex-row gap-2 p-4">
                            <View className="flex-1">
                                <Button variant="outline" title="LIHAT STRUK" onPress={handleViewReceipt} />
                            </View>
                            <View className="flex-1">
                                <Button
                                    variant="outline"
                                    title={isPrinting ? "Mencetak..." : "CETAK"}
                                    onPress={handlePrint}
                                    disabled={isPrinting || !selectedPrinter}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* ----- Receipt Preview Bottom Sheet ----- */}
            <SharedBottomSheetModal ref={modalRef} snapPoints={["75%"]} headerTitle="Struk" containerClassName="pt-2">
                {penjualanResult && <ReceiptPreview result={penjualanResult} />}
            </SharedBottomSheetModal>
        </View>
    )
}