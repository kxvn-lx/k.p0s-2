import { Text } from "@/components/ui/text"
import { View } from "react-native"

// ----- Penjualan Screen -----
export default function Penjualan() {
  return (
    <View className="flex-1 justify-center items-center bg-background px-6">
      <Text className="text-2xl font-bold">Penjualan</Text>
      <Text className="text-muted-foreground mt-2">
        Penjualan screen - authenticated route
      </Text>
    </View>
  )
}
