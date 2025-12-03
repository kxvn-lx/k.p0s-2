import { View, Pressable, StyleSheet } from "react-native"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import * as Haptics from "expo-haptics"

type PeriodFilter = "daily" | "weekly" | "yearly"

interface FilterSegmentProps {
  filter: PeriodFilter
  onFilterChange: (filter: PeriodFilter) => void
}

const options: { label: string; value: PeriodFilter }[] = [
  { label: "HARIAN", value: "daily" },
  { label: "MINGGUAN", value: "weekly" },
  { label: "TAHUNAN", value: "yearly" },
]

export function FilterSegment({ filter, onFilterChange }: FilterSegmentProps) {
  return (
    <View
      className="flex-row items-center mx-2 -mt-2"
    >
      {options.map((option) => {
        const isActive = filter === option.value
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              if (!isActive) {
                Haptics.selectionAsync()
                onFilterChange(option.value)
              }
            }}
            className={cn(
              "flex-1 py-1.5 items-center justify-center",
              isActive ? "bg-card border border-border rounded-[--radius]" : ""
            )}
          >
            <Text
              className={cn(
                "text-xs uppercase tracking-wider",
                isActive ? "text-foreground" : "text-muted-foreground/50"
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
