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
      className="px-4 py-2 bg-background border-b"
      style={styles.outerBorder}
    >
      <View
        className="flex-row p-1 bg-muted rounded-lg border"
        style={styles.segmentGroup}
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
                "flex-1 py-1.5 items-center justify-center rounded-md",
                isActive ? "bg-background border border-border" : ""
              )}
              style={isActive ? styles.activeSegment : undefined}
            >
              <Text
                className={cn(
                  "text-[10px] font-mono-medium uppercase tracking-wider",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outerBorder: {
    borderColor: "rgba(15,23,42,0.15)",
  },
  segmentGroup: {
    backgroundColor: "rgba(148,163,184,0.15)",
    borderColor: "rgba(15,23,42,0.15)",
  },
  activeSegment: {
    borderColor: "rgba(15,23,42,0.2)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
})
