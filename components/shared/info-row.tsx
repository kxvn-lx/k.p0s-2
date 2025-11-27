// ----- IMPORTS -----
import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"

// ----- TYPES -----
interface InfoRowProps {
    label: string
    value: string
    containerClassName?: string
    labelClassName?: string
    valueClassName?: string
}

// ----- COMPONENT -----
export default function InfoRow({
    label,
    value,
    containerClassName,
    labelClassName,
    valueClassName,
}: InfoRowProps) {
    return (
        <View className={cn("flex-row justify-between items-center border-b border-border p-2", containerClassName)}>
            <Text variant="muted" className={cn("uppercase text-sm", labelClassName)}>
                {label}
            </Text>
            <Text className={cn("", valueClassName)}>{value}</Text>
        </View>
    )
}