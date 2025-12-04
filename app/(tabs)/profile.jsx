import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  StatusBar,
  RefreshControl,
  Dimensions,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from "@expo/vector-icons";
import {
  useAuthUserStore,
  checkUser,
  logout
} from "../../library/authUserStore";
import { useStoryStore } from "../../library/storyStore";
import { RatedStoryList, selectUserRating } from "../../components/RatedStory";
import { syncUserToStoryStore } from "../../library/useSyncAuthToStoryStore";
import { API_URL } from "../../constants/api";

const MAX_BASE64_SIZE_KB = 5000;
const MIN_RATING_SCORE = 1;

const ProfileScreen = () => {
  const { width } = Dimensions.get("window");
  const isTablet = width >= 768;
  const avatarSize = isTablet ? 100 : 80;

  const user = useAuthUserStore((s) => s.user);
  const {
    ratedStories,
    fetchRatedStories,
    ratingStats,
    fetchRatingStats,
    ratingStatsLoading,
    userId,
    ratingStatsError,
    lastRatingUpdate,
  } = useStoryStore();

  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchRatedStories(),
        fetchRatingStats()
      ]);
    } catch (e) {
      console.log("Refresh error", e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkUser();
    syncUserToStoryStore();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchRatedStories();
      fetchRatingStats();
    }
  }, [userId, lastRatingUpdate, fetchRatedStories, fetchRatingStats]);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Required", "We need access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || ! result.assets?. length) return;

    const asset = result.assets[0];
    let manipResult;

    try {
      manipResult = await ImageManipulator.manipulateAsync(
        asset. uri,
        [{ resize: { width: 600 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true
        }
      );
    } catch (error) {
      console.error('Error manipulating image:', error);
      Alert. alert("Image Error", "Could not process the selected image.");
      return;
    }
    
    if (!manipResult?. base64) {
      Alert.alert("Image Error", "Could not retrieve image data.");
      return;
    }
    
    const base64SizeKB = (manipResult.base64.length * 3) / 4 / 1024;
    if (base64SizeKB > MAX_BASE64_SIZE_KB) {
      Alert.alert("Image too large", "Please choose a smaller image.");
      return;
    }

    setImage(manipResult. uri);
    await uploadImage(manipResult. base64);
  }

  const uploadImage = useCallback(async (base64) => {
    setUploading(true);
    const { token } = useAuthUserStore.getState();

    try {
      const res = await fetch(`${API_URL}/api/auth/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON. stringify({ image: base64 }),
      });

      if (! res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed: ${res.status} - ${errText}`);
      }

      const data = await res.json();
      
      if (data?.user) {
        useAuthUserStore.setState({ user: data.user });
        Alert.alert("Success", "Profile picture updated!");
      } else {
        throw new Error("Server did not return user object.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Upload Failed", err.message);
    } finally {
      setUploading(false);
    }
  }, []);

  const confirmLogout = () => {
    Alert.alert("Kobima? ", "Osili na mobembo na oyo?", [
      { text: "Tika", style: "cancel" },
      {
        text: "Kobima",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const storiesWithMinRating = ratedStories.filter(story => {
    const score = selectUserRating(story, userId);
    return score >= MIN_RATING_SCORE;
  });

  const imageSource = image
    ? { uri: image }
    : user?.profilePicture
    ? { uri: user.profilePicture }
    : require('../../assets/images/learning-cuate.png');

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.flexGrow}>
        <ScrollView
          style={styles.flex}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.container}>
            <View style={styles.profile}>
              <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
                <Ionicons 
                  name="log-out-outline" 
                  size={22} 
                  color="#0f0f4a" 
                  style={styles.logoutIcon} 
                />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>

              <View style={styles.profileCard}>
                <Image
                  source={imageSource}
                  style={[
                    styles. avatar,
                    {
                      width: avatarSize,
                      height: avatarSize,
                      borderRadius: avatarSize / 2,
                    }
                  ]}
                  onError={e => console.log('[Image] Load error:', e.nativeEvent)}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.greeting}>👋 Mbote</Text>
                  <Text style={styles.username}>{user?.username || "Guest"}</Text>
                  <Text style={styles.email}>{user?.email || "Not logged in"}</Text>

                  <TouchableOpacity 
                    onPress={pickImage} 
                    style={styles.avatarButton} 
                    disabled={uploading}
                  >
                    <Text style={styles.avatarButtonText}>
                      {uploading ? "Uploading..." : "Pona elilingi"}
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.joined}>
                    {user?.createdAt
                      ? `Joined: ${new Date(user.createdAt).toLocaleDateString()}`
                      : "Loading join date..."}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <RatedStoryList
                userId={userId}
                minScore={MIN_RATING_SCORE}
                header={`Masolo oyo osepeli na yango (${storiesWithMinRating.length})`}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Rating Summary</Text>
              {ratingStatsLoading ? (
                <Text style={styles.loadingText}>Loading rating stats...</Text>
              ) : ratingStatsError ? (
                <Text style={styles.errorText}>Error: {ratingStatsError}</Text>
              ) : ratingStats ?  (
                <View style={styles.statsContainer}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total Ratings:</Text>
                    <Text style={styles.statValue}>{ratingStats.totalRatings || 0}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Average Score:</Text>
                    <Text style={styles.statValue}>
                      {ratingStats.averageScore?. toFixed(1) || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles. statRow}>
                    <Text style={styles.statLabel}>Most Rated Category:</Text>
                    <Text style={styles.statValue}>
                      {ratingStats.mostRatedCategory || 'N/A'}
                    </Text>
                  </View>
                  {ratingStats.lastRatedAt && (
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Last Rated:</Text>
                      <Text style={styles.statValue}>
                        {new Date(ratingStats. lastRatedAt). toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.emptyText}>No rating stats available.</Text>
              )}
            </View>
          </View>
        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  profile: {
    marginBottom: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    maxWidth: 500,
  },
  avatar: {
    backgroundColor: "#eee",
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    textAlign: 'right',
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginLeft: 10,
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    color: "#666",
    marginLeft: 10,
    marginBottom: 16,
  },
  avatarButton: {
    backgroundColor: "#4a487d",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 6,
    marginLeft: 10,
    alignSelf: "flex-start",
  },
  avatarButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#ffecec",
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#d9534f",
    fontSize: 14,
    fontWeight: "600",
  },
  joined: {
    marginTop: 4,
    fontSize: 12,
    color: "#888",
    marginLeft: 10,
  },
  section: {
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  chartContainer: {
    marginBottom: 16,
  },
  chartTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  statsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
    textAlign: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: "#d9534f",
    textAlign: 'center',
  },
});