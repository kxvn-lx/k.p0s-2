import { View } from "react-native"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ProgressDialog } from "@/features/penjualan/components/progress-dialog"
import { simulateProgressFlowQuick } from "@/features/penjualan/utils/debug-progress"
import type { ProgressStep } from "@/features/penjualan/api/penjualan.service"

export function ProgressViewer() {
  const [dialogVisible, setDialogVisible] = useState(false)
  const [progress, setProgress] = useState<ProgressStep | null>(null)

  const handleStartSimulation = useCallback(async () => {
    setDialogVisible(true)
    setProgress(null)

    await simulateProgressFlowQuick((step) => {
      setProgress(step)
    })

    // Auto close after completion
    setTimeout(() => {
      setDialogVisible(false)
    }, 500)
  }, [])

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <ProgressDialog visible={dialogVisible} progress={progress} />

      <Button
        title={dialogVisible ? "SEDANG BERJALAN..." : "LIHAT PROGRESS DIALOG"}
        onPress={handleStartSimulation}
        disabled={dialogVisible}
      />
    </View>
  )
}
