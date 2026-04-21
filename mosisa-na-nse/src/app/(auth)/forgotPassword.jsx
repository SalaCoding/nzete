import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { requestPasswordReset } from '../../library/authUserStore';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgot = async () => {
    if (isLoading) return;
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await requestPasswordReset(email);
      setIsLoading(false);
      if (result.success) {
        setSent(true);
        Alert.alert('Email Sent', result.message || 'Check your inbox for reset instructions.');
      } else {
        Alert.alert('Error', result.error || 'Could not send reset email.');
      }
    } catch (_e) {
      setIsLoading(false);
      Alert.alert('Error', 'Could not contact server. Try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.description}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={!isLoading && !sent}
        />
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isLoading || sent ? '#ccc' : '#007AFF' },
          ]}
          onPress={handleForgot}
          disabled={isLoading || sent}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {sent ? 'Email Sent!' : 'Send Reset Email'}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => router.back()}
          disabled={isLoading}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={20} color="#007AFF" />
          <Text style={styles.backText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 14,
    color: '#007AFF',
  },
  description: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 22,
    fontSize: 16,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#000',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default ForgotPassword;