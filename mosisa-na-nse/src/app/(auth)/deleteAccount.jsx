import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthUserStore } from "../../library/authUserStore"; // ⚠️ Adjust this path to your exact file location

export default function DeleteAccount() {
  const router = useRouter();

  // 2. ✅ Pull token and clearAuth action from your store
  const token = useAuthUserStore((state) => state.token);
  const clearAuth = useAuthUserStore((state) => state.clearAuth);

  const deleteAccount = async () => {
    try {
      // 3. ✅ Check if token is available locally before even calling the API
      if (!token) {
        Alert.alert("Session Expired", "Please log in again.");
        router.replace("/(auth)");
        return;
      }

      const res = await fetch("https://nzete.onrender.com/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Will now pass a real token string instead of null
        },
      });

      const contentType = res.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const fallbackText = await res.text();
        console.error("Non-JSON Server Output Received:", fallbackText);
        Alert.alert("Error", `Server Error Status: ${res.status}`);
        return;
      }

      if (!res.ok) {
        // Shows real backend error message (e.g., CastError details)
        Alert.alert("Error", data.error || data.message || "Could not delete account");
        return;
      }

      // 4. ✅ Safely wipe the entire local Zustand auth store state
      if (typeof clearAuth === "function") {
        clearAuth();
      }

      // 5. Show successful notification to the user
      Alert.alert("Account Deleted", "Your account has been permanently removed.");

      // 6. ✅ Route directly back to your auth directory target screen name
      router.replace("/login"); 

    } catch (error) {
      console.error("DELETE ACCOUNT RUNTIME ERROR:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  return (
    <>
      <View>
      <Ionicons
        name="arrow-back"
        size={28}
        color="black"
        onPress={() => router.back()}
        style={{ position: 'absolute', top: 90, left: 16, zIndex: 1 }}
      />
      </View>
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
    </>
  );
}
