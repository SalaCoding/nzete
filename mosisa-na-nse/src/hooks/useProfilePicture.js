import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { SaveFormat } from 'expo-image-manipulator';
import { useAuthUserStore, updateUser } from '../library/authUserStore'; // <-- import updateUser
import { API_URL } from '../constants/api';

export const useProfilePicture = () => {
  const user = useAuthUserStore((s) => s.user);
  const token = useAuthUserStore((s) => s.token);
  const [uploading, setUploading] = useState(false);

  const changeProfilePicture = useCallback(async () => {
    if (!user) return { success: false, error: 'Not logged in' };
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return { success: false, error: 'Permission denied' };

    const pick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (pick.canceled || !pick.assets?.length) return { success: false };

    const asset = pick.assets[0];
    const manipResult = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: 400 } }],
      { compress: 0.5, format: SaveFormat.JPEG, base64: true }
    );
    if (!manipResult.base64) return { success: false, error: 'Processing failed' };

    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: manipResult.base64,
          filename: `avatar_${Date.now()}.jpg`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      const bustedUrl = `${data.user.profilePicture}?t=${Date.now()}`;

      // Use updateUser to sync with backend and Zustand
      await updateUser({ profilePicture: bustedUrl });

      return { success: true };
    } catch (err) {
      console.error('[useProfilePicture] error:', err.message);
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  }, [user, token]);

  // Zustand will update automatically after updateUser
  const profilePicture = user?.profilePicture;

  return { uploading, changeProfilePicture, profilePicture };
};