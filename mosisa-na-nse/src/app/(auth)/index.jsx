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
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthUserStore, login } from '../../library/authUserStore';

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const { user, error, _hasHydrated } = useAuthUserStore();

  // Redirect on successful login verification
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user, router]);

  // Show generic error alerts safely
  useEffect(() => {
    if (error) {
      setIsEmailLoading(false);
      Alert.alert('Login Failed', error)
    }
  }, [error])

  // Wait for auth state to hydration check
  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  const handleLogin = async () => {
    if (isEmailLoading) return;

    if (!email.trim() || !password) {
      Alert.alert('Missing Input', 'Please enter both email and password.');
      return;
    }

    setIsEmailLoading(true);

    try {
      const result = await login(email.trim().toLowerCase(), password);
      
      // 1. Safe Intercept: Sync route structure targets cleanly with SignUp file outputs
      if (result?.isUnverified) {
        setIsEmailLoading(false); // Clean up layout locks prior to route shifts
        router.push({
          pathname: '/verify-info', 
          params: { email: email.trim().toLowerCase() }
        });
        return;
      }

      // 2. Clear state if validation failed for alternate reasons
      if (!result?.success) {
        setIsEmailLoading(false);
      }

    } catch (_err) {
      setIsEmailLoading(false);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            
            {/* Header Logo Visual Anchor */}
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/images/icon_nzete.png')}
                style={styles.image}
                contentFit="contain"
              />
            </View>

            {/* Login Form Box Card */}
            <View style={styles.caseBox}>
              
              {/* Email Input Field */}
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
                  editable={!isEmailLoading}
                />
              </View>

              {/* Password Input Field */}
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
                    autoCorrect={false}
                    style={[styles.input, { flex: 1, marginVertical: 0, borderWidth: 0 }]}
                    editable={!isEmailLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                    disabled={isEmailLoading}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Button Submission Element */}
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

              {/* Recovery Options Link Wrapper */}
              <Link href="/forgotPassword" asChild>
                <TouchableOpacity
                  style={styles.passForgotContainer}
                  disabled={isEmailLoading}
                >
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </Link>

              {/* Screen Split Navigation Footer Element */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don’t have an account?</Text>
                <Link href="/signup" asChild disabled={isEmailLoading}>
                  <TouchableOpacity>
                    <Text style={styles.linkText}>Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>

            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: '100%', alignItems: 'center', marginBottom: 30 },
  image: { width: 250, height: 200 },
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
  inputGroup: { marginBottom: 16 },
  text__head: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
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
  passwordToggle: { padding: 12 },
  loginButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  passForgotContainer: { marginTop: 12, justifyContent: 'center', alignItems: 'center' },
  forgotText: { color: '#007AFF', fontSize: 15, fontWeight: '600', textAlign: 'center' },
  footer: { marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 15, color: '#666' },
  linkText: { fontSize: 15, color: '#007AFF', fontWeight: '600', marginLeft: 6 },
})

export default Login;
