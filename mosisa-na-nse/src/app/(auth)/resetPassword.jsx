import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { resetPassword } from '../../library/authUserStore';

const ResetPassword = () => {
  const router = useRouter();
  // If you use expo-router (web or mobile deep link), you'll get ?token=... from params:
  const { token } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!password || password.length < 8) {
      Alert.alert('Invalid password', 'Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    const result = await resetPassword(token, password);
    setIsLoading(false);
    if (result.success) {
      Alert.alert('Success', result.message || 'Password reset! Please log in.');
      router.replace('/login');
    } else {
      Alert.alert('Error', result.error || 'Could not reset password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleReset}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Text>
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
    marginBottom: 14,
    color: '#007AFF',
  },
  description: {
    textAlign: 'center',
    color: '#000000',
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
    color: '#2f2f2f',
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

export default ResetPassword;