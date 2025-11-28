import { View } from "react-native"
import { Button } from "@/components/ui/button"

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
    <View className="h-12 flex-row items-center justify-between bg-background p-2 gap-2 border-b border-border">
      {options.map((option) => (
        <Button
          variant={filter === option.value ? "default" : "outline"}
          key={option.value}
          onPress={() => onFilterChange(option.value)}
          className={`flex-1`}
          size="icon"
          title={option.label}
        />
      ))}
    </View>
  )
}
