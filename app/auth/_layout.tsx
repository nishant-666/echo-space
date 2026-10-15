import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Automatically loads login, signup, etc. from the (auth) folder */}
      <Stack.Screen name="/landing" />
      <Stack.Screen name="/login" />
    </Stack>
  );
}
