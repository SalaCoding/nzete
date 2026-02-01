// components/ProfileAvatar.js
import React from 'react'
import { View, Image, Button, StyleSheet } from 'react-native'
import { useProfilePicture } from '../hooks/useProfilePicture'
//import { useAuthUserStore } from '../library/authUserStore'

export default function ProfileAvatar() {
  const { changeProfilePicture, uploading, profilePicture } = useProfilePicture();
  const source = profilePicture
    ? { uri: profilePicture }
    : require('../assets/images/icon.png');

  return (
    <View style={styles.container}>
      <Image source={source} style={{ width: 120, height: 120, borderRadius: 60 }} />
      <Button
        title={uploading ? 'Uploading...' : 'Change Picture'}
        onPress={changeProfilePicture}
        disabled={uploading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 10
  }
})
