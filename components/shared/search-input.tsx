import React, { useEffect, useState } from "react"
import { View, Keyboard } from "react-native"
import { Input } from "@/components/ui/input"
import { Icon } from "@/components/ui/icon"
import { X } from "lucide-react-native"
import { Button } from "@/components/ui/button"

// ----- Types -----
type Props = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChangeText"
> & {
  /** Initial value for the input (only used internally) */
  initialValue?: string
  /** Receives debounced search value */
  onSearch?: (q: string) => void
  /** Debounce delay in ms */
  debounceMs?: number
  showClear?: boolean
}

// ----- Description -----
export default function SearchInput({
  initialValue = "",
  onSearch,
  debounceMs = 320,
  showClear = true,
  ...props
}: Props) {
  const [query, setQuery] = useState(initialValue)

  // Debounce and notify parent
  useEffect(() => {
    const t = setTimeout(() => onSearch?.(query), debounceMs)
    return () => clearTimeout(t)
  }, [query, debounceMs, onSearch])

  const showClearBtn =
    showClear && typeof query === "string" && query.length > 0

  const handleClear = () => {
    setQuery("")
    onSearch?.("")
    Keyboard.dismiss()
  }

  return (
    <View className="w-full">
      <View className="flex-row items-center w-full">
        <Input
          value={query}
          onChangeText={setQuery}
          className="flex-1"
          {...props}
        />

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
