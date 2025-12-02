import { useState, useCallback } from "react"
import { simulateProgressFlowQuick } from "@/features/penjualan/utils/debug-progress"
import type { ProgressStep } from "@/features/penjualan/api/penjualan.service"

const COMPLETION_DELAY = 1200

export function useDebugMutation() {
  const [isPending, setIsPending] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [progress, setProgress] = useState<ProgressStep | null>(null)

  const mutateAsync = useCallback(async () => {
    setDialogVisible(true)
    setIsPending(true)
    setProgress({ step: "validating", message: "Memulai demo..." })

    await simulateProgressFlowQuick(setProgress)

    setIsPending(false)

    return { penjualan: {}, details: [], payment: { cashReceived: 100000, change: 20000 } }
  }, [])

  const closeDialogAndNavigate = useCallback((onComplete: () => void) => {
    setTimeout(() => {
      setDialogVisible(false)
      setProgress(null)
      setTimeout(onComplete, 150)
    }, COMPLETION_DELAY)
  }, [])

  return {
    mutateAsync,
    dialogVisible,
    progress,
    closeDialogAndNavigate,
    isPending,
    isProcessing: isPending,
  }
}
