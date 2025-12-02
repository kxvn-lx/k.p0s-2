import { Stack } from "expo-router"

export default function DebugLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Debug Menu",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="progress"
        options={{
          title: "Progress Dialog",
        }}
      />
    </Stack>
  )
}
