import { View, TouchableOpacity } from "react-native"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import { Delete } from "lucide-react-native"
import { Icon } from "@/components/ui/icon"

interface PaymentKeypadProps {
    onPress: (key: string) => void
    onClear: () => void
    onBackspace: () => void
    className?: string
}

export default function PaymentKeypad({
    onPress,
    onClear,
    onBackspace,
    className,
}: PaymentKeypadProps) {
    const grid = [
        ["7", "8", "9", "clear"],
        ["4", "5", "6", "backspace"],
        ["1", "2", "3", null],
        ["00", "0", "000", null],
    ]

    const renderKey = (key: string | null, index: number) => {
        if (!key) {
            return <View key={`empty-${index}`} className="flex-1" />
        }

        if (key === "clear") {
            return (
                <KeyButton
                    key={key}
                    onPress={onClear}
                    label="C"
                    variant="destructive"
                />
            )
        }

        if (key === "backspace") {
            return (
                <KeyButton
                    key={key}
                    onPress={onBackspace}
                    icon={Delete}
                />
            )
        }

        return (
            <KeyButton
                key={key}
                onPress={() => onPress(key)}
                label={key}
            />
        )
    }

    return (
        <View className={cn("flex-col gap-2", className)}>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} className="flex-row gap-2 h-16">
                    {row.map((key, keyIndex) => renderKey(key, rowIndex * 4 + keyIndex))}
                </View>
            ))}
        </View>
    )
}

function KeyButton({
    onPress,
    label,
    icon,
    variant = "default",
}: {
    onPress: () => void
    label?: string
    icon?: any
    variant?: "default" | "destructive"
}) {
    const isDestructive = variant === "destructive"
    return (
        <TouchableOpacity
            onPress={onPress}
            className={cn(
                "flex-1 items-center justify-center rounded-md border border-border bg-card active:bg-accent",
                isDestructive && "bg-destructive/10 border-destructive/20"
            )}
        >
            {icon ? (
                <Icon as={icon} className="text-foreground" size={24} />
            ) : (
                <Text
                    className={cn(
                        "text-2xl font-medium",
                        isDestructive && "text-destructive"
                    )}
                >
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    )
}
