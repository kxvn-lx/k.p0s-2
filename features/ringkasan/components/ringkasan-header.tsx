import { View } from "react-native"
import { useCallback, useRef } from "react"
import { useRouter } from "expo-router"
import { startOfDay } from "date-fns"
import type { RingkasanHeaderData } from "../hooks/ringkasan.queries"
import { useRole } from "@/lib/hooks/use-role"
import { Text } from "@/components/ui/text"
import InfoRow from "@/components/shared/info-row"
import TimPenjualanModal, { type TimPenjualanModalRef } from "./tim-penjualan-modal"

// ----- Types -----
interface RingkasanHeaderProps {
  data: RingkasanHeaderData
  currentDate: Date
  isLoadingTimPenjualan?: boolean
}

// ----- Component -----
export function RingkasanHeader({
  data,
  currentDate,
  isLoadingTimPenjualan = false,
}: RingkasanHeaderProps) {
  const router = useRouter()
  const { isAdmin } = useRole()
  const modalRef = useRef<TimPenjualanModalRef>(null)

  const { summary, timPenjualan } = data

  // ----- Handlers -----
  const handleAddPengeluaran = useCallback(() => {
    router.push("/ringkasan/tambah-pengeluaran")
  }, [router])

  const handleTimPenjualanPress = useCallback(() => {
    if (!isAdmin) return
    // Calculate dateKey the same way as useRingkasanData
    const startDate = startOfDay(currentDate).toISOString()
    const dateKey = startDate.split("T")[0]
    modalRef.current?.present(currentDate, dateKey, timPenjualan)
  }, [isAdmin, currentDate, timPenjualan])

  // ----- Render Helpers -----
  const renderTimPenjualanTrailing = () => {
    if (isLoadingTimPenjualan) {
      return "..."
    }

    if (!timPenjualan) {
      return "Nd Ada"
    }

    const staffName = timPenjualan.staff_name.split("@")[0].toUpperCase()
    return `${staffName} & ${timPenjualan.rekan.toUpperCase()}`
  }

  return (
    <>
      <View className="bg-card overflow-hidden">
        {/* Main Header / Net Position */}
        <InfoRow
          leadingElement="PENJUALAN BERSIH"
          trailingElement={summary.netPenjualan.toLocaleString("id-ID")}
          primarySide="trailing"
        />

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
          onPress={handleAddPengeluaran}
        />

        <InfoRow
          leadingElement="PEMBELIAN"
          trailingElement={summary.pembelian.toLocaleString("id-ID")}
          primarySide="trailing"
        />

        {/* Tim Penjualan Row */}
        <InfoRow
          leadingElement="TIM PENJUALAN"
          trailingElement={renderTimPenjualanTrailing()}
          primarySide="trailing"
          onPress={isAdmin ? handleTimPenjualanPress : undefined}
          isLast
        />
      </View>

      {/* Tim Penjualan Modal (admin only) */}
      {isAdmin && <TimPenjualanModal ref={modalRef} />}
    </>
  )
}
