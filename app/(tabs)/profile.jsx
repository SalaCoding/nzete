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
import Svg, { Defs, RadialGradient, LinearGradient, Stop, G, Ellipse, Path, Circle } from 'react-native-svg';

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

// Tree SVG Component (Defaults are here, but we override them below)
const TreeSvg = ({ width = 250, height = 200 }) => (
  <Svg width={width} height={height} viewBox="0 0 512 512">
    <Defs>
      <RadialGradient id="canopyGradient" cx="70%" cy="30%" r="80%" fx="70%" fy="30%">
        <Stop offset="0%" stopColor="#AEEA00" stopOpacity="1" />
        <Stop offset="40%" stopColor="#558B2F" stopOpacity="1" />
        <Stop offset="100%" stopColor="#1B5E20" stopOpacity="1" />
      </RadialGradient>
      
      <LinearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#3E2723" stopOpacity="1" />
        <Stop offset="40%" stopColor="#5D4037" stopOpacity="1" />
        <Stop offset="100%" stopColor="#3E2723" stopOpacity="1" />
      </LinearGradient>
    </Defs>

    {/* Ground Shadow/Grass Base */}
    <G id="base">
      <Ellipse cx="256" cy="470" rx="140" ry="25" fill="#33691E" opacity="0.8" />
      <Path d="M150,470 Q256,460 362,470 L350,480 Q256,490 160,480 Z" fill="#558B2F" />
      <Path d="M180,475 l5,-15 l5,15 M200,478 l-5,-20 l10,20 M250,480 l0,-25 l5,25 M300,478 l8,-18 l-4,18 M330,475 l-5,-15 l8,15" 
            stroke="#558B2F" strokeWidth="2" fill="none"/>
    </G>

    {/* Trunk */}
    <G id="trunk">
      <Path d="M230,470 Q256,470 282,470 Q275,400 270,350 Q300,300 340,280 L330,270 Q290,290 265,330 L265,280 Q280,240 290,200 L275,200 Q265,240 256,280 Q240,240 220,210 L210,220 Q230,250 245,290 Q220,310 180,300 L185,315 Q220,325 242,350 Q237,400 230,470 Z" 
            fill="url(#trunkGradient)"/>
      <Path d="M245,380 Q256,400 250,450 M265,360 Q260,400 268,440" stroke="#3E2723" strokeWidth="2" fill="none" opacity="0.6"/>
    </G>

    {/* Canopy */}
    <G id="canopy">
      <Path d="M100,250 Q80,350 200,400 Q320,420 420,350 Q480,250 400,150 Q300,50 200,100 Q50,150 100,250 Z" 
            fill="#1B5E20" />

      <Circle cx="180" cy="220" r="70" fill="#33691E" />
      <Circle cx="330" cy="220" r="75" fill="#33691E" />
      <Circle cx="256" cy="150" r="80" fill="#558B2F" />
      <Circle cx="150" cy="300" r="60" fill="#33691E" />
      <Circle cx="360" cy="300" r="60" fill="#33691E" />
      
      <Circle cx="300" cy="130" r="60" fill="#7CB342" opacity="0.9"/>
      <Circle cx="380" cy="180" r="60" fill="#9CCC65" opacity="0.9"/>
      <Circle cx="240" cy="100" r="50" fill="#AED581" opacity="0.8"/>
      <Circle cx="420" cy="250" r="50" fill="#8BC34A" opacity="0.8"/>
      
      <Circle cx="350" cy="100" r="40" fill="#DCEDC8" opacity="0.6"/>
      <Circle cx="430" cy="200" r="30" fill="#DCEDC8" opacity="0.6"/>

      <Path d="M120,250 Q100,350 256,380 Q412,350 430,220 Q412,80 256,80 Q100,100 120,250 Z" 
            fill="url(#canopyGradient)" opacity="0.6" />
      
      <G fill="#689F38">
          <Circle cx="100" cy="250" r="10" />
          <Circle cx="90" cy="280" r="12" />
          <Circle cx="120" cy="350" r="15" />
          <Circle cx="450" cy="250" r="10" />
          <Circle cx="440" cy="300" r="12" />
          <Circle cx="256" cy="60" r="15" />
      </G>
    </G>
  </Svg>
);

export const ProfileScreen = () => {
  const { width } = Dimensions.get("window");
  const isTablet = width >= 768;
  const avatarSize = isTablet ? 100 : 80;

  const user = useAuthUserStore((s) => s.user);
  const {
    ratedStories,
    fetchRatedStories,
    fetchRatingStats,
    userId,
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
              {/* Header / Image -> REDUCED SIZE HERE */}
              <View style={styles.imageContainer}>
                {/* 👇 CHANGE WIDTH AND HEIGHT HERE TO REDUCE SIZE 👇 */}
                <TreeSvg width={150} height={120} />
              </View>
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
    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.06)',
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
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
});