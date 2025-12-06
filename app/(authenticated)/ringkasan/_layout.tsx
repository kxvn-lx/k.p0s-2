import { getStackOptions } from "@/lib/utils/navigation"
import { useTheme } from "@react-navigation/native"
import { Stack } from "expo-router"

export default function RingkasanLayout() {
  const theme = useTheme()

  return (
    <Stack screenOptions={getStackOptions(theme)}>
      <Stack.Screen
        name="index"
        options={{
          title: "RINGKASAN",
        }}
      />
      <Stack.Screen name="rincian" />
      <Stack.Screen
        name="tambah-pengeluaran"
        options={{
          title: "TAMBAH PENGELUARAN",
        }}
      />
    </Stack>
  )
}
