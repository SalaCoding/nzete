import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useAuthUserStore } from "../../library/authUserStore";

export default function ChangeUsername() {
  const router = useRouter();
  const [newName, setNewName] = useState("");

  const handleChangeUsername = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Session Expired", "Please log in again.");
        router.replace("/(auth)");
        return;
      }

      const res = await fetch("https://nzete.onrender.com/api/auth/change-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newUsername: newName }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.error || data.message || "Could not change username");
        return;
      }

      // ⭐ Update global store instantly
      const { user, token: storedToken } = useAuthUserStore.getState();
      useAuthUserStore.getState().setAuth(storedToken, {
        ...user,
        username: data.username,
      });

      Alert.alert("Success", "Your username has been updated.");
      router.replace("/(tabs)/profile");

    } catch (error) {
      Alert.alert("Error", "Something went wrong. Try again.");
      console.error("Error changing username:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Change Username</Text>

      <TextInput
        value={newName}
        onChangeText={setNewName}
        placeholder="Enter new username"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginVertical: 20,
          borderRadius: 8,
        }}
      />

      <Pressable
        onPress={handleChangeUsername}
        style={{
          backgroundColor: "#0f0f4a",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
      </Pressable>
    </View>
  );
}

