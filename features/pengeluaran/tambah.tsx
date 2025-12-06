import { View, FlatList, Keyboard } from "react-native"
import { useMemo, useCallback, useRef } from "react"
import { useRouter } from "expo-router"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionHeader } from "@/components/ui/section-header"
import InfoRow from "@/components/shared/info-row"
import { formatDateTime } from "@/lib/utils"
import { useAuth } from "@/lib/context/auth-context"
import { useCloseSwipeableOnScroll } from "@/lib/hooks/use-close-swipeable-on-scroll"
import usePengeluaranStore from "./store/pengeluaran-store"
import { PengeluaranItemForm } from "./components/pengeluaran-item-form"
import { ProgressDialog } from "./components/progress-dialog"
import { usePengeluaranMutation } from "./hooks/use-pengeluaran-mutation"
import type { PengeluaranDetailItem } from "./types/pengeluaran.types"
import { Separator } from "@/components/ui/separator"

// ----- Component -----
export default function TambahPengeluaran() {
  const router = useRouter()
  const { user } = useAuth()
  const pendingNavigate = useRef<boolean>(false)

  // ----- Swipeable Management -----
  const { handleSwipeOpen, closeOpenRow } = useCloseSwipeableOnScroll()

  // ----- Store -----
  const tanggal = usePengeluaranStore((s) => s.tanggal)
  const keterangan = usePengeluaranStore((s) => s.keterangan)
  const items = usePengeluaranStore((s) => s.items)
  const setKeterangan = usePengeluaranStore((s) => s.setKeterangan)
  const addItem = usePengeluaranStore((s) => s.addItem)
  const updateItem = usePengeluaranStore((s) => s.updateItem)
  const removeItem = usePengeluaranStore((s) => s.removeItem)
  const reset = usePengeluaranStore((s) => s.reset)

  // ----- Mutation -----
  const {
    mutateAsync: createPengeluaran,
    isProcessing,
    dialogVisible,
    progress,
    closeDialogAndNavigate,
  } = usePengeluaranMutation()

  // ----- Derived State -----
  const itemsList = useMemo(() => Object.values(items), [items])
  const totalPengeluaran = useMemo(
    () => itemsList.reduce((sum, item) => sum + item.jumlah_total, 0),
    [itemsList]
  )
  const itemCount = itemsList.length
  const hasValidItems = itemsList.some((item) => item.jumlah_total > 0)

  // ----- Handlers -----
  const handleAddItem = useCallback(() => {
    addItem("LAINNYA", 0, null)
  }, [addItem])

  const handleCancel = useCallback(() => {
    reset()
    router.back()
  }, [reset, router])

  const handleSubmit = useCallback(async () => {
    if (!hasValidItems || isProcessing) return

    try {
      await createPengeluaran({
        tanggal: tanggal.toISOString(),
        keterangan: keterangan || null,
        staffId: user?.id ?? "unknown",
        staffName: user?.email ?? "Staff",
        items: itemsList.filter((item) => item.jumlah_total > 0),
      })

      reset()
      pendingNavigate.current = true

      closeDialogAndNavigate(() => {
        if (pendingNavigate.current) {
          router.back()
        }
      })
    } catch {
      // Error handled by mutation hook
    }
  }, [
    hasValidItems,
    isProcessing,
    tanggal,
    keterangan,
    itemsList,
    user,
    reset,
    router,
    createPengeluaran,
    closeDialogAndNavigate,
  ])

  // ----- Render Item -----
  const renderItem = useCallback(
    ({ item }: { item: PengeluaranDetailItem }) => (
      <PengeluaranItemForm
        item={item}
        onUpdate={updateItem}
        onRemove={removeItem}
        onSwipeOpen={handleSwipeOpen}
      />
    ),
    [updateItem, removeItem, handleSwipeOpen]
  )

  const keyExtractor = useCallback((item: PengeluaranDetailItem) => item.id, [])

  // ----- Render -----
  return (
    <View className="flex-1 bg-background gap-4">
      {/* Progress Dialog */}
      <ProgressDialog visible={dialogVisible} progress={progress} />

      {/* Header Info Card */}
      <View className="bg-card">
        <InfoRow
          leadingElement="TANGGAL"
          trailingElement={formatDateTime(tanggal, true)}
          primarySide="trailing"
        />
        <InfoRow
          leadingElement="TOTAL"
          trailingElement={
            <Text className={totalPengeluaran > 0 ? "text-[#da2f8b]" : "text-muted-foreground"}>
              {totalPengeluaran > 0 ? "-" : ""}
              {totalPengeluaran.toLocaleString("id-ID")}
            </Text>
          }
          primarySide="trailing"
        />
        <InfoRow
          primarySide="trailing"
          isLast
          leadingElement="KETERANGAN"
          trailingElement={
            <Input
              className="border-none w-48"
              value={keterangan}
              onChangeText={setKeterangan}
              placeholder="catatan..."
            />
          }
        />
      </View>

      {/* Items List */}
      <View className="flex-1">
        <SectionHeader
          title="DAFTAR PENGELUARAN"
          secondary={`${itemCount} ITEM`}
        />

        <FlatList
          data={itemsList}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Separator className="my-2 bg-transparent" />}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => {
            Keyboard.dismiss()
            closeOpenRow()
          }}
          ListFooterComponent={
            <Button
              variant="ghost"
              className="m-2"
              onPress={handleAddItem}
              title="+ TAMBAH ITEM"
            />
          }
          ListEmptyComponent={
            <View className="items-center py-8">
              <Text variant="muted" className="uppercase">
                Belum ada pengeluaran
              </Text>
            </View>
          }
        />
      </View>

      {/* Footer Actions - same as keranjang */}
      <View className="bg-card border-t border-border p-2 flex-col gap-y-2">
        <View className="flex-row items-center justify-between">
          <Text>ITEM: {itemCount}</Text>
          <Button
            variant="bare"
            size="bare"
            onPress={handleCancel}
            disabled={!itemCount}
            textClassName="text-destructive"
            title="BATAL"
          />
        </View>

        <Button
          onPress={handleSubmit}
          disabled={!hasValidItems || isProcessing}
          title={isProcessing ? "MENYIMPAN..." : "SIMPAN"}
        />
      </View>
    </View>
  )
}
