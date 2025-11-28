import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { SharedDetailContent } from "./shared-detail-content"
import { VariasiInfoDisplay } from "./variasi-info-display"
import type { PenjualanDetailRow } from "../api/ringkasan.service"

interface PenjualanRingkasanDetailProps {
  staffName: string
  tanggal: string
  jumlahTotal: number
  keterangan: string | null
  details: PenjualanDetailRow[]
}

export function PenjualanRingkasanDetail({
  staffName,
  tanggal,
  jumlahTotal,
  keterangan,
  details,
}: PenjualanRingkasanDetailProps) {
  const renderDetail = (item: PenjualanDetailRow) => (
    <>
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-2">
          <Text className="uppercase">{item.nama}</Text>
        </View>
        <Text>{item.jumlah_total.toLocaleString("id-ID")}</Text>
      </View>
      <View className="flex-row items-center gap-x-1">
        <Text variant="muted" className="uppercase text-sm">
          {item.qty} {item.satuan_utama}
        </Text>
        <Text className="text-accent">x</Text>
        <Text variant="muted" className="text-sm">
          {item.harga_jual.toLocaleString("id-ID")}
        </Text>
      </View>
      <VariasiInfoDisplay item={item} type="penjualan" />
    </>
  )

  return (
    <SharedDetailContent
      infoTitle="INFO TRANSAKSI"
      staffName={staffName}
      tanggal={tanggal}
      jumlahTotal={jumlahTotal}
      keterangan={keterangan}
      detailsTitle="STOK"
      details={details}
      renderDetail={renderDetail}
    />
  )
}
