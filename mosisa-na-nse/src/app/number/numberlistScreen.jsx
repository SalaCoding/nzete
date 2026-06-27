import React from "react";
import { Text, StyleSheet, Platform} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import NumberBrowser from "../../components/number"; // adjust path as needed
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

export default function NumberListScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 16, flexGrow: 1 }}>
      <Ionicons
        name="arrow-back"
        size={28}
        color="black"
        onPress={() => router.back()}
        style={{ position: 'absolute', top: 90, left: 16, zIndex: 1 }}
      />
      <Text style={styles.header}>Motango</Text>
      <NumberBrowser />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: Platform.OS === 'ios' ? 20 : 19,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
});