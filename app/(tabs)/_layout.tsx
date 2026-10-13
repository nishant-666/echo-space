import { Text, View } from "@/components/Themed";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Tabs, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#212121",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e5ea",
          height: 100,
          margin: 5,
        },
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIconStyle: {
            marginTop: 10,
          },
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          tabBarButton: () => (
            <TouchableOpacity
              style={styles.centerButtonContainer}
              activeOpacity={0.8}
              onPress={() => {
                // Navigate to your new chat / compose screen
                router.push("/contacts");
              }}
            >
              <View style={styles.centerButton}>
                <AntDesign name="plus" size={18} color="#fff" />
                <Text style={styles.buttonText}>New Chat</Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIconStyle: {
            marginTop: 10,
          },
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "car.side.rear.crop.trunk.partition.fill",
                android: "settings",
                web: "settings",
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    width: 140,
    height: 40,
    borderRadius: 29,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // Pops the button up above the tab bar frame
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    flexDirection: "row",
    gap: 8,
    elevation: 8, // Adds shadow depth on Android
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
