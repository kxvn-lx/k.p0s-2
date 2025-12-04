import { View } from "react-native"
import { Text } from "@/components/ui/text"

// ----- TYPES -----
export type PerincianItemProps = {
    testID?: string
    name: string
    qty: number
    unit?: string | null
    price: number
    originalPrice?: number | null
    isVariation?: boolean
    total?: number | null
}

// ----- COMPONENT -----
export default function PerincianItem({
    testID,
    name,
    qty,
    unit,
    price,
    originalPrice,
    isVariation,
    total,
}: PerincianItemProps) {
    const showOriginal = originalPrice !== undefined && originalPrice !== null && originalPrice !== price

    return (
        <View testID={testID} className="flex-row items-center justify-between">
            {/* Left: Stock Info */}
            <View className="flex-1 flex-col">
                <Text>{name}</Text>

                <View className="flex-row items-center gap-x-2">
                    <Text variant="muted" className="text-sm">
                        {qty} {unit ?? ""}
                    </Text>

                    <Text className="text-accent">x</Text>

                    <View className="flex-row items-center gap-1">
                        {showOriginal && (
                            <Text variant="muted" className="line-through text-sm">
                                {originalPrice?.toLocaleString("id-ID")}
                            </Text>
                        )}

                        <Text className={isVariation ? "text-green-500 text-sm" : "text-sm text-muted-foreground"}>
                            {price.toLocaleString("id-ID")}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Right: Total */}
            <Text>{(total ?? qty * price).toLocaleString("id-ID")}</Text>
        </View>
    )
}
