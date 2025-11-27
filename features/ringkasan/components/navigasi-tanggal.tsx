import { View } from "react-native"
import { Text } from "@/components/ui/text"
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addYears,
  subYears,
  isSameDay,
  isSameWeek,
  isSameYear,
} from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { ChevronLeft, ChevronRight } from "lucide-react-native"

type PeriodFilter = "daily" | "weekly" | "yearly"

interface DateNavigatorProps {
  date: Date
  onDateChange: (date: Date) => void
  filter: PeriodFilter
}

export function DateNavigator({ date, onDateChange, filter }: DateNavigatorProps) {
  const today = new Date()

  const isNextDisabled = () => {
    if (filter === "daily") return isSameDay(date, today)
    if (filter === "weekly") return isSameWeek(date, today, { weekStartsOn: 1 })
    return isSameYear(date, today)
  }

  const handlePrev = () => {
    if (filter === "daily") onDateChange(subDays(date, 1))
    else if (filter === "weekly") onDateChange(subWeeks(date, 1))
    else onDateChange(subYears(date, 1))
  }

  const handleNext = () => {
    if (isNextDisabled()) return
    if (filter === "daily") onDateChange(addDays(date, 1))
    else if (filter === "weekly") onDateChange(addWeeks(date, 1))
    else onDateChange(addYears(date, 1))
  }

  const formatDate = () => {
    if (filter === "daily")
      return format(date, "EEEE, d MMMM yyyy", { locale: id })
    if (filter === "weekly")
      return `Minggu ${format(date, "w, yyyy", { locale: id })}`
    return format(date, "yyyy", { locale: id })
  }

  const nextDisabled = isNextDisabled()
  const getPeriodLabel = () => {
    if (filter === "daily") return "Harian"
    if (filter === "weekly") return "Mingguan"
    return "Tahunan"
  }

  const goToToday = () => onDateChange(new Date())
  const getTodayLabel = () => {
    if (filter === "daily") return "KE HARI INI"
    if (filter === "weekly") return "KE MINGGU INI"
    return "KE TAHUN INI"
  }

  return (
    <View className="bg-background p-2 border-b border-border gap-2">
      <View className="flex-row items-center justify-between">
        <Button onPress={handlePrev} variant="outline">
          <Icon as={ChevronLeft} size={20} />
        </Button>

        <View className="items-center">
          <Text variant="muted" className="text-xs uppercase">
            {getPeriodLabel().toUpperCase()}
          </Text>
          <Text className="font-mono-bold uppercase tracking-wider">
            {formatDate()}
          </Text>
          <Button
            onPress={goToToday}
            variant="ghost"
            size="icon"
            className="w-full"
            title={getTodayLabel()}
            textClassName="text-muted-foreground"
          />
        </View>

        <Button
          onPress={handleNext}
          variant="outline"
          textClassName="text-muted-foreground"
          disabled={nextDisabled}
        >
          <Icon as={ChevronRight} size={20} />
        </Button>
      </View>
    </View>
  )
}
