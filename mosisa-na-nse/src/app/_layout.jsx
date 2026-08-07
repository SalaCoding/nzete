import { Stack } from 'expo-router';
import { useAuthUserStore } from '../library/authUserStore';
import { syncUserToStoryStore } from '../library/useSyncAuthToStoryStore';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';

const RootLayout = () => {
  const { token, _hasHydrated } = useAuthUserStore();
  const isSignedIn = !!token;

  useEffect(() => {
    if (_hasHydrated) {
      syncUserToStoryStore();
    }
  }, [_hasHydrated]);

  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      {/* Standard routing split for signed-in vs guest users */}
      {isSignedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
};

export default RootLayout;