import { Text, View } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
// Import your auth client or context, e.g., Supabase or a custom Auth hook
// import { supabase } from "@/lib/supabase";
// import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  // Example if using custom hook:
  // const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      // 3. SecureStore / AsyncStorage clearance example:
      await AsyncStorage.removeItem("userToken");
      router.replace("/(auth)/landing");
      Alert.alert("Success", "You have been logged out.");
    } catch (error: any) {
      Alert.alert(
        "Error Logging Out",
        error.message || "An unexpected error occurred.",
      );
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: handleLogout },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Page</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Expands the view to fill the entire available screen
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#FF3B30", // Standard alert/danger red
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
