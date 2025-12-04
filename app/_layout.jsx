import { Stack } from 'expo-router';
import { useAuthUserStore } from '../library/authUserStore';
import { syncUserToStoryStore } from '../library/useSyncAuthToStoryStore';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';

const AuthLayout = () => {
  const { token, _hasHydrated } = useAuthUserStore();
  const isSignedIn = !!token;

  useEffect(() => {
    syncUserToStoryStore();
  }, );

  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
};

export default AuthLayout;