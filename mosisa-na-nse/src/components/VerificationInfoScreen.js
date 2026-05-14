import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Import the centralized action to handle networking safely
import { checkUserWithRetry, resendVerification } from '../library/authUserStore';

export const VerificationInfoScreen = ({ email }) => {
  const router = useRouter();
  const normalizedEmail = email ? email.trim().toLowerCase() : '';

  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);

  // Throttling timer sequence execution
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  // Action: Trigger status poll using your store action validation function
  const handleCheckStatus = async () => {
    if (isChecking) return;
    setIsChecking(true);

    try {
      const result = await checkUserWithRetry(2);
      if (result.success) {
        Alert.alert('Success', 'Your email has been verified! Welcome to Nzete.', [
          { text: 'Continue', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        Alert.alert('Pending Verification', 'We cannot verify your status yet. Please check your inbox and click the link.');
      }
    } catch (_err) {
      Alert.alert('Network Error', 'Could not sync status with the server. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  // Action: Securely request a new link through your core state action store wrapper
  const handleResendLink = async () => {
    if (countdown > 0 || isResending || !normalizedEmail) return;
    setIsResending(true);

    try {
      // Clean, robust connection utilizing your auth store's fetch configurations
      const result = await resendVerification(normalizedEmail);
      
      if (result.success) {
        Alert.alert('Email Sent', result.message || 'A new validation link has been sent.');
        setCountdown(60); // Impose a 60-second anti-spam execution guard
      } else {
        Alert.alert('Error', result.error || 'Failed to send new email. Please try again.');
      }
    } catch (_error) {
      Alert.alert('Network Error', 'An unexpected transport connection exception occurred. Please verify your internet connection.');
    } finally {
      setIsResending(false);
    }
  };

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

      {/* Action button to pull latest user status from server */}
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: '#007AFF', marginBottom: 12 }]}
        onPress={handleCheckStatus}
        disabled={isChecking || isResending}
      >
        {isChecking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.actionText, { color: '#fff' }]}>I have verified my email</Text>
        )}
      </TouchableOpacity>

      {/* Anti-Spam Resend Action button */}
      <TouchableOpacity
        style={[
          styles.actionBtn, 
          { 
            backgroundColor: 'transparent', 
            borderWidth: 1, 
            borderColor: countdown > 0 || isResending || isChecking ? '#ccc' : '#007AFF', 
            marginBottom: 24 
          }
        ]}
        onPress={handleResendLink}
        disabled={countdown > 0 || isResending || isChecking || !normalizedEmail}
      >
        {isResending ? (
          <ActivityIndicator color="#007AFF" />
        ) : (
          <Text style={[styles.actionText, { color: countdown > 0 || isResending || isChecking ? '#aaa' : '#007AFF' }]}>
            {countdown > 0 ? `Resend Link in (${countdown}s)` : 'Resend verification email'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Return back to the login interface block anchor */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace('/(auth)/login')}
        disabled={isChecking || isResending}
        accessibilityLabel="Go to login"
      >
        <Ionicons name="log-in-outline" size={18} color="#007AFF" />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#007AFF', marginBottom: 10, textAlign: 'center' },
  desc: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  email: { fontWeight: 'bold', color: '#007AFF' },
  helpText: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 32 },
  actionBtn: { 
    width: '100%', 
    maxWidth: 300, 
    height: 48, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  actionText: { fontSize: 16, fontWeight: '600' },
  backBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F6FF', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 24 },
  backText: { color: '#007AFF', fontWeight: '600', marginLeft: 8, fontSize: 16 }
});

export default VerificationInfoScreen;
