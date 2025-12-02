import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useCallback } from "react"
import { stockKeys } from "@/features/stok/api/stock.keys"
import {
  PenjualanService,
  type CreatePenjualanPayload,
  type CreatePenjualanResult,
  type ProgressStep,
} from "@/features/penjualan/api/penjualan.service"

const COMPLETION_DELAY = 1200

export function usePenjualanMutation() {
  const queryClient = useQueryClient()
  const [dialogVisible, setDialogVisible] = useState(false)
  const [progress, setProgress] = useState<ProgressStep | null>(null)

  const handleProgress = useCallback((step: ProgressStep) => {
    setProgress(step)
  }, [])

  const mutation = useMutation({
    mutationFn: async (payload: CreatePenjualanPayload): Promise<CreatePenjualanResult> => {
      setDialogVisible(true)
      setProgress({ step: "validating", message: "Memulai..." })

      const { data, error } = await PenjualanService.create(payload, handleProgress)

      if (error) throw error

      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.all() })
      queryClient.invalidateQueries({ queryKey: stockKeys.truck() })
    },

    onError: (error: Error) => {
      setProgress({ step: "failed", message: error.message || "Transaksi gagal" })
    },
  })

  const closeDialogAndNavigate = useCallback((onComplete: () => void) => {
    setTimeout(() => {
      setDialogVisible(false)
      setProgress(null)
      setTimeout(onComplete, 150)
    }, COMPLETION_DELAY)
  }, [])

  return {
    ...mutation,
    dialogVisible,
    progress,
    closeDialogAndNavigate,
    isProcessing: mutation.isPending,
  }
}
