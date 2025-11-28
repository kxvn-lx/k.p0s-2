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
import { Button } from "@/components/ui/button"

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

    const getTodayText = () => {
        if (filter === "daily") return "HARI INI"
        if (filter === "weekly") return "MINGGU INI"
        return "TAHUN INI"
    }

    const nextDisabled = isNextDisabled()
    const goToToday = () => onDateChange(new Date())

    return (
        <View className="bg-background p-2 border-b border-border">
            <View className="flex-row items-center justify-between">
                <Button
                    onPress={handlePrev}
                    variant="ghost"
                    size="icon"
                >
                    <Icon as={ChevronLeft} size={20} />
                </Button>

                <View className="items-center">
                    <Text>
                        {formatDate()}
                    </Text>
                    <Button
                        onPress={goToToday}
                        variant="ghost"
                        size="bare"
                        title={getTodayText()}
                        textClassName="text-xs"
                        disabled={nextDisabled}
                    />
                </View>

                <Button
                    onPress={handleNext}
                    disabled={nextDisabled}
                    variant="ghost"
                    size="icon"
                >
                    <Icon as={ChevronRight} size={20} />
                </Button>
            </View>
        </View>
    )
}
