import { View } from "react-native"
import { useState, useMemo } from "react"
import { RefreshControl } from "react-native"
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
} from "date-fns"
import { useRingkasanData } from "./hooks/ringkasan.queries"
import { DateNavigator } from "./components/date-navigator"
import { FilterSegment } from "./components/filter-segment"
import { SummaryCard } from "./components/summary-card"
import { RingkasanRow } from "@/features/ringkasan/components/ringkasan-row"

type PeriodFilter = "daily" | "weekly" | "yearly"

export default function RingkasanScreen() {
  const [date, setDate] = useState({
    daily: new Date(),
    weekly: new Date(),
    yearly: new Date(),
  })
  const [filter, setFilter] = useState<PeriodFilter>("daily")

  const currentDate = date[filter]

  const { startDate, endDate } = useMemo(() => {
    let start: Date
    let end: Date

    if (filter === "daily") {
      start = startOfDay(currentDate)
      end = endOfDay(currentDate)
    } else if (filter === "weekly") {
      start = startOfWeek(currentDate, { weekStartsOn: 1 })
      end = endOfWeek(currentDate, { weekStartsOn: 1 })
    } else {
      start = startOfYear(currentDate)
      end = endOfYear(currentDate)
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    }
  }, [currentDate, filter])

  const { summary, transactions, isLoading, isRefetching, refetch } = useRingkasanData(startDate, endDate)

  const onRefresh = async () => {
    await refetch()
  }

  const handleDateChange = (newDate: Date) => {
    setDate(prev => ({
      ...prev,
      [filter]: newDate,
    }))
  }

  return (
    <View className="flex-1 bg-background gap-4">
      <DateNavigator date={currentDate} onDateChange={handleDateChange} filter={filter} />
      <FilterSegment filter={filter} onFilterChange={setFilter} />
      <RingkasanRow
        transactions={transactions}
        isLoading={isLoading}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
        ListHeaderComponent={<SummaryCard summary={summary} />}
      />
    </View>
  )
}
