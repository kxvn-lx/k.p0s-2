import { View, TouchableOpacity } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { Text } from "@/components/ui/text"
import type { TransactionItem } from "../hooks/ringkasan.queries"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "expo-router"

interface TransactionListProps {
  transactions: TransactionItem[]
  isLoading: boolean
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  const router = useRouter()

  const handlePress = (item: TransactionItem) => {
    router.push(`/ringkasan/rincian?id=${item.id}&type=${item.type}`)
  }

  const renderHeader = () => (
    <View className="flex-row px-4 py-2 border-b border-border bg-primary/10">
      <Text className="w-16 text-xs uppercase">
        WAKTU
      </Text>
      <Text className="w-20 text-xs uppercase">
        TIPE
      </Text>
      <Text className="flex-1 text-xs uppercase">
        KET
      </Text>
      <Text className="w-24 text-right text-xs uppercase">
        JUMLAH
      </Text>
    </View>
  )

  const getItemColor = (type: string) => {
    if (type === "penjualan") return "text-primary"
    if (type === "pengeluaran") return "text-destructive"
    if (type === "pembelian") return "text-blue-400"
    return "text-foreground"
  }

  const renderItem = ({ item }: { item: TransactionItem }) => {
    const color = getItemColor(item.type)

    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        className="flex-row items-center px-4 py-2 border-b border-border/20 active:bg-primary/10"
      >
        <Text className="w-16 text-xs font-mono text-muted-foreground">
          {format(new Date(item.tanggal), "HH:mm", { locale: id })}
        </Text>

        <View className="w-20">
          <Text className={`text-[10px] font-mono uppercase ${color}`}>
            {item.type.substring(0, 8)}
          </Text>
        </View>

        <View className="flex-1 pr-2">
          <Text
            className="text-foreground text-xs font-mono uppercase"
            numberOfLines={1}
          >
            {item.keterangan || "-"}
          </Text>
          {item.staff_name && (
            <Text className="text-muted-foreground text-[10px] font-mono uppercase">
              OLEH: {item.staff_name}
            </Text>
          )}
        </View>

        <Text className={`w-24 text-right font-mono text-xs ${color}`}>
          {item.type === "penjualan" ? "+" : "-"}
          {item.jumlah_total.toLocaleString("id-ID")}
        </Text>
      </TouchableOpacity>
    )
  }

  if (isLoading && transactions.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-primary font-mono animate-pulse">
          MEMUAT DATA...
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      {renderHeader()}
      <FlashList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}
