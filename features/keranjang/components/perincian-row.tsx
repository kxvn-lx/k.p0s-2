import { View } from "react-native"
import PerincianItem from "@/components/shared/perincian-item"
import type { BasketItem } from "@/features/keranjang/types/keranjang.types"
import { forwardRef, useImperativeHandle } from "react"

// ----- TYPES -----
type PerincianRowProps = {
  item: BasketItem
  onDelete?: () => void
  onEdit?: () => void
  onSwipeOpen?: (ref: PerincianRowRef) => void
}

export type PerincianRowRef = {
  close: () => void
}

// ----- COMPONENT -----
const PerincianRow = forwardRef<PerincianRowRef, PerincianRowProps>(
  ({ item, onDelete, onEdit, onSwipeOpen }, forwardedRef) => {
    const { stock, qty, harga_satuan, variasi_harga_id, harga_satuan_asal } = item

    const isVariasiHarga = !!variasi_harga_id
    const hasEditedPrice = harga_satuan_asal !== undefined && harga_satuan_asal !== harga_satuan
    const originalPrice = hasEditedPrice ? harga_satuan_asal : stock.harga_jual ?? 0
    const totalPrice = qty * harga_satuan

    // ----- EXPOSE METHODS -----
    const rowApi = { close: () => { } }

    useImperativeHandle(forwardedRef, () => rowApi)

    return (
      <View className="p-2 bg-card">
        <PerincianItem
          testID={`perincian-row-${stock.id}`}
          name={stock.nama}
          qty={qty}
          unit={stock.satuan_utama ?? ""}
          price={harga_satuan}
          originalPrice={originalPrice}
          isVariation={isVariasiHarga || hasEditedPrice}
          total={totalPrice}
        />
      </View>
    )
  }
)

PerincianRow.displayName = "PerincianRow"

export default PerincianRow
