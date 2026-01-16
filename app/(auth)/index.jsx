import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthUserStore, login } from '../../library/authUserStore';
import { GoogleButton } from '../../components/GoogleButton';

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // ✅ Create a local loading state specifically for Email Login
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const { user, error, _hasHydrated } = useAuthUserStore();

  // 1. Handle Successful Login Navigation
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user, router]);

  // 2. Handle Errors
  useEffect(() => {
    if (error) {
      // Reset local loading if there's a global error
      setIsEmailLoading(false);
      Alert.alert('Login Failed', error)
    }
  }, [error])

  // 3. Loading State for Hydration
  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  // 4. Handle Login Button Press
  const handleLogin = async () => {
    if (isEmailLoading) return; // Prevent double taps

    // Basic Client-side validation
    if (!email.trim() || !password) {
      Alert.alert('Missing Input', 'Please enter both email and password.');
      return;
    }

    setIsEmailLoading(true); // Start local loading
    
    // Pass isEmailLoading to the login function logic or handle cleanup
    const result = await login(email, password);
    
    // If login fails, stop loading (if success, the useEffect navigates away)
    if (!result.success) {
      setIsEmailLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            
            {/* Header / Image */}
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/images/icon_nzete1.png')}
                style={styles.image}
                contentFit="contain"
              />
            </View>

            {/* Login Form Box */}
            <View style={styles.caseBox}>
              
              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.text__head}>Email</Text>
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  // Disable input while any loading happens
                  editable={!isEmailLoading} 
                />
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.text__head}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize='none'
                    style={[styles.input, { flex: 1, marginVertical: 0 }]}
                    editable={!isEmailLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button (Uses local isEmailLoading) */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isEmailLoading}
                style={[
                  styles.loginButton,
                  { backgroundColor: isEmailLoading ? '#ccc' : '#007AFF' }
                ]}
              >
                {isEmailLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              {/* Google Login Button (Passes false so it doesn't spin when email is loading) */}
              <GoogleButton isLoading={false} />

              {/* Footer Links */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don’t have an account?</Text>
                <Link href="/signup" asChild>
                  <TouchableOpacity>
                    <Text style={styles.linkText}>Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>

            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 250,
    height: 200,
  },
  caseBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  text__head: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    height: 50,
    overflow: 'hidden',
  },
  passwordToggle: {
    padding: 12,
  },
  loginButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#666',
  },
  linkText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 6,
  },
})

export default Login