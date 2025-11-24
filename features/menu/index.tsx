import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Alert, View } from "react-native"

// ----- Menu Screen -----
export default function Menu() {
  const { signOut, user } = useAuth()

  return (
    <View className="flex-1 justify-center items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Menu</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <Button
            title="Keluar"
            variant="destructive"
            onPress={async () => {
              try {
                await signOut()
              } catch (error) {
                Alert.alert(
                  "Gagal Keluar",
                  error instanceof Error ? error.message : "Gagal keluar"
                )
              }
            }}
          />
        </CardContent>
      </Card>
    </View>
  )
}
