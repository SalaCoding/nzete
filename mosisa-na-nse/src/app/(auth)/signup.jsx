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
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuthUserStore, register } from '../../library/authUserStore'
import { Ionicons } from '@expo/vector-icons';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading } = useAuthUserStore();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }

    const result = await register(username.trim(), email.trim().toLowerCase(), password);
    
    if (result.success) {
      // Safe dialog hook that triggers redirection only after user confirms via button press
      Alert.alert(
        "Verify your email",
        "Registration successful! Please check your inbox and click the verification link before logging in.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace({
                pathname: "/verify-info",
                params: { email: email.trim().toLowerCase() }, 
              });
            }
          }
        ]
      );
    } else {
      Alert.alert("Error", result.error || "Signup failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.container, { minHeight: '100%', paddingVertical: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#007AFF' }}>Create Account</Text>
            </View>

            <View style={styles.caseBox}>
              
              {/* Username Input Field */}
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.text__head}>Username</Text>
                <TextInput
                  placeholder='Username'
                  placeholderTextColor="#888"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize='none'  
                  autoComplete='none'
                  autoCorrect={false}                  
                  style={styles.emailInput}
                  editable={!isLoading}
                />
              </View>

              {/* Email Input Field */}
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.text__head}>Email</Text>
                <TextInput
                  placeholder='koma email na yo'
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none' 
                  autoComplete='none'
                  autoCorrect={false}                   
                  style={styles.emailInput}
                  editable={!isLoading}
                />
              </View>

              {/* Password Input Field */}
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.text__head}>Password</Text>
                {/* Wrapped in container to allow absolute toggle icon sizing without clipping input text padding */}
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    placeholder="koma Password na yo awa"
                    placeholderTextColor="#7d7d7d"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={[styles.emailInput, { color: '#000', marginVertical: 0, paddingRight: 45 }]}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    accessibilityLabel={showPassword ? "Hide password" : "Show password"} 
                    style={styles.passwordToggle}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Dynamic Submit Button */}
              <View>
                <TouchableOpacity
                  onPress={handleSignUp}
                  disabled={isLoading}
                  style={[
                    styles.loginButton,
                    {
                      backgroundColor: isLoading ? '#A0A0A0' : '#007AFF',
                      alignItems: 'center',
                      padding: 12,
                      opacity: isLoading ? 0.7 : 1
                    }
                  ]}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.button__text}>Sign up</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Quick Navigation Footer Link */}
              <View style={styles.footer}>
                <Text style={{ fontSize: 15, color: '#666' }}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
                  <Text style={{ fontSize: 15, color: '#007AFF', fontWeight: '600', marginLeft: 6 }}>Login</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </SafeAreaView>
        <StatusBar style="dark"/>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
    paddingVertical: 30       
  },
  caseBox: {
    alignSelf: 'center',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  passwordInputContainer: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    width: '100%',
    padding: 12,
    marginVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  text__head: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333'
  },
  passwordToggle: {
    padding: 8,
    position: 'absolute',
    right: 4,
    height: '100%',
    justifyContent: 'center',
    zIndex: 10
  },
  loginButton: {
    borderRadius: 16,
    marginTop: 12,
  },
  button__text: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: "bold",
    fontSize: 16
  },
  footer: {
    marginTop: 22,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default SignUp;
