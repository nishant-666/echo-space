import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Retrieve stored token
        const token = await AsyncStorage.getItem("userToken");

        if (token) {
          setIsLoggedIn(true);
        } else {
          console.log("No token found");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to fetch auth token:", error);
        setIsLoggedIn(false);
      } finally {
        // Always stop loading when check completes
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 1. Show a loading screen/spinner while AsyncStorage is reading the token
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 2. Once loading is done, redirect based on the actual login status
  if (isLoggedIn) {
    return <Redirect href="/(tabs)/chats" />;
  }

  return <Redirect href="/(auth)/landing" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
