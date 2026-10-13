import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthLayout from "./(auth)/_layout";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* <Slot /> */}
        <AuthLayout />
        {/* <LoginScreen /> */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
