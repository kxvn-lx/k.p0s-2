import { View } from "react-native"
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list"
import { Text } from "@/components/ui/text"
import type { TransactionItem } from "../hooks/ringkasan.queries"
import { format, isToday, isYesterday } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "expo-router"
import { useMemo } from "react"
import { cn, formatDateTime } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"
import { ChevronRight } from "lucide-react-native"
import PressableRow from "@/components/shared/pressable-row"

interface TransactionListProps {
  transactions: TransactionItem[]
  isLoading: boolean
}

type ListItem =
  | { type: "header"; title: string; id: string }
  | {
    type: "item"
    data: TransactionItem
    isFirst: boolean
    isLast: boolean
  }

export function TransactionList({
  transactions,
  isLoading,
}: TransactionListProps) {
  const router = useRouter()

  const handlePress = (item: TransactionItem) => {
    router.push(`/ringkasan/rincian?id=${item.id}&type=${item.type}`)
  }

  const flattenedData = useMemo(() => {
    const groups: Record<string, TransactionItem[]> = {}

    transactions.forEach((item) => {
      const date = new Date(item.tanggal)
      let key = format(date, "d MMMM yyyy", { locale: id })
      if (isToday(date)) key = "Hari Ini"
      if (isYesterday(date)) key = "Kemarin"

      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })

    const result: ListItem[] = []
    Object.entries(groups).forEach(([title, items]) => {
      result.push({ type: "header", title, id: `header-${title}` })
      items.forEach((item, index) => {
        result.push({
          type: "item",
          data: item,
          isFirst: index === 0,
          isLast: index === items.length - 1,
        })
      })
    })

    return result
  }, [transactions])

  const stickyHeaderIndices = useMemo(() => {
    return flattenedData
      .map((item, index) => (item.type === "header" ? index : -1))
      .filter((index) => index !== -1)
  }, [flattenedData])

  const getItemColor = (type: string) => {
    if (type === "penjualan") return "text-green-500"
    if (type === "pengeluaran") return "text-red-500"
    if (type === "pembelian") return "text-cyan-500"
    return "text-foreground"
  }

  const renderItem = ({ item, target }: ListRenderItemInfo<ListItem>) => {
    if (item.type === "header") {
      const isSticky = target === "StickyHeader"
      return (
        <View
          className={cn(
            "px-4 py-2",
            isSticky && "bg-background border-b border-border"
          )}
        >
          <Text
            variant="muted"
            className="font-mono-bold text-xs uppercase tracking-wider"
          >
            {item.title}
          </Text>
        </View>
      )
    }

    const data = item.data
    const color = getItemColor(data.type)

    return (
      <PressableRow
        onPress={() => handlePress(data)}
        className={cn(
          "flex-row items-center p-2 bg-card gap-x-2",
          item.isLast && "mb-4",
          !item.isLast && "border-b border-border"
        )}
      >
        {/* Left Content: Description & Metadata */}
        <View className="flex-1 gap-2">
          <Text
            className="uppercase"
          >
            {data.type}
          </Text>

          <View className="flex-row items-center gap-2">
            <Text variant="muted">
              {formatDateTime(data.tanggal)}
            </Text>
            <Text className="text-muted-foreground/50 text-xs">•</Text>
            <Text variant="muted" className="uppercase">
              {data.staff_name || "-"}
            </Text>
            {data.keterangan && (
              <>
                <Text className="text-muted-foreground/50 text-xs">•</Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-xs flex-1 text-muted-foreground/60"
                >
                  {data.keterangan}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Right Content: Amount & Chevron */}
        <View className="flex-row items-center gap-2">
          <Text className={cn(color)}>
            {data.type === "penjualan" ? "+" : "-"}
            {data.jumlah_total.toLocaleString("id-ID")}
          </Text>

          <Icon
            as={ChevronRight}
            size={20}
            className="text-muted-foreground/50"
          />
        </View>
      </PressableRow>
    )
  }

  if (isLoading && transactions.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-muted-foreground text-sm">Memuat data...</Text>
      </View>
    )
  }

  // Empty state: mirror the filled-data appearance so the UI doesn't look
  // empty — use the same row/header structure but with placeholder text.
  if (!isLoading && transactions.length === 0) {
    return (
      <View className="flex-1">
        {/* date header */}
        <View className="px-4 py-2">
          <Text
            variant="muted"
            className="font-mono-bold text-xs uppercase tracking-wider"
          >
            Hari Ini
          </Text>
        </View>

        {/* placeholder row */}
        <PressableRow className="flex-row items-center p-2 bg-card gap-x-2 border-b border-border">
          <View className="flex-1 gap-2">
            <Text className="uppercase text-muted-foreground">Tidak ada transaksi</Text>

            <View className="flex-row items-center gap-2">
              <Text variant="muted">-</Text>
              <Text className="text-muted-foreground/50 text-xs">•</Text>
              <Text variant="muted" className="uppercase">-</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-muted-foreground">0</Text>

            <Icon
              as={ChevronRight}
              size={20}
              className="text-muted-foreground/50"
            />
          </View>
        </PressableRow>
      </View>
    )
  }

  return (
    <View className="flex-1">
      <FlashList
        data={flattenedData}
        renderItem={renderItem}
        getItemType={(item) => item.type}
        keyExtractor={(item) =>
          item.type === "header" ? item.id : item.data.id
        }
        stickyHeaderIndices={stickyHeaderIndices}
      />
    </View>
  )
}
