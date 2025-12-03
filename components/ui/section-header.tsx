import { View } from "react-native"
import { Text } from "./text"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
    title: string
    className?: string
    isSticky?: boolean
    variant?: "default" | "muted"
    textClassName?: string
}

export function SectionHeader({
    title,
    className,
    isSticky = false,
    textClassName,
}: SectionHeaderProps) {
    return (
        <View
            className={cn(
                "px-4 py-2",
                isSticky && "bg-background border-b border-border",
                className
            )}
        >
            <Text
                variant={"muted"}
                className={cn(
                    "font-mono-bold text-xs uppercase tracking-wider",
                    textClassName
                )}
            >
                {title}
            </Text>
        </View>
    )
}