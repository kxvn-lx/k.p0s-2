// ----- IMPORTS -----
import { BottomSheetView } from "@gorhom/bottom-sheet"
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { View } from "react-native"
import SharedBottomSheetModal, {
  BottomSheetModalRef,
} from "@/components/shared/bottom-sheet-modal"
import InfoRow from "@/components/shared/info-row"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { Icon } from "@/components/ui/icon"
import { RotateCcw } from "lucide-react-native"
import type { BasketItem } from "../types/keranjang.types"
import { BottomSheetInput } from "@/components/ui/input"

// ----- TYPES -----
export type PerincianRubahModalRef = {
  present: (item: BasketItem) => void
  dismiss: () => void
}

type EditState = {
  item: BasketItem
  price: string
} | null

type PerincianRubahModalProps = {
  onSave: (item: BasketItem, newPrice: number) => void
}

// ----- CONSTANTS -----
const MAX_PRICE = 9_999_999

const sanitizeNumericInput = (value: string) => {
  let dotFound = false
  let sanitized = ""
  for (const char of value) {
    if (char === ".") {
      if (dotFound) continue
      dotFound = true
      sanitized += char
      continue
    }
    if (char >= "0" && char <= "9") {
      sanitized += char
    }
  }
  return sanitized
}

// ----- COMPONENT -----
const PerincianRubahModal = forwardRef<PerincianRubahModalRef, PerincianRubahModalProps>(
  ({ onSave }, ref) => {
    const modalRef = useRef<BottomSheetModalRef>(null)
    const inputRef = useRef<any>(null)
    const [editState, setEditState] = useState<EditState>(null)

    // ----- PUBLIC METHODS -----
    const present = useCallback((item: BasketItem) => {
      setEditState({
        item,
        price: item.harga_satuan.toString(),
      })
      setTimeout(() => {
        modalRef.current?.present()
      }, 0)
    }, [])

    const dismiss = useCallback(() => {
      modalRef.current?.dismiss()
      setEditState(null)
    }, [])

    useImperativeHandle(ref, () => ({ present, dismiss }), [present, dismiss])

    // ----- HANDLERS -----
    const handlePriceChange = useCallback(
      (text: string) => {
        if (!editState) return
        const cleaned = sanitizeNumericInput(text)
        if (cleaned === "") {
          setEditState({ ...editState, price: "" })
          return
        }
        const numericValue = Number.parseFloat(cleaned)
        if (!Number.isNaN(numericValue) && numericValue > MAX_PRICE) return
        setEditState({ ...editState, price: cleaned })
      },
      [editState]
    )

    const handleSave = useCallback(() => {
      if (!editState) return

      const newPrice = parseFloat(editState.price)
      if (isNaN(newPrice) || newPrice <= 0) {
        toast.error("Harga nmbole 0")
        return
      }

      onSave(editState.item, newPrice)
      dismiss()
    }, [editState, onSave, dismiss])

    const handleResetPrice = useCallback(() => {
      if (!editState) return
      setEditState({ ...editState, price: editState.item.harga_satuan.toString() })
    }, [editState])

    if (!editState) return null

    const parsedNewPrice = Number.parseFloat(editState.price)
    const hasValidNewPrice = !Number.isNaN(parsedNewPrice) && parsedNewPrice > 0
    const deltaValue = hasValidNewPrice
      ? parsedNewPrice - editState.item.harga_satuan
      : 0
    const deltaColorClass = hasValidNewPrice
      ? deltaValue >= 0
        ? "text-primary"
        : "text-destructive"
      : "text-muted-foreground"
    const maxPriceLabel = MAX_PRICE.toLocaleString("id-ID")

    return (
      <SharedBottomSheetModal
        ref={modalRef}
        headerTitle={editState.item.stock.nama}
        snapPoints={["80%"]}
        onClose={dismiss}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        enableBlurKeyboardOnGesture
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView className="flex-1 gap-y-4">
          <View className="bg-card">
            <InfoRow
              leadingElement="Harga skrg"
              trailingElement={editState.item.harga_satuan.toLocaleString("id-ID")}
              primarySide="trailing"
            />
            <InfoRow
              leadingElement="Harga baru"
              trailingElement={
                hasValidNewPrice ? parsedNewPrice.toLocaleString("id-ID") : "-"
              }
              primarySide="trailing"
            />
            <InfoRow
              leadingElement="Selisih"
              trailingElement={
                <Text className={deltaColorClass}>
                  {hasValidNewPrice
                    ? `${deltaValue >= 0 ? "+" : "-"}${Math.abs(deltaValue).toLocaleString("id-ID")}`
                    : "-"}
                </Text>
              }
              isLast
              primarySide="trailing"
            />
          </View>

          <View className="bg-card">
            <InfoRow
              leadingElement={
                <View className="flex-row items-center gap-2">
                  <Text variant="muted">
                    GANTI HARGA
                  </Text>
                  <Text variant="muted" className="text-xs">Maks. {maxPriceLabel}</Text>
                </View>
              }
              primarySide="trailing"
              isLast
              trailingElement={
                <View className="items-end">
                  <View className="flex-row items-center gap-x-2">
                    <BottomSheetInput
                      ref={inputRef}
                      value={editState.price}
                      onChangeText={handlePriceChange}
                      keyboardType="numeric"
                      autoFocus
                      placeholder="0"
                      className="border-none w-32 text-right"
                    />
                    {editState.price !== editState.item.harga_satuan.toString() && (
                      <Button
                        variant="outline"
                        onPress={handleResetPrice}
                        size="sm"
                      >
                        <Icon
                          as={RotateCcw}
                          size={16}
                          className="text-muted-foreground"
                        />
                      </Button>
                    )}
                  </View>
                </View>
              }
            />
          </View>

          <View className="flex-row gap-x-2 p-2">
            <Button
              variant="outline"
              title="BATAL"
              onPress={dismiss}
              className="flex-1"
            />
            <Button title="SIMPAN" onPress={handleSave} className="flex-1" />
          </View>
        </BottomSheetView>
      </SharedBottomSheetModal>
    )
  }
)

PerincianRubahModal.displayName = "PerincianRubahModal"

export default PerincianRubahModal
