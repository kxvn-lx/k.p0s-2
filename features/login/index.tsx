import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native"

// ----- Login Screen -----
export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 justify-center p-4 bg-background">
        <Card>
          <CardContent className="gap-2">
            <View className="gap-2">
              <Label nativeID="email">Email</Label>
              <Input
                placeholder="nama@email.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                editable={!isLoading}
                aria-labelledby="email"
              />
            </View>
            <View className="gap-2">
              <Label nativeID="password">Password</Label>
              <Input
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                editable={!isLoading}
                aria-labelledby="password"
              />
            </View>
            <Button
              title={isLoading ? "Masuk..." : "Masuk"}
              onPress={async () => {
                if (!email || !password) {
                  Alert.alert("Error", "Silakan masukkan email dan password")
                  return
                }

                setIsLoading(true)
                try {
                  await signIn(email, password)
                } catch (error) {
                  Alert.alert(
                    "Gagal Masuk",
                    error instanceof Error ? error.message : "Gagal masuk"
                  )
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading}
            />
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingView>
  )
}
