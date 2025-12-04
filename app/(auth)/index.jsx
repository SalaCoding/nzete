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
import { useAuthUserStore, login } from '../../library/authUserStore'
import { Ionicons } from '@expo/vector-icons'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // ✅ Destructure what you need from the store.
  // The `user` variable will automatically update on login.
  const { user, isLoading, error, _hasHydrated } = useAuthUserStore();

  useEffect(() => {
    // Redirect if the user logs in successfully
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user, router]); // This effect runs when the user state changes

   useEffect(() => {
    // ✅ Centralized error handling. This is the single source of truth for login errors.
    if (error) {
      Alert.alert('Login Error', error)
    }
  }, [error])

  // 🚦**DO NOT RENDER UI UNTIL HYDRATION READY**
  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    )
  }

  const handleLogin = async () => {
    // ✅ Simplified: just call login. The effects will handle the rest.
    await login(email, password);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flex: 1, paddingBottom: 60 }}>
        <SafeAreaView style={{ flexGrow: 1 }}>
          <View style={[
            styles.container,
            {
              minHeight: '100%',
              paddingVertical: 20,
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
            }
          ]}>
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
              <Image
                source={require('../../assets/images/learning-cuate.png')}
                style={{ width: '100%', height: 200 }}
                contentFit="contain"
              />
            </View>
            <View style={styles.caseBox}>
              {/* Email Field */}
              <View>
                <Text style={styles.text__head}>Email</Text>
                <TextInput
                  placeholder="koma email na yo"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.emailInput}
                />
              </View>
              {/* Password Field */}
              <View style={{ marginTop: 12, marginBottom: 12 }}>
                <Text style={styles.text__head}>Password</Text>
                <View>
                  <TextInput
                    placeholder="koma Password na yo awa"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={[styles.emailInput, { paddingRight: 40 }]} // ensure space for eye icon
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                    style={styles.passwordToggle}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Login Button (Custom for loading state) */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={[
                  styles.loginButton,
                  { backgroundColor: isLoading ? '#A0A0A0' : '#007AFF', alignItems: 'center', padding: 12 }
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.button__text}>Login</Text>
                )}
              </TouchableOpacity>
              {/* Footer */}
              <View style={styles.footer}>
                <Text style={{ marginRight: 5, fontSize: 16 }}>Don’t have an account?</Text>
                <Link href="/signup" asChild>
                  <TouchableOpacity>
                    <Text style={{ marginLeft: 5, color: 'blue', fontSize: 16 }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </SafeAreaView>
        <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  caseBox: {
    alignSelf: 'center',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  emailInput: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    padding: 12,
    marginVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  text__head: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  loginButton: {
    borderRadius: 16,
    marginTop: 12,
  },
  passwordToggle: {
    padding: 8,
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center'
  },
  button__text: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: "bold"
  },
  footer: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default Login