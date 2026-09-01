// src/library/authUserStore.js

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { getAuth } from 'firebase/auth';

const zustandStorage = {
  getItem: async (key) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null; // Return null during server-side builds
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

// =============
// Helpers
// =============
const TOKEN_EXPIRY_BUFFER = 60 * 1000;
const REQUEST_TIMEOUT = 30000;
const MAX_RETRIES = 3;

const fetchWithTimeout = async (url, options = {}, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
const fetchWithRetries = async (url, options = {}, retries = MAX_RETRIES) => {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) console.log(`[Retry Attempt ${attempt + 1}] ${url}`);
      const response = await fetchWithTimeout(url, options);
      if (!response.ok && response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt === retries - 1) break;
      const delay = 1000 * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
};
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;
    return Date.now() >= expiryTime - TOKEN_EXPIRY_BUFFER;
  } catch {
    return true;
  }
};
const getTokenExpiry = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000;
  } catch {
    return 0;
  }
};

const sanitizeInput = (input) => (typeof input === 'string' ? input.trim().slice(0, 500) : '');
const sanitizeEmail = (email) => sanitizeInput(email).toLowerCase();
const getGenericError = (error) => {
  const message = error?.message?.toLowerCase() || '';
  if (message.includes('network') || message.includes('fetch'))
    return 'Network error. Please check your connection.';
  if (message.includes('timeout') || message.includes('aborted'))
    return 'Request timed out. The server took too long to respond.';
  if (message.includes('401') || message.includes('unauthorized'))
    return 'Session expired. Please log in again.';
  return error?.message || 'An error occurred. Please try again.';
};
// =============
// Zustand Store
// =============
export const useAuthUserStore = create(
  persist(
    (set, get) => ({
      token: null,
      tokenExpiry: null,
      user: null,
      isLoading: false,
      loadingType: null,
      error: null,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),
      isAuthenticated: () => {
        const { token, user } = get();
        return !!token && !!user && !isTokenExpired(token);
      },

      clearAuth: () => set({ token: null, tokenExpiry: null, user: null, error: null, loadingType: null }),
      setAuth: (token, user) =>
        set({ token, tokenExpiry: getTokenExpiry(token), user, error: null, loadingType: null }),
      isTokenValid: () => !isTokenExpired(get().token),
    }),
        {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        token: state.token,
        tokenExpiry: state.tokenExpiry,
        user: state.user,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) {
          useAuthUserStore.setState({ _hasHydrated: true });
        } else {
          // Safe to mutate via state parameter
          if (state.token && isTokenExpired(state.token)) {
            state.clearAuth();
          }
          state.setHasHydrated(true);
        }
      },
    }
  )
);

// =============
// Auth Actions
// =============
let isProcessingAuth = false;

export const register = async (username, email, password) => {
  if (isProcessingAuth) return;
  isProcessingAuth = true;
  useAuthUserStore.setState({ isLoading: true, loadingType: 'register', error: null });
  try {
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedUsername || !sanitizedEmail || !password) throw new Error('All fields are required');
    if (password.length < 8) throw new Error('Password must be at least 8 characters');
    const response = await fetchWithRetries(`https://nzete.onrender.com/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: sanitizedUsername, email: sanitizedEmail, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');

    // DO NOT write auth details to the store here because the account is unverified!
    useAuthUserStore.setState({ isLoading: false, loadingType: null });
    return { 
      success: true, 
      message: data.message || "Verification email sent. Please check your inbox.",
      email: sanitizedEmail 
    };
  } catch (error) {
    const errorMessage = getGenericError(error);
    useAuthUserStore.setState({ error: errorMessage, isLoading: false, loadingType: null });
    return { success: false, error: errorMessage };
  } finally {
    isProcessingAuth = false;
  }
};
export const login = async (email, password) => {
  if (isProcessingAuth) return;
  isProcessingAuth = true;
  useAuthUserStore.setState({ isLoading: true, loadingType: 'email', error: null });

  try {
    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedEmail || !password) {
      throw new Error('Email and password are required');
    }

    const response = await fetchWithRetries(`https://nzete.onrender.com/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: sanitizedEmail, password }),
    });

    const rawText = await response.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (_error) {
      console.error('[login] Server returned non-JSON response:', rawText);
      throw new Error(`Server Error: ${rawText.substring(0, 20)}...`);
    }

    if (!data.token || !data.user) throw new Error('Invalid server response');

    useAuthUserStore.getState().setAuth(data.token, data.user);
    useAuthUserStore.setState({ isLoading: false, loadingType: null });

    // ⭐ Return token so Login screen can save it
    return { success: true, token: data.token, user: data.user };

  } catch (error) {
    const errorMessage = getGenericError(error);
    useAuthUserStore.setState({ error: errorMessage, isLoading: false, loadingType: null });
    return { success: false, error: errorMessage };
  } finally {
    isProcessingAuth = false;
  }
};
export const logout = async () => {
  try {
    const { token } = useAuthUserStore.getState();
    if (token) {
      fetchWithTimeout(`${process.env.BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || 'https://nzete.onrender.com'}/api/auth/logout}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }, 5000).catch(() => {});
    }
  } finally {
    await zustandStorage.removeItem('auth-storage');
    useAuthUserStore.getState().clearAuth();
  }
};
export const updateUser = async (updatedData) => {
  const { token, user } = useAuthUserStore.getState();
  if (!token || !user) return { success: false, error: 'User not authenticated' };

  if (isTokenExpired(token)) {
    await logout();
    return { success: false, error: 'Session expired. Please log in again.' };
  }
  useAuthUserStore.setState({ isLoading: true, loadingType: 'update', error: null });
  try {
    const sanitizedData = {};
    if (updatedData.username) sanitizedData.username = sanitizeInput(updatedData.username);
    if (updatedData.profilePicture) sanitizedData.profilePicture = updatedData.profilePicture;
    
    if (Object.keys(sanitizedData).length === 0) throw new Error('No valid update data provided');

    const response = await fetchWithRetries(`https://nzete.onrender.com/api/auth/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sanitizedData),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        await logout();
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(data.message || 'Failed to update profile');
    }
    useAuthUserStore.setState({
      user: data.user,
      isLoading: false,
      loadingType: null,
    });
    return { success: true, user: data.user };
  } catch (error) {
    const errorMessage = getGenericError(error);
    useAuthUserStore.setState({ error: errorMessage, isLoading: false, loadingType: null });
    return { success: false, error: errorMessage };
  }
};
export const fetchProtected = async (path, options = {}, retries = MAX_RETRIES) => {
  const { token } = useAuthUserStore.getState();
  if (!token) throw new Error('No token available');

  if (isTokenExpired(token)) {
    await logout();
    throw new Error('Session expired. Please log in again.');
  }
  const base = "https://nzete.onrender.com";

  // FIX: Prevent double-domain bug
  const url = path.startsWith("http")
    ? path
    : `${base}${path}`;

  try {
    const response = await fetchWithRetries(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    }, retries);

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        await logout();
        throw new Error(data.message || 'Session invalidated. Please log in again.');
      }
      throw new Error(data.message || 'Request failed');
    }
    return data;
  } catch (error) {
    if (
      error.message.includes('expired') ||
      error.message.includes('401') ||
      error.message.includes('verified')
    ) {
      await logout();
    }
    throw error;
  }
};
export const refreshUser = async () => {
  const { token } = useAuthUserStore.getState();
  if (!token || isTokenExpired(token)) return { success: false, error: 'Not authenticated' };
  
  try {
    const data = await fetchProtected('https://nzete.onrender.com/api/auth/me');
    useAuthUserStore.setState({ user: data.user });
    return { success: true, user: data.user };
  } catch (error) {
    // If background sync reveals an unverified state, drop session and notify navigation guards
    return { success: false, error: error.message, isUnverified: error.message.includes('verified') };
  }
};
export const checkUser = async () => {
  useAuthUserStore.setState({ isLoading: true, error: null });
  try {
    const { token } = useAuthUserStore.getState();
    
    if (!token) {
      useAuthUserStore.setState({ isLoading: false });
      return { success: false, error: 'No token found in store state' };
    }

    // ⚠️ Point to your actual API route, not just the root domain
    const response = await fetchWithTimeout(`https://nzete.onrender.com/api/auth/check-status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const rawText = await response.text();
    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("❌ [SERVER ERROR INFRASTRUCTURE]: Expected JSON, got:", rawText);
      useAuthUserStore.setState({ isLoading: false });
      return { success: false, error: 'Server returned non-JSON data' };
    }

    if (!response.ok) {
      // ✅ Matches the 403 response from both /login and /check-status
      if (response.status === 403 && data.isUnverified) {
        useAuthUserStore.setState({ isLoading: false });
        return { success: false, error: 'Email not verified', isUnverified: true };
      }
      useAuthUserStore.setState({ isLoading: false });
      return { success: false, error: data.message || 'Verification endpoint rejected request' };
    }

    if (!data.user) {
      useAuthUserStore.setState({ isLoading: false });
      return { success: false, error: 'Invalid user session schema structure' };
    }

    if (!data.user.verified) {
      useAuthUserStore.setState({ isLoading: false });
      return { success: false, error: 'Email not verified', isUnverified: true };
    }
 
    useAuthUserStore.setState({ user: data.user, isLoading: false });
    return { success: true, user: data.user };

  } catch (error) {
    console.error("🚨 [CHECKUSER CATCH CRASH ERROR]:", error.message);
    useAuthUserStore.setState({ isLoading: false });
    return { success: false, error: error.message };
  }
};
export const checkUserWithRetry = async (retries = 2) => {
  try {
    let token = useAuthUserStore.getState().token;
    
    // 1. Refresh Firebase Token if Firebase Auth is active
    let firebaseUser = null;
    try {
      const auth = getAuth();
      firebaseUser = auth.currentUser;
      if (firebaseUser) {
        await firebaseUser.reload();
        token = await firebaseUser.getIdToken(true);
      }
    } catch (_firebaseErr) {
      // Ignore if Firebase isn't initialized or used
    }
    for (let i = 0; i < retries; i++) {
      const res = await fetch(`https://nzete.onrender.com/api/auth/me?t=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      if (res.ok) {
        const data = await res.json();
        
        // Extract user object safely (handles { user: {...} } or direct user object)
        const userObj = data?.user || data;
        
        // Check all common naming variations for email verification
        const isBackendVerified = Boolean(
          userObj?.isVerified ?? 
          userObj?.is_verified ?? 
          userObj?.emailVerified ?? 
          userObj?.isEmailVerified
        );

        const isFirebaseVerified = Boolean(firebaseUser?.emailVerified);

        if (isBackendVerified || isFirebaseVerified) {
          // Construct fresh user object ensuring isVerified is explicitly true
          const updatedUser = {
            ...userObj,
            isVerified: true,
          };

          // Save fresh state to Zustand
          useAuthUserStore.setState({ user: updatedUser, token });
          return { success: true, user: updatedUser };
        }
      }

      // Delay between retries
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  } catch (e) {
    console.error('Verification check error:', e);
  }

  return { success: false };
};
export const requestPasswordReset = async (email) => {
  useAuthUserStore.setState({ isLoading: true, loadingType: 'reset', error: null });
  try {
    const sanitizedEmail = email.trim().toLowerCase();
    if (!sanitizedEmail) throw new Error("Email is required");

    const response = await fetchWithRetries(`https://nzete.onrender.com/api/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: sanitizedEmail }),
    });

    // Always get the text first, so we can debug non-JSON responses
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Debug: log raw text to the console so you can see what you got
      console.log("Forgot password API raw response:", text);
      throw new Error("Server sent invalid response. Check API URL and backend logs.");
    }

    useAuthUserStore.setState({ isLoading: false, loadingType: null });

    if (!response.ok) throw new Error(data.message || 'Failed to send password reset email');
    return { success: true, message: data.message };
  } catch (error) {
    const errorMessage = getGenericError(error);
    useAuthUserStore.setState({ error: errorMessage, isLoading: false, loadingType: null });
    return { success: false, error: errorMessage };
  }
};
export const resetPassword = async (token, password) => {
  try {
    if (!token || !password) throw new Error('Missing reset token or password.');
    const response = await fetch("https://nzete.onrender.com/api/auth/reset-password", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.log("Reset password API raw response:", text);
      throw new Error("Server sent invalid response. Check API URL and backend logs.");
    }
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password.');
    }
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: error.message || "Unknown error" };
  }
};
export const resendVerification = async (email) => {
  if (!email) return { success: false, error: 'Email address parameter is required' };
  
  useAuthUserStore.setState({ isLoading: true, loadingType: 'resend', error: null });

  try {
    const sanitizedEmail = email.trim().toLowerCase();

    // Use fetchWithRetries or standard fetch to align with your store configuration utilities
    const response = await fetchWithRetries("https://nzete.onrender.com/api/auth/resend-verification", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: sanitizedEmail }),
    });

    // Insulate mobile runtime engine from non-JSON backend container crash scripts
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('[resendVerification] Server returned non-JSON response:', text);
      throw new Error("Server sent an invalid response context layout. Check backend configurations.");
    }

    useAuthUserStore.setState({ isLoading: false, loadingType: null });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to dispatch new verification link');
    }

    return { success: true, message: data.message };

  } catch (error) {
    const errorMessage = getGenericError ? getGenericError(error) : error.message;
    useAuthUserStore.setState({ error: errorMessage, isLoading: false, loadingType: null });
    return { success: false, error: errorMessage };
  }
};
