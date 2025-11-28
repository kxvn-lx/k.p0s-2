import { View, TouchableOpacity } from "react-native"
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
import { Icon } from "@/components/ui/icon"
import { ChevronLeft, ChevronRight } from "lucide-react-native"
import { cn } from "@/lib/utils"

type PeriodFilter = "daily" | "weekly" | "yearly"

interface DateNavigatorProps {
  date: Date
  onDateChange: (date: Date) => void
  filter: PeriodFilter
}

export function DateNavigator({
  date,
  onDateChange,
  filter,
}: DateNavigatorProps) {
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
  const goToToday = () => onDateChange(new Date())

  return (
    <View className="bg-background px-4 py-2 border-b border-border/40">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handlePrev}
          className="w-8 h-8 items-center justify-center rounded-full active:bg-muted/20"
        >
          <Icon as={ChevronLeft} size={24} className="text-primary" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToToday}
          className="items-center"
          activeOpacity={0.7}
        >
          <Text className="text-foreground font-semibold text-base">
            {formatDate()}
          </Text>
          {!isNextDisabled() && (
            <Text className="text-primary text-xs font-medium mt-0.5">
              Kembali ke Hari Ini
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={nextDisabled}
          className={cn(
            "w-8 h-8 items-center justify-center rounded-full active:bg-muted/20",
            nextDisabled && "opacity-30"
          )}
        >
          <Icon as={ChevronRight} size={24} className="text-primary" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
