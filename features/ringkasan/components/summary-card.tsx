import { View } from "react-native"
import type { RingkasanSummary } from "../hooks/ringkasan.queries"
// no local utility used
import InfoRow from "@/components/shared/info-row"

interface SummaryCardProps {
    summary: RingkasanSummary
}

export function SummaryCard({ summary }: SummaryCardProps) {
    return (
        <View className="bg-card overflow-hidden">
            {/* Main Header / Net Position */}
            <InfoRow leadingElement="PENJUALAN BERSIH" trailingElement={summary.netPenjualan.toLocaleString("id-ID")} primarySide="trailing" />
            {/* Stats List */}
            <InfoRow
                leadingElement="KOTOR"
                trailingElement={summary.grossPenjualan.toLocaleString("id-ID")}
                primarySide="trailing"
            />

            <InfoRow
                leadingElement="PENGELUARAN"
                trailingElement={summary.pengeluaran.toLocaleString("id-ID")}
                primarySide="trailing"
            />

            <InfoRow
                leadingElement="PEMBELIAN"
                trailingElement={summary.pembelian.toLocaleString("id-ID")}
                primarySide="trailing"
                isLast
            />
        </View>
    )
}
