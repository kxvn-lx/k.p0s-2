import SelesaiScreen from "@/features/keranjang/selesai"
import { Stack } from "expo-router"

export default function SelesaiRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "SELESAI",
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <SelesaiScreen />
    </>
  )
}
