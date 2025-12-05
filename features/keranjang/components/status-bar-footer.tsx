import { View } from "react-native"
import { cn } from "@/lib/utils"

type StatusBarFooterProps = {
    children: React.ReactNode
    className?: string
}

export default function StatusBarFooter({
    children,
    className,
}: StatusBarFooterProps) {
    return (
        <View
            className={cn(
                "border-t border-border p-2 flex-col gap-y-2",
                className
            )}
        >
            {children}
        </View>
    )
}

