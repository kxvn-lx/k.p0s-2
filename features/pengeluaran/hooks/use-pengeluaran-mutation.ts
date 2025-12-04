import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useCallback } from "react"
import { ringkasanKeys } from "@/features/ringkasan/api/ringkasan.keys"
import {
  PengeluaranService,
  type CreatePengeluaranPayload,
  type CreatePengeluaranResult,
  type ProgressStep,
} from "../api/pengeluaran.service"

const COMPLETION_DELAY = 800

export function usePengeluaranMutation() {
  const queryClient = useQueryClient()
  const [dialogVisible, setDialogVisible] = useState(false)
  const [progress, setProgress] = useState<ProgressStep | null>(null)

  const handleProgress = useCallback((step: ProgressStep) => {
    setProgress(step)
  }, [])

  const mutation = useMutation({
    mutationFn: async (payload: CreatePengeluaranPayload): Promise<CreatePengeluaranResult> => {
      setDialogVisible(true)
      setProgress({ step: "validating", message: "MEMULAI..." })

      const { data, error } = await PengeluaranService.create(payload, handleProgress)

      if (error) throw error

      return data
    },

    onSuccess: () => {
      // Invalidate ringkasan queries to refresh data
      queryClient.invalidateQueries({ queryKey: ringkasanKeys.all })
    },

    onError: (error: Error) => {
      setProgress({ step: "failed", message: error.message || "GAGAL MENYIMPAN" })
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
