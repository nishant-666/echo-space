import { Text, View } from "@/components/Themed";
import { StyleSheet } from "react-native";

export default function Chats() {
  return (
    <View style={styles.container}>
      <Text>Chat Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Expands the view to fill the entire available screen
    justifyContent: "center", // Optional: centers content vertically
    alignItems: "center", // Optional: centers content horizontally
  },
});
