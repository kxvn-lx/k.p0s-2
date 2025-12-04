import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { useAuth } from "@/lib/auth-context"
import { isDev } from "@/lib/utils"
import { useState } from "react"
import { KeyboardAvoidingView, Platform, View } from "react-native"
import InfoRow from "@/components/shared/info-row"

// ----- Login Screen -----
export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background items-center justify-center"
    >
      <View className="max-w-xs w-full mx-auto">
        <View className="bg-card rounded-[--radius] border-border border">
          <InfoRow
            leadingElement="EMAIL"
            trailingElement={
              <Input
                placeholder="nama@email.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                editable={!isLoading}
                className="border-none w-40 text-right"
              />
            }
            primarySide="trailing"
          />
          <InfoRow
            isLast
            leadingElement="PASSWORD"
            trailingElement={
              <Input
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                editable={!isLoading}
                className="border-none w-40 text-right"
              />
            }
            primarySide="trailing"
          />

        </View>

        <View className="mt-4 flex-col gap-2">
          <Button
            title={isLoading ? "MASUK..." : "MASUK"}
            onPress={async () => {
              if (!email || !password) {
                toast.error("ERROR", "MUSTI ISI EMAIL DG PASSWORD")
                return
              }

              setIsLoading(true)
              try {
                await signIn(email, password)
              } catch (error) {
                toast.error(
                  "GAGAL MASUK",
                  error instanceof Error ? error.message : "Gagal masuk"
                )
              } finally {
                setIsLoading(false)
              }
            }}
            disabled={isLoading}
          />
          {isDev() ? (
            <Button
              variant="outline"
              title="Masuk (dev)"
              onPress={async () => {
                // quick dev login
                setIsLoading(true)
                try {
                  await signIn("kevin@bjb.com", "adminadmin")
                } catch (error) {
                  toast.error(
                    "Gagal Masuk (dev)",
                    error instanceof Error ? error.message : "Gagal masuk"
                  )
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading}
            />
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
