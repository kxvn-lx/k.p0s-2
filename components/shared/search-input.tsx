import React from "react"
import { View, Pressable, Keyboard } from "react-native"
import { Input } from "@/components/ui/input"
import { Icon } from "@/components/ui/icon"
import { X } from "lucide-react-native"
import { Button } from "@/components/ui/button"

type Props = React.ComponentProps<typeof Input> & {
    showClear?: boolean
}

// Wrapper around `Input` to provide clear/cancel behavior for search fields.
export default function SearchInput({ value, onChangeText, showClear = true, ...props }: Props) {
    const showClearBtn = showClear && typeof value === "string" && value.length > 0

    const handleClear = () => {
        onChangeText?.("")
        Keyboard.dismiss()
    }

    return (
        <View className="w-full">
            <View className="flex-row items-center w-full">
                <Input value={value} onChangeText={onChangeText} className="flex-1" {...props} />

                {showClearBtn ? (
                    <Button
                        variant="outline"
                        size="icon"
                        onPress={handleClear}
                        className="mx-2"
                    >
                        <Icon as={X} size={16} className="text-muted-foreground" />
                    </Button>
                ) : null}
            </View>
        </View>
    )
}
