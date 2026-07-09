import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Platform,
  Modal,
  Animated,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { resetPassword } from '../library/authUserStore';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  
  // Form states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Custom Modal configuration states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  
  const closeCallbackRef = useRef(null);
  const [fadeAnim] = useState(() => new Animated.Value(0));

  const triggerModal = useCallback((title, message, onCloseCallback = null) => {
    setModalTitle(title);
    setModalMessage(message);
    closeCallbackRef.current = onCloseCallback;
    setModalVisible(true);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // FIXED: Added full cleanup listener to drop async timers during unmounts
  useEffect(() => {
    if (!token) {
      const timeoutId = setTimeout(() => {
        triggerModal(
          'Missing Token',
          'This reset link is invalid or has expired.',
          () => router.replace('/(auth)')
        );
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [token, triggerModal, router]);

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      if (closeCallbackRef.current) {
        closeCallbackRef.current();
        closeCallbackRef.current = null;
      }
    });
  };

  const handleReset = async () => {
    if (!token) return;

    if (!password || password.length < 8) {
      triggerModal('Invalid Password', 'Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      triggerModal('Password Mismatch', 'Your passwords do not match. Please verify and try again.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(token, password);
      setIsLoading(false);

      if (result.success) {
        triggerModal(
          'Success',
          result.message || 'Password reset successfully! Please log in with your new credentials.',
          () => router.replace('/(auth)')
        );
      } else {
        triggerModal('Reset Failed', result.error || 'Could not reset password. The link may be expired.');
      }
    } catch (_e) {
      setIsLoading(false);
      triggerModal('Error', 'Could not contact server. Please try again.');
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer} 
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.description}>Please create and confirm your secure new password below.</Text>
        
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

        <TextInput
          placeholder="Confirm New Password"
          placeholderTextColor="#888"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, { marginBottom: 24 }]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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

        <TouchableOpacity
          style={styles.cancelLink}
          onPress={() => router.replace('/(auth)')}
          disabled={isLoading}
        >
          <Text style={styles.cancelText}>Cancel and return to Login</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      }
    })
  },
  innerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#007AFF',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 20,
    maxWidth: 400,
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
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      }
    })
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      }
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  // FIXED: Restored complete closing style object bindings
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default ResetPassword;