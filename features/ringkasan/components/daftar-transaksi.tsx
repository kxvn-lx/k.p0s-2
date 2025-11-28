import { View, TouchableOpacity } from "react-native"
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list"
import { Text } from "@/components/ui/text"
import type { TransactionItem } from "../hooks/ringkasan.queries"
import { format, isToday, isYesterday } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "expo-router"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
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

  const getTypeLabel = (type: string) => {
    if (type === "penjualan") return "Penjualan"
    if (type === "pengeluaran") return "Pengeluaran"
    if (type === "pembelian") return "Pembelian"
    return type
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
          "flex-row items-center p-2 bg-background",
          item.isLast && "mb-4",
          !item.isLast && "border-b border-border/40"
        )}
      >
        {/* Left Content: Description & Metadata */}
        <View className="flex-1 pr-4 gap-1">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-foreground font-medium text-sm"
              numberOfLines={1}
            >
              {data.keterangan || getTypeLabel(data.type)}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-muted-foreground text-xs">
              {format(new Date(data.tanggal), "HH:mm", { locale: id })}
            </Text>
            <Text className="text-muted-foreground/50 text-[10px]">•</Text>
            <Text className="text-muted-foreground text-xs capitalize">
              {getTypeLabel(data.type)}
            </Text>
            {data.staff_name && (
              <>
                <Text className="text-muted-foreground/50 text-[10px]">•</Text>
                <Text className="text-muted-foreground text-xs">
                  {data.staff_name}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Right Content: Amount & Chevron */}
        <View className="flex-row items-center gap-2">
          <Text className={cn("font-mono font-medium text-sm", color)}>
            {data.type === "penjualan" ? "+" : "-"}
            {data.jumlah_total.toLocaleString("id-ID")}
          </Text>
          <Icon
            as={ChevronRight}
            size={16}
            className="text-muted-foreground/50"
          />
        </View>
      </PressableRow>
    )
  }

  if (isLoading && transactions.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-muted/30">
        <Text className="text-muted-foreground text-sm">Memuat data...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-muted/30">
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
