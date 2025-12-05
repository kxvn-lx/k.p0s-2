import { Modal, View, ActivityIndicator } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { Text } from "@/components/ui/text"
import { Icon } from "@/components/ui/icon"
import { Check, X } from "lucide-react-native"
import { Progress } from "@/components/ui/progress"
import type { ProgressStep } from "@/features/penjualan/api/penjualan.service"

// ----- TYPES -----
interface ProgressDialogProps {
  visible: boolean
  progress: ProgressStep | null
}

// ----- STEP CONFIG -----
const STEPS = ["validating", "penjualan", "barang-penjualan", "stock", "audit"] as const
const STEP_LABELS: Record<(typeof STEPS)[number], string> = {
  validating: "Validasi",
  penjualan: "Penjualan",
  "barang-penjualan": "Barang Penjualan",
  stock: "Stok",
  audit: "Riwayat",
}

// ----- STATE INDICATOR -----
function StateIndicator({ state }: { state: "loading" | "success" | "error" }) {
  if (state === "loading") {
    return <ActivityIndicator className="text-primary" />
  }

  const isSuccess = state === "success"
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      className={`size-8 rounded-full items-center justify-center ${isSuccess ? "bg-green-500" : "bg-destructive"
        }`}
    >
      <Icon
        as={isSuccess ? Check : X}
        className="text-white"
        size={16}
        strokeWidth={3}
      />
    </Animated.View>
  )
}

// ----- COMPONENT -----
export function ProgressDialog({ visible, progress }: ProgressDialogProps) {
  if (!progress) return null

  const isCompleted = progress.step === "completed"
  const isFailed = progress.step === "failed"
  const isProcessing = !isCompleted && !isFailed

  const currentStepIndex = STEPS.indexOf(progress.step as (typeof STEPS)[number])
  const progressPercent = isCompleted
    ? 100
    : isFailed
      ? 0
      : Math.max(0, ((currentStepIndex + 1) / STEPS.length) * 100)

  const currentStepLabel = isProcessing
    ? STEP_LABELS[progress.step as (typeof STEPS)[number]] ?? ""
    : ""

  const state = isCompleted ? "success" : isFailed ? "error" : "loading"

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 bg-black/50 items-center justify-center p-8">
        <View className="bg-background w-full rounded-[--radius] p-4 gap-4">
          {/* ----- STATE INDICATOR ----- */}
          <View className="items-center">
            <StateIndicator state={state} />
          </View>

          {/* ----- TITLE ----- */}
          <View className="items-center">
            <Text className="font-mono-bold text-center">
              {isCompleted
                ? "Selesai"
                : isFailed
                  ? "Gagal"
                  : "Memproses Transaksi"}
            </Text>
            {isProcessing && currentStepLabel && (
              <Text variant="muted" className="text-sm">
                {currentStepLabel}
              </Text>
            )}
          </View>

          <View>
            {/* ----- PROGRESS ----- */}
            {isProcessing && (
              <View className="gap-2">
                <Progress value={progressPercent} />
                <View className="flex-row justify-between">
                  <Text variant="muted" className="text-xs">
                    {progress.message}
                  </Text>
                  {progress.current != null &&
                    progress.total != null &&
                    progress.total > 1 && (
                      <Text variant="muted" className="text-xs">
                        {progress.current}/{progress.total}
                      </Text>
                    )}
                </View>
              </View>
            )}

            {/* ----- RESULT MESSAGE ----- */}
            {!isProcessing && (
              <Text
                variant="muted"
                className={`text-center text-sm ${isFailed ? "text-destructive" : ""}`}
              >
                {progress.message}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}
