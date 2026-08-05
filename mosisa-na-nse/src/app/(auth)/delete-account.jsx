import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DeleteAccount() {
  const router = useRouter();

  const deleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch("https://nzete.onrender.com/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Could not delete account");
        return;
      }

      // Remove token and logout
      await AsyncStorage.removeItem("token");

      Alert.alert("Account Deleted", "Your account has been permanently removed.");

      router.replace("/login"); // redirect to login
    } catch (_error) {
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Delete Account</Text>
      <Text style={{ marginBottom: 20, textAlign: 'center' }}>
        Deleting your account is permanent and cannot be undone. All your data will be lost.
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
        }}
        onPress={() => {
          Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: deleteAccount,
              }
            ]
          );
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}
