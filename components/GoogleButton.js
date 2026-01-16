import React, { useEffect, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Import Firebase Auth tools
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../library/firebaseConfig'; // Your Firebase auth instance

// Import your backend login function
import { googleLogin } from '../library/authUserStore'; 

WebBrowser.maybeCompleteAuthSession();

export const GoogleButton = ({ isLoading: parentLoading }) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Replace with your actual Client IDs
    iosClientId: '738262913454-cj4m25l3ovb029ti59sba4vj81jhhk6r.apps.googleusercontent.com',
    androidClientId: '738262913454-pk2phsmtbr2t0uo2gmhlgqbphhl735dk.apps.googleusercontent.com',
    webClientId: '738262913454-r362a5bl1c7f8aifu7u0lhkt0v7nfffo.apps.googleusercontent.com',
  });

  const [localLoading, setLocalLoading] = React.useState(false);

  const handleFirebaseLogin = useCallback(async (idToken) => {
    setLocalLoading(true);
    try {
      // Step 1: Create Firebase credential
      const credential = GoogleAuthProvider.credential(idToken);

      // Step 2: Sign in with Firebase
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;
      
      // Step 3: Fetch Firebase Auth Token
      const authToken = await firebaseUser.getIdToken();

      // Step 4: Send token to backend for handling
      await googleLogin(authToken);
    } catch (error) {
      // **Handle different types of errors**
      if (error.code === 'auth/network-request-failed') {
        Alert.alert(
          'Network Error',
          'Unable to connect to the server. Please check your internet and try again.'
        );
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert(
          'Invalid Credentials',
          'The credential used during this sign-in attempt is invalid. Please try again.'
        );
      } else {
        Alert.alert('Authentication Failed', 'Something went wrong while logging in. Please try again.');
      }
      console.error("Firebase Auth Error:", error);
    } finally {
      setLocalLoading(false);
    }
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        handleFirebaseLogin(id_token);
      } else {
        Alert.alert(
          'Authentication Error',
          'Failed to retrieve authentication token. Please try again.'
        );
        console.error('Google Auth Response Error: Missing id_token');
      }
    } else if (response?.type === 'error') {
      Alert.alert(
        'Authentication Error',
        'An error occurred during authentication. Please try again.'
      );
      console.error('Google Auth Response Error:', response.error);
    }
  }, [response, handleFirebaseLogin]);

  const showLoading = parentLoading || localLoading;

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={() => promptAsync()}
      disabled={!request || showLoading}
    >
      {showLoading ? (
        <ActivityIndicator color="#333" />
      ) : (
        <View style={styles.content}>
          <Ionicons name="logo-google" size={20} color="#333" style={styles.icon} />
          <Text style={styles.text}>Continue with Google</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});