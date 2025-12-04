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
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuthUserStore, register } from '../../library/authUserStore'
import { Ionicons } from '@expo/vector-icons';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { user, isLoading, token} = useAuthUserStore();
    
    const router = useRouter();

    const handleSignUp = async () => {
        if (!username || !email || !password) {
        Alert.alert("Missing Info", "Please fill in all fields.");
        return;
        }

        const result = await register(username, email, password);
        if (result.success) {
            router.replace("/(tabs)");
        } else {
            Alert.alert("Error", result.error || "Signup failed. Please try again.");
        }

        console.log("Signup result:", result);
        console.log(user)
        console.log(token)
    };
  return (
    <KeyboardAvoidingView
        style={{ flex:1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <ScrollView contentContainerStyle={{ flex: 1, paddingBottom: 60 }}>
            <SafeAreaView style={{ flexGrow: 1 }}>
        <View style={[styles.container, { minHeight: '100%', paddingVertical: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <View style={{width: '100%', alignItems: 'center', marginBottom: 20}}>
                <Image 
                    source={require("../../assets/images/learning-cuate.png")}
                    style={{width: '100%', height: 200, justifyContent: 'center'}}
                    contentFit='contain'
                />
            </View>
            <View style={styles.caseBox}>
              <View>
                    <Text style={styles.text__head}>Username</Text>
                    <View>
                        <TextInput
                        placeholder='Username'
                        placeholderTextColor="#888"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize='none'  
                        autoComplete='none'
                        autoCorrect={false}                  
                        style={styles.emailInput}
                    />
                    </View>
                </View>
                <View>
                    <Text style={styles.text__head}>Email</Text>
                    <View>
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
                    />
                    </View>
                </View>
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
                        style={styles.emailInput}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                          accessibilityLabel={showPassword ? "Hide password" : "Show password"} // Accessibility
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
                <View style={styles.footer}>
                    <Text style={{ marginRight: 5, fontSize: 16 }}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={{ marginLeft: 5, color: 'blue', fontSize: 16 }}>Login</Text>
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
    justifyContent: 'center', // centers vertically
    alignItems: 'center',     // centers horizontally
    paddingVertical: 30       // prevents hugging edges
    },
    caseBox: {
    alignSelf: 'center',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,

    // Android shadow
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
  passwordToggle:{
    padding: 8,
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center'
  },
    loginButton: {
    borderRadius: 16,
    marginTop: 12,
  },
    button__text: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: "bold"
  },
    footer: {
        marginTop: 22,
        flexDirection: 'row', 
        alignItems: 'center'
    }
})

export default SignUp