import { Modal, View, ActivityIndicator } from "react-native"
import { Text } from "@/components/ui/text"
import { Check, AlertCircle, FileText, Package, ClipboardList, ShieldCheck } from "lucide-react-native"
import { Icon } from "@/components/ui/icon"
import type { ProgressStep } from "@/features/penjualan/api/penjualan.service"

// ----- TYPES -----
interface ProgressDialogProps {
  visible: boolean
  progress: ProgressStep | null
}

// ----- STEP CONFIG -----
const STEPS = [
  { key: "validating", label: "Validasi", icon: ShieldCheck },
  { key: "penjualan", label: "Transaksi", icon: FileText },
  { key: "details", label: "Stok", icon: ClipboardList },
  { key: "stock", label: "Stok Qty", icon: Package },
  { key: "audit", label: "Riwayat", icon: ClipboardList },
] as const

const STEP_ORDER = STEPS.map((s) => s.key)

// ----- COMPONENT -----
export function ProgressDialog({ visible, progress }: ProgressDialogProps) {
  if (!progress) return null

  const isCompleted = progress.step === "completed"
  const isFailed = progress.step === "failed"
  const currentStepIndex = STEP_ORDER.indexOf(progress.step as typeof STEP_ORDER[number])

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-background w-full max-w-sm rounded-[--radius] px-2 py-8 gap-2">
          {/* Header */}
          <View className="items-center gap-2">
            {isCompleted ? (
              <View className="size-10 rounded-full bg-green-500 items-center justify-center">
                <Icon as={Check} className="text-white" size={20} />
              </View>
            ) : isFailed ? (
              <View className="size-10 rounded-full bg-destructive items-center justify-center">
                <Icon as={AlertCircle} className="text-white" size={20} />
              </View>
            ) : (
              <ActivityIndicator size="large" className="text-primary" />
            )}
            <Text className="font-mono-bold text-lg text-center">
              {isCompleted ? "Selesai" : isFailed ? "Gagal" : "Transaksi lagi ba proses"}
            </Text>
          </View>

          {/* Step Indicators */}
          {!isCompleted && !isFailed && (
            <View className="flex-row justify-between px-2">
              {STEPS.map((step, index) => {
                const isActive = step.key === progress.step
                const isDone = currentStepIndex > index

                return (
                  <View key={step.key} className="items-center gap-1">
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center ${isDone ? "bg-green-500" : isActive ? "bg-primary" : "bg-muted"
                        }`}
                    >
                      {isDone ? (
                        <Icon as={Check} size={16} />
                      ) : (
                        <Icon
                          as={step.icon}
                          className={isActive ? "text-primary-foreground" : "text-muted-foreground"}
                          size={16}
                        />
                      )}
                    </View>
                    <Text className={`text-xs ${isActive ? "text-foreground font-mono-bold" : "text-muted-foreground"}`}>
                      {step.label}
                    </Text>
                  </View>
                )
              })}
            </View>
          )}

          {/* Progress Message */}
          <View className="gap-1">
            <Text className="text-center text-sm">
              {progress.message}
            </Text>
            {progress.current != null && progress.total != null && progress.total > 1 && (
              <Text className="text-center text-xs text-muted-foreground">
                {progress.current}/{progress.total}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}
