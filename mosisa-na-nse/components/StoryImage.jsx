import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

/**
 * StoryImage component using expo-image for better performance and control.
 * Set the default width/height for smaller display.
 * - `resizeMode` prop is supported by expo-image.
 */
export function StoryImage({
  uri,
  width = 128,      // Small default width
  height = 176,      // Small default height
  resizeMode = 'cover'
}) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri }}
        style={{ width, height, borderRadius: 16 }}
        resizeMode={resizeMode}      // expo-image accepts this prop
        transition={300}             // Optional: fade in effect for better UX
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default StoryImage;