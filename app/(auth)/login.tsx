import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function LoginScreen() {
  const [selectedTab, setSelectedTab] = useState<"Phone" | "Email" | "Social">(
    "Phone",
  );
  const [countryCode, setCountryCode] = useState("+62");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Top Bar Navigation */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.push("/landing")}
              style={styles.circleButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleButton} activeOpacity={0.7}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
          <View style={styles.mainSection}>
            {/* Main Title & Subtitle */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Let’s join with us</Text>
              <Text style={styles.subtitle}>
                Enter your phone number/social{"\n"}account to get started.
              </Text>
            </View>

            {/* Tab Switcher (Phone, Email, Social) */}
            <View style={styles.tabContainer}>
              {(["Phone", "Email", "Social"] as const).map((tab) => {
                const isActive = selectedTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tabButton,
                      isActive && styles.activeTabButton,
                    ]}
                    onPress={() => setSelectedTab(tab)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[styles.tabText, isActive && styles.activeTabText]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tab Content Section */}
            <View style={styles.contentSection}>
              {selectedTab === "Phone" && (
                <View>
                  <Text style={styles.fieldLabel}>Phone number</Text>
                  <View style={styles.phoneInputRow}>
                    {/* Country Selector */}
                    <TouchableOpacity
                      style={styles.countryPicker}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.flag}>🇮🇩</Text>
                      <Text style={styles.countryCodeText}>{countryCode}</Text>
                      <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
                    </TouchableOpacity>

                    {/* Phone Number Input */}
                    <View style={styles.numberInputContainer}>
                      <TextInput
                        style={styles.numberInput}
                        placeholder="8123 3456 6789"
                        placeholderTextColor="#C4C4C6"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />
                    </View>
                  </View>
                </View>
              )}

              {selectedTab === "Email" && (
                <View>
                  <Text style={styles.fieldLabel}>Email address</Text>
                  <View style={styles.numberInputContainer}>
                    <TextInput
                      style={styles.numberInput}
                      placeholder="example@mail.com"
                      placeholderTextColor="#C4C4C6"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              )}

              {selectedTab === "Social" && (
                <View style={{ alignItems: "center", paddingTop: 20 }}>
                  <Text style={{ color: "#8E8E93" }}>
                    Social Login Options Here
                  </Text>
                </View>
              )}
            </View>

            {/* Bottom Continue Button */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  phoneNumber.trim().length > 0 && styles.activeContinueButton,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.continueButtonText,
                    phoneNumber.trim().length > 0 &&
                      styles.activeContinueButtonText,
                  ]}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  mainSection: {
    marginTop: 100,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 28,
    marginTop: -10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    marginTop: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  activeTabButton: {
    backgroundColor: "#121212",
    borderColor: "#121212",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  contentSection: {},
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  phoneInputRow: {
    flexDirection: "row",
    gap: 10,
  },
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    backgroundColor: "#FFFFFF",
    gap: 6,
  },
  flag: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  numberInputContainer: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  numberInput: {
    fontSize: 15,
    color: "#1A1A1A",
  },
  bottomSection: {
    paddingBottom: 20,
    marginTop: 10,
  },
  continueButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },
  activeContinueButton: {
    backgroundColor: "#121212",
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#A0A0A0",
  },
  activeContinueButtonText: {
    color: "#FFFFFF",
  },
});
