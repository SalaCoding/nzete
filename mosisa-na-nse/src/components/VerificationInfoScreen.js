import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const VerificationInfoScreen = ({ email }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="mail-outline" size={64} color="#007AFF" style={{ marginBottom: 24 }} />
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.desc}>
        We&apos;ve sent a verification link to{'\n'}
        <Text style={styles.email}>{email || 'your email address'}</Text>
      </Text>
      <Text style={styles.helpText}>
        Please check your inbox and click the link to continue.
      </Text>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace('/login')}
        accessibilityLabel="Go to login"
      >
        <Ionicons name="log-in-outline" size={18} color="#007AFF" />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#007AFF', marginBottom: 10, textAlign: 'center' },
  desc: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  email: { fontWeight: 'bold', color: '#007AFF' },
  helpText: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 32 },
  backBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F6FF', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 24 },
  backText: { color: '#007AFF', fontWeight: '600', marginLeft: 8, fontSize: 16 }
});

export default VerificationInfoScreen;