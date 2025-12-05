import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { View, Alert } from "react-native"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { ChevronDown } from "lucide-react-native"
import SharedBottomSheetModal, {
  BottomSheetModalRef,
} from "@/components/shared/bottom-sheet-modal"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import InfoRow from "@/components/shared/info-row"
import PressableRow from "@/components/shared/pressable-row"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  NativeSelectScrollView,
  type Option,
  SelectSeparator,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  useTimPenjualanMutations,
  type TimPenjualanHarianRow,
} from "../hooks/ringkasan.queries"
import { STAFF, REKAN } from "@/features/ringkasan/api/staff.service"
import { formatDateTime } from "@/lib/utils"

// ----- Options -----
const STAFF_OPTIONS = STAFF.map((s) => ({ value: s.id, label: s.name }))
const REKAN_OPTIONS = REKAN.map((name) => ({ value: name, label: name }))

// ----- Types -----
export type TimPenjualanModalRef = {
  present: (date: Date, dateKey: string, existing?: TimPenjualanHarianRow | null) => void
  dismiss: () => void
}

type ModalState = {
  date: Date
  dateKey: string
  existing: TimPenjualanHarianRow | null
  staff: Option | undefined
  rekan: Option | undefined
} | null

// ----- Component -----
const TimPenjualanModal = forwardRef<TimPenjualanModalRef, object>((_, ref) => {
  const modalRef = useRef<BottomSheetModalRef>(null)
  const [state, setState] = useState<ModalState>(null)

  const mutations = useTimPenjualanMutations(state?.dateKey ?? "", state?.date ?? new Date())
  const isPending = mutations.create.isPending || mutations.update.isPending || mutations.delete.isPending

  // ----- Derived State -----
  const isEditing = !!state?.existing
  const isValid = useMemo(
    () => !!state?.staff?.value && !!state?.rekan?.value,
    [state?.staff, state?.rekan]
  )

  // ----- Public Methods -----
  const present = useCallback((date: Date, dateKey: string, existing?: TimPenjualanHarianRow | null) => {
    const initialStaff = existing
      ? STAFF_OPTIONS.find(o => o.value === existing.staff_id) ?? { value: existing.staff_id, label: existing.staff_name }
      : undefined
    const initialRekan = existing
      ? REKAN_OPTIONS.find(o => o.value === existing.rekan) ?? { value: existing.rekan, label: existing.rekan }
      : undefined

    setState({
      date,
      dateKey,
      existing: existing ?? null,
      staff: initialStaff,
      rekan: initialRekan,
    })

    // Delay present() to allow the modal to be fully mounted and laid out
    // gorhom's BottomSheetModal needs the native component to be ready before animate
    requestAnimationFrame(() => {
      modalRef.current?.present()
    })
  }, [])

  const dismiss = useCallback(() => {
    modalRef.current?.dismiss()
    setState(null)
  }, [])

  useImperativeHandle(ref, () => ({ present, dismiss }), [present, dismiss])

  // ----- Handlers -----
  const handleStaffChange = useCallback((option: Option) => {
    setState(prev => prev ? { ...prev, staff: option } : null)
  }, [])

  const handleRekanChange = useCallback((option: Option) => {
    setState(prev => prev ? { ...prev, rekan: option } : null)
  }, [])

  const handleSave = useCallback(async () => {
    if (!state || !isValid) return

    const staff = STAFF.find(s => s.id === state.staff!.value)

    const payload = {
      staffId: state.staff!.value,
      staffName: staff?.name ?? state.staff!.label ?? "Unknown",
      rekan: state.rekan!.value,
    }

    try {
      if (isEditing && state.existing) {
        await mutations.update.mutateAsync({ id: state.existing.id, ...payload })
        toast.success("TIM DIPERBARUI")
      } else {
        await mutations.create.mutateAsync(payload)
        toast.success("TIM TASIMPAN")
      }
      dismiss()
    } catch (error) {
      console.error("Tim Penjualan save error:", error)
      const pgError = error as { message?: string; code?: string; details?: string }
      toast.error("Gagal", pgError.message || "Gagal menyimpan")
    }
  }, [state, isValid, isEditing, mutations, dismiss])

  const handleDelete = useCallback(() => {
    if (!state?.existing) return

    Alert.alert(
      "HAPUS TIM",
      undefined,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await mutations.delete.mutateAsync(state.existing!.id)
              toast.success("TIM TAHAPUS")
              dismiss()
            } catch (error) {
              console.error("Tim Penjualan delete error:", error)
              const pgError = error as { message?: string }
              toast.error("Gagal", pgError.message || "Gagal menghapus")
            }
          },
        },
      ]
    )
  }, [state?.existing, mutations, dismiss])

  if (!state) return null

  return (
    <SharedBottomSheetModal
      ref={modalRef}
      headerTitle="Tim Penjualan"
      snapPoints={["55%"]}
      onClose={dismiss}
    >
      <BottomSheetView className="flex-1 gap-y-4">
        {/* Info Section */}
        <View className="bg-card overflow-hidden">
          <InfoRow
            leadingElement="TANGGAL"
            trailingElement={formatDateTime(state.date, false, true)}
            primarySide="trailing"
            isLast
          />
        </View>

        <View className="flex-1">
          {/* Staff Selection */}
          <View className="bg-card">
            <Select value={state.staff} onValueChange={handleStaffChange}>
              <SelectTrigger
                asChild
                className="h-auto w-full rounded-none !bg-card p-0 border-none border-0"
              >
                <PressableRow>
                  <InfoRow
                    leadingElement="Staff"
                    trailingElement={state.staff?.label || "Pilih staff"}
                    trailingIcon={ChevronDown}
                  />
                </PressableRow>
              </SelectTrigger>
              <SelectContent align="end" insets={{ right: 8 }}>
                {STAFF_OPTIONS.map((option, index) => (
                  <View key={option.value}>
                    <SelectItem value={option.value} label={option.label} />
                    {index < STAFF_OPTIONS.length - 1 && <SelectSeparator />}
                  </View>
                ))}
              </SelectContent>
            </Select>
          </View>

          {/* Rekan Selection */}
          <View className="bg-card">
            <Select value={state.rekan} onValueChange={handleRekanChange}>
              <SelectTrigger
                asChild
                className="h-auto w-full rounded-none !bg-card p-0 border-none border-0"
              >
                <PressableRow>
                  <InfoRow
                    leadingElement="Rekan"
                    trailingElement={state.rekan?.label || "Pilih rekan"}
                    trailingIcon={ChevronDown}
                    isLast
                  />
                </PressableRow>
              </SelectTrigger>
              <SelectContent align="end" insets={{ right: 8 }}>
                {REKAN_OPTIONS.map((option, index) => (
                  <View key={option.value}>
                    <SelectItem value={option.value} label={option.label} />
                    {index < REKAN_OPTIONS.length - 1 && <SelectSeparator />}
                  </View>
                ))}
              </SelectContent>
            </Select>
          </View>
        </View>

        {/* Actions */}
        <View className="-mt-4 gap-2 p-2">
          {isEditing && (
            <Button
              variant="ghost"
              title="HAPUS TIM PENJUALAN"
              onPress={handleDelete}
              textClassName="text-destructive"
              disabled={isPending}
            />
          )}

          <View className="flex-row gap-2">
            <Button
              variant="outline"
              title="BATAL"
              onPress={dismiss}
              className="flex-1"
              disabled={isPending}
            />
            <Button
              title={isPending ? "MENYIMPAN..." : isEditing ? "PERBARUI" : "SIMPAN"}
              onPress={handleSave}
              className="flex-1"
              disabled={!isValid || isPending}
            />
          </View>
        </View>
      </BottomSheetView>
    </SharedBottomSheetModal>
  )
})

TimPenjualanModal.displayName = "TimPenjualanModal"

export default TimPenjualanModal
