import { useCallback, useEffect, useState } from "react"
import * as Updates from "expo-updates"
import { Alert } from "react-native"
import { toast } from "@/components/ui/toast"

// ----- Types -----
export type UpdateStatus =
  | "idle"
  | "checking"
  | "downloading"
  | "ready"
  | "up-to-date"
  | "error"

type UpdateInfo = {
  status: UpdateStatus
  errorMessage?: string
  isUpdateAvailable: boolean
  isUpdateReady: boolean
}

// ----- Hook -----
export function useAppUpdates(autoCheckOnMount = false) {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    status: "idle",
    isUpdateAvailable: false,
    isUpdateReady: false,
  })

  const checkForUpdates = useCallback(async (showToastOnUpToDate = true) => {
    if (!Updates.isEnabled) {
      return
    }

    try {
      setUpdateInfo((prev) => ({ ...prev, status: "checking" }))

      const update = await Updates.checkForUpdateAsync()

      if (update.isAvailable) {
        setUpdateInfo({
          status: "downloading",
          isUpdateAvailable: true,
          isUpdateReady: false,
        })

        const downloadResult = await Updates.fetchUpdateAsync()

        if (downloadResult.isNew) {
          setUpdateInfo({
            status: "ready",
            isUpdateAvailable: true,
            isUpdateReady: true,
          })

          Alert.alert(
            "Pembaruan Tersedia",
            "Pembaruan telah diunduh. Muat ulang aplikasi sekarang?",
            [
              {
                text: "Nanti",
                style: "cancel",
              },
              {
                text: "Muat Ulang",
                onPress: async () => {
                  try {
                    await Updates.reloadAsync()
                  } catch (reloadError) {
                    console.error("Failed to reload:", reloadError)
                    toast.error(
                      "Gagal Memuat Ulang",
                      "Silakan restart aplikasi secara manual"
                    )
                  }
                },
              },
            ]
          )
        }
      } else {
        setUpdateInfo({
          status: "up-to-date",
          isUpdateAvailable: false,
          isUpdateReady: false,
        })

        if (showToastOnUpToDate) {
          toast.success(
            "Aplikasi Sudah Terbaru",
            "Tidak ada pembaruan tersedia"
          )
        }
      }
    } catch (checkError) {
      console.error("Failed to check for updates:", checkError)
      const errorMessage =
        checkError instanceof Error
          ? checkError.message
          : "Gagal memeriksa pembaruan"
      setUpdateInfo({
        status: "error",
        errorMessage,
        isUpdateAvailable: false,
        isUpdateReady: false,
      })

      toast.error("Gagal Memeriksa Pembaruan", errorMessage)
    }
  }, [])

  const reloadApp = useCallback(async () => {
    if (!updateInfo.isUpdateReady) {
      return
    }

    try {
      await Updates.reloadAsync()
    } catch (reloadError) {
      console.error("Failed to reload app:", reloadError)
      toast.error(
        "Gagal Memuat Ulang",
        "Silakan restart aplikasi secara manual"
      )
    }
  }, [updateInfo.isUpdateReady])

  useEffect(() => {
    if (autoCheckOnMount && Updates.isEnabled) {
      checkForUpdates(false)
    }
  }, [autoCheckOnMount, checkForUpdates])

  return {
    updateInfo,
    checkForUpdates,
    reloadApp,
  }
}
