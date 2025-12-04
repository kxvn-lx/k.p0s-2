import { View, StyleSheet } from "react-native"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { Text } from "@/components/ui/text"
import { Input } from "@/components/ui/input"
import InfoRow from "@/components/shared/info-row"
import SwipeActionButton from "@/components/shared/swipe-action-button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select"
import Swipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import Animated, { LinearTransition, type SharedValue } from "react-native-reanimated"
import { Trash2, ChevronDown } from "lucide-react-native"
import type { PengeluaranKategori, PengeluaranDetailItem } from "../types/pengeluaran.types"
import { PENGELUARAN_KATEGORI_OPTIONS } from "../types/pengeluaran.types"
import type { Option } from "@rn-primitives/select"

// ----- Types -----
interface PengeluaranItemFormProps {
  item: PengeluaranDetailItem
  onUpdate: (id: string, updates: Partial<Omit<PengeluaranDetailItem, "id">>) => void
  onRemove: (id: string) => void
  onSwipeOpen?: (ref: PengeluaranItemFormRef) => void
}

export type PengeluaranItemFormRef = {
  close: () => void
}

// ----- Constants -----
const KATEGORI_LABELS: Record<PengeluaranKategori, string> = {
  PARKIR: "Parkir",
  BENSIN: "Bensin",
  LAINNYA: "Lainnya",
}

// ----- Component -----
const PengeluaranItemForm = forwardRef<PengeluaranItemFormRef, PengeluaranItemFormProps>(
  ({ item, onUpdate, onRemove, onSwipeOpen }, forwardedRef) => {
    const swipeableRef = useRef<SwipeableMethods>(null)

    // ----- Expose Methods -----
    const rowApi = { close: () => swipeableRef.current?.close() }
    useImperativeHandle(forwardedRef, () => rowApi)

    // ----- Handlers -----
    const handleKategoriChange = (option: Option) => {
      option && onUpdate(item.id, { kategori: option.value as PengeluaranKategori })
    }

    const handleJumlahChange = (text: string) => {
      const cleaned = text.replace(/[^0-9]/g, "")
      const numericValue = cleaned === "" ? 0 : parseInt(cleaned, 10)
      onUpdate(item.id, { jumlah_total: numericValue })
    }

    const handleKeteranganChange = (text: string) => {
      onUpdate(item.id, { keterangan: text || null })
    }

    const handleDelete = () => {
      onRemove(item.id)
      swipeableRef.current?.close()
    }

    const handleSwipeWillOpen = () => {
      onSwipeOpen?.(rowApi)
    }

    // ----- Render Right Actions -----
    const renderRightActions = (
      _progress: SharedValue<number>,
      _translation: SharedValue<number>,
      _swipeableMethods: SwipeableMethods
    ) => (
      <View style={styles.actionsContainer}>
        <SwipeActionButton
          label="HAPUS"
          icon={Trash2}
          variant="destructive"
          onPress={handleDelete}
        />
      </View>
    )

    return (
      <Animated.View layout={LinearTransition.springify()}>
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          friction={2}
          onSwipeableWillOpen={handleSwipeWillOpen}
        >
          <View className="bg-card">
            {/* Kategori Row */}
            <Select
              value={{ value: item.kategori, label: KATEGORI_LABELS[item.kategori] }}
              onValueChange={handleKategoriChange}
            >
              <SelectTrigger className="h-auto w-full rounded-none !bg-card p-0 row-pressable border-none border-0">
                <InfoRow
                  leadingElement="KATEGORI"
                  trailingElement={KATEGORI_LABELS[item.kategori]}
                  trailingIcon={ChevronDown}
                  primarySide="trailing"
                />
              </SelectTrigger>
              <SelectContent align="end">
                {PENGELUARAN_KATEGORI_OPTIONS.map((option, index) => (
                  <View key={option.value}>
                    {index > 0 && <SelectSeparator />}
                    <SelectItem label={option.label} value={option.value}>
                      {option.label}
                    </SelectItem>
                  </View>
                ))}
              </SelectContent>
            </Select>

            {/* Jumlah Row */}
            <InfoRow
              leadingElement="JUMLAH"
              primarySide="trailing"
              trailingElement={
                <Input
                  className="border-none w-32 text-right"
                  value={item.jumlah_total > 0 ? item.jumlah_total.toString() : ""}
                  onChangeText={handleJumlahChange}
                  keyboardType="numeric"
                  placeholder="0"
                />
              }
            />

            {/* Keterangan Row */}
            <InfoRow
              leadingElement="CATATAN"
              primarySide="trailing"
              isLast
              trailingElement={
                <Input
                  className="border-none w-40 text-right"
                  value={item.keterangan ?? ""}
                  onChangeText={handleKeteranganChange}
                  placeholder="opsional..."
                />
              }
            />
          </View>
        </Swipeable>
      </Animated.View>
    )
  }
)

PengeluaranItemForm.displayName = "PengeluaranItemForm"

// ----- Styles -----
const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
})

export { PengeluaranItemForm }
