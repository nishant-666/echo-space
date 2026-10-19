import { Contact, ContactField, requestPermissionsAsync } from "expo-contacts";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      // 1. Request contact permissions
      const { status } = await requestPermissionsAsync();

      if (status === "granted") {
        setPermissionGranted(true);

        // 2. Fetch all local phone contacts
        const data = await Contact.getAllDetails([
          ContactField.FULL_NAME,
          ContactField.PHONES,
          ContactField.IMAGE,
        ]);

        if (data.length > 0) {
          try {
            // 3. Extract phone numbers to send to your backend
            // (Make sure to format/clean phone numbers as needed for your backend)
            const phoneNumbers = data
              .map((contact) => contact.phones?.[0]?.number)
              .filter(Boolean);

            // 4. Call your backend API to check which numbers have platform accounts
            /* 
            const response = await fetch("https://your-api.com/api/match-contacts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phoneNumbers }),
            });
            const registeredUsers = await response.json(); 
            */

            // --- SIMULATED BACKEND FILTER FOR DEMO PURPOSES ---
            // Filtering only every alternate contact as if they have an account on the platform
            const platformContacts = data.filter((_, index) => index % 2 === 0);
            // ---------------------------------------------------

            // 5. Sort the matched contacts alphabetically by fullName
            const sortedData = platformContacts.sort((a, b) =>
              (a.fullName || "").localeCompare(b.fullName || ""),
            );

            setContacts(sortedData);
          } catch (error) {
            console.error("Failed to sync contacts with backend:", error);
          }
        }
      } else {
        setPermissionGranted(false);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>
          Permission to access contacts was denied.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.chatsHeader}>
        <Text style={styles.chatsTitle}>Platform Contacts</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.iconText}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Contact List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chatList}>
          {contacts.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>
                No contacts found on this platform.
              </Text>
            </View>
          ) : (
            contacts.map((contact, index) => {
              const phoneNumber =
                contact.phones?.[0]?.number || "No phone number";
              const displayName = contact.fullName || "Unknown Contact";
              const avatarUri =
                contact.imageAvailable && contact.image?.uri
                  ? contact.image.uri
                  : `https://i.pravatar.cc/150?img=${(index % 70) + 1}`;

              return (
                <TouchableOpacity
                  key={contact.id || index.toString()}
                  style={styles.chatItem}
                >
                  <Image
                    source={{ uri: avatarUri }}
                    style={styles.chatAvatar}
                  />

                  <View style={styles.chatInfo}>
                    <View style={styles.chatInfoTop}>
                      <Text style={styles.chatName} numberOfLines={1}>
                        {displayName}
                      </Text>
                    </View>

                    <View style={styles.chatInfoBottom}>
                      <View style={styles.messageRow}>
                        <Text style={styles.chatMessage} numberOfLines={1}>
                          {phoneNumber}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 24,
    flexGrow: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  chatsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  chatsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
  },
  moreButton: {
    padding: 4,
  },
  iconText: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "bold",
    letterSpacing: -1,
  },
  chatList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatInfoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    flex: 1,
    marginRight: 8,
  },
  chatMessage: {
    fontSize: 14,
    color: "#8E8E93",
    flex: 1,
  },
});
