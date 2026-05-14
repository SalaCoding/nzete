import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { resetPassword } from '../../library/authUserStore';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Safety Trap: Intercept missing incoming request tokens early to block illegal execution loops
  useEffect(() => {
    if (!token) {
      Alert.alert(
        'Missing Token',
        'This reset link is invalid or has expired. Please request a new recovery email.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  }, [token, router]);

  const handleReset = async () => {
    if (!token) return;

    if (!password || password.length < 8) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      // Execute the SHA-256 secure database token validation path check 
      const result = await resetPassword(token, password);
      setIsLoading(false);

      if (result.success) {
        // Callback encapsulation guarantees text parsing clarity before system routing changes occur
        Alert.alert(
          'Success', 
          result.message || 'Password reset successfully! Please log in with your new credentials.',
          [
            {
              text: 'Login',
              onPress: () => router.replace('/(auth)/login')
            }
          ]
        );
      } else {
        Alert.alert('Reset Failed', result.error || 'Could not reset password. The link may be expired.');
      }
    } catch (_e) {
      setIsLoading(false);
      Alert.alert('Error', 'Could not contact server. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.description}>Please create a secure new password for your Nzete account below.</Text>
      
      <TextInput
        placeholder="New Password"
        placeholderTextColor="#888"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        editable={!isLoading && !!token}
      />
      
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isLoading || !token ? '#ccc' : '#007AFF' }
        ]}
        onPress={handleReset}
        disabled={isLoading || !token}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      {/* FIXED: Clean escape route to guarantee users are never trapped on this view */}
      <TouchableOpacity
        style={styles.cancelLink}
        onPress={() => router.replace('/(auth)/login')}
        disabled={isLoading}
      >
        <Text style={styles.cancelText}>Cancel and return to Login</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 8,
    color: '#007AFF',
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 20
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
    marginBottom: 20,
  },
  button: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelLink: {
    marginTop: 24,
    padding: 8,
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ResetPassword;
