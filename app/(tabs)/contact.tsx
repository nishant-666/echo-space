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
        // 2. Fetch contacts with images and phone numbers using the modern API
        const data = await Contact.getAllDetails([
          ContactField.FULL_NAME,
          ContactField.PHONES,
          ContactField.IMAGE,
        ]);

        if (data.length > 0) {
          const sortedData = data.sort((a, b) =>
            (a.fullName || "").localeCompare(b.fullName || ""),
          );
          setContacts(sortedData);
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
        <Text style={styles.chatsTitle}>Contacts</Text>
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
          {contacts.map((contact, index) => {
            const phoneNumber =
              contact.phones?.[0]?.number || "No phone number";
            const displayName = contact.fullName || "Unknown Contact";
            const avatarUri =
              contact.imageAvailable && contact.image?.uri
                ? contact.image.uri
                : `https://i.pravatar.cc/150?img=${(index % 70) + 1}`; // Dynamic avatar fallback

            return (
              <TouchableOpacity
                key={contact.id || index.toString()}
                style={styles.chatItem}
              >
                <Image source={{ uri: avatarUri }} style={styles.chatAvatar} />

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
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Forced pure white background
    paddingTop: 50,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 24,
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
    backgroundColor: "#FFFFFF", // Keeps header solid white when items scroll underneath
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
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 12,
    color: "#8E8E93",
  },
  chatInfoBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  checkMark: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "bold",
  },
  chatMessage: {
    fontSize: 14,
    color: "#8E8E93",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#F2C94C",
    borderRadius: 11,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
});
