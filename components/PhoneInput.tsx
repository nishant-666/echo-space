import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COUNTRIES } from "../assets/json/countryCodes";

export default function PhoneInput({ onSelect }: any) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = COUNTRIES.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dial_code.includes(searchQuery),
  );

  return (
    <View style={styles.container}>
      {/* Trigger Button */}
      <TouchableOpacity
        style={styles.countryPicker}
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.flag}>{selectedCountry.flag}</Text>
        <Text style={styles.countryCodeText}>{selectedCountry.dial_code}</Text>
        <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
      </TouchableOpacity>

      {/* Squeezed Modal / Popup Box */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country Code</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={20} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search country..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* Country List */}
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.alpha2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setSelectedCountry(item);
                    onSelect(item);
                    setVisible(false);
                    setSearchQuery("");
                  }}
                >
                  <Text style={styles.countryItemText}>
                    {item.flag} {item.name}
                  </Text>
                  <Text style={styles.dialCodeText}>{item.dial_code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    alignSelf: "flex-start",
  },
  flag: {
    fontSize: 18,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  /* Squeezed Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark backdrop
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%", // Squeezed width
    maxHeight: "65%", // Squeezed height limit
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  searchInput: {
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 10,
    color: "#1A1A1A",
  },
  countryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  countryItemText: {
    fontSize: 14,
    color: "#1A1A1A",
  },
  dialCodeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
});
