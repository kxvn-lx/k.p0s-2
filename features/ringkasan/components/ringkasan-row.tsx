import { View } from "react-native"
import { RefreshControlProps } from "react-native"
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list"
import { Text } from "@/components/ui/text"
import { SectionHeader } from "@/components/ui/section-header"
import type { TransactionItem } from "../hooks/ringkasan.queries"
import { format, isToday, isYesterday } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "expo-router"
import { useMemo } from "react"
import { cn, formatDateTime } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"
import { ChevronRight } from "lucide-react-native"
import PressableRow from "@/components/shared/pressable-row"

interface RingkasanRowProps {
  transactions: TransactionItem[]
  isLoading: boolean
  refreshControl?: React.ReactElement<RefreshControlProps>
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null
}

type ListItem =
  | { type: "header"; title: string; id: string }
  | { type: "empty"; id: string }
  | { type: "listHeader"; id: string }
  | {
    type: "item"
    data: TransactionItem
    isFirst: boolean
    isLast: boolean
  }

export function RingkasanRow({
  transactions,
  isLoading,
  refreshControl,
  ListHeaderComponent,
}: RingkasanRowProps) {
  const router = useRouter()

  const handlePress = (item: TransactionItem) => {
    router.push(
      `/ringkasan/rincian?transaction=${encodeURIComponent(JSON.stringify(item))}`
    )
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

    if (ListHeaderComponent) {
      result.push({ type: "listHeader", id: "list-header" })
    }

    // Add empty state if no transactions
    if (transactions.length === 0) {
      result.push({ type: "empty", id: "empty-state" })
    } else {
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
    }

    return result
  }, [transactions, ListHeaderComponent])

  const stickyHeaderIndices = useMemo(
    () => flattenedData.map((item, index) => (item.type === "header" || item.type === "listHeader" ? index : -1)).filter((i) => i !== -1),
    [flattenedData]
  )

  const getItemColor = (type: string) =>
    type === "penjualan" ? "text-green-400" : type === "pengeluaran" ? "text-[#da2f8b]" : type === "pembelian" ? "text-red-500" : "text-foreground"

  const SectionGap = () => <View className="h-4" />

  const renderItem = ({ item }: ListRenderItemInfo<ListItem>) => {
    if (item.type === "listHeader") {
      if (!ListHeaderComponent) return null
      const element = typeof ListHeaderComponent === "function" ? <ListHeaderComponent /> : ListHeaderComponent
      return (
        <>
          {element}
          <SectionGap />
        </>
      )
    }
    if (item.type === "header") {
      return (
        <SectionHeader title={item.title} className="bg-background" />
      )
    }

    if (item.type === "empty") {
      return (
        <View className="flex-1 pt-8">
          {/* placeholder row */}
          <View className="flex-row items-center p-2 bg-card gap-x-2 border-y border-border">
            <View className="flex-1 gap-2">
              <Text className="uppercase text-muted-foreground">
                Nd ada transaksi
              </Text>

              <View className="flex-row items-center gap-2">
                <Text variant="muted">-</Text>
                <Text className="text-muted-foreground/50 text-xs">•</Text>
                <Text variant="muted" className="uppercase">
                  -
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              <Text className="text-muted-foreground">0</Text>
            </View>
          </View>
        </View>
      )
    }

    const data = item.data
    const color = getItemColor(data.type)

    return (
      <>
        <PressableRow
          onPress={() => handlePress(data)}
          className={cn(
            "flex-row items-center p-2 bg-card",
            !item.isLast && "border-b border-border",
          )}
        >
          {/* Left Content: Description & Metadata */}
          <View className="flex-1">
            <Text className="uppercase">{data.type}</Text>

            <View className="flex-row items-center gap-1">
              <Text variant="muted">{formatDateTime(data.tanggal)}</Text>
              <Text className="text-muted-foreground/25 text-xs">•</Text>
              <Text variant="muted" className="uppercase">
                {data.staff_name.split("@")[0].toUpperCase() || "-"}
              </Text>
              {data.keterangan && (
                <>
                  <Text className="text-muted-foreground/25 text-xs">•</Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-xs flex-1 text-muted-foreground/50"
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
              size={16}
              className="text-muted-foreground"
            />
          </View>
        </PressableRow>
        {item.isLast && <SectionGap />}
      </>
    )
  }

  if (isLoading && transactions.length === 0) {
    return (
      <View className="flex-1">
        {ListHeaderComponent && (typeof ListHeaderComponent === "function" ? <ListHeaderComponent /> : ListHeaderComponent)}
        <View className="flex-1 justify-center items-center">
          <Text className="text-muted-foreground text-sm">Memuat data...</Text>
        </View>
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
          item.type === "header" || item.type === "listHeader"
            ? item.id
            : item.type === "empty"
              ? item.id
              : item.data.id
        }
        stickyHeaderIndices={stickyHeaderIndices}
        refreshControl={refreshControl}
      />
    </View>
  )
}
