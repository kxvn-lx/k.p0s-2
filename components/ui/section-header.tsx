import { View } from "react-native"
import React from "react"
import { Text } from "./text"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
    title: string
    className?: string
    variant?: "default" | "muted"
    textClassName?: string
    secondary?: string
}

export function SectionHeader({
    title,
    className,
    textClassName,
    secondary,
}: SectionHeaderProps) {
    return (
        <View
            className={cn(
                "px-4 py-2",
                className
            )}
        >
            <View className="flex-row items-center justify-between">
                <Text
                    variant={"muted"}
                    className={cn(
                        "font-mono-bold text-xs uppercase tracking-wider",
                        textClassName
                    )}
                >
                    {title}
                </Text>

                {secondary ? <Text variant="muted" className="text-xs">
                    {secondary}
                </Text> : null}
            </View>
        </View>
    )
}