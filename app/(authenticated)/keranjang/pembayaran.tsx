import PembayaranScreen from "@/features/keranjang/pembayaran"
import { Stack } from "expo-router"

export default function PembayaranRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: "PEMBAYARAN",
                    headerBackTitle: "KEMBALI",
                }}
            />
            <PembayaranScreen />
        </>
    )
}
