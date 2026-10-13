import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LandingScreen() {
  const handleNavigateToLogin = () => {
    // Navigate to your login screen page (e.g., app/login.tsx)
    router.push("/login");
  };

  const handleNavigateToSignUp = () => {
    // Navigate to your sign up screen page (e.g., app/signup.tsx)
    // router.push("/signup");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="flash" size={32} color="#007AFF" />
            </View>
            <Text style={styles.title}>Welcome to EchoSpace! 👋</Text>
            <Text style={styles.subtitle}>Share with anyone, anywhere.</Text>
            <Text style={styles.subtitle}>
              A home for all the groups in your life.
            </Text>
          </View>

          {/* Form Section / Sign In */}
          <View style={styles.formContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={handleNavigateToLogin}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer / Create an Account */}
          <TouchableOpacity
            style={styles.footerContainer}
            activeOpacity={0.8}
            onPress={handleNavigateToSignUp}
          >
            <Text style={styles.signUpButtonText}>Create an Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F0F6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#f2c110",
    height: 52,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#f2c110",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  footerContainer: {
    backgroundColor: "#FFFFFF",
    height: 52,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  signUpButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});
