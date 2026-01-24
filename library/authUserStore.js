import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/api';
import { jwtDecode } from 'jwt-decode';
import { Platform } from 'react-native';

// ============================================================
// SECURE STORAGE ADAPTER (expo-secure-store)
// ============================================================

const secureStorage = {
  getItem: async (name) => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(name);
        }
      } catch (error) {
        console.error('[localStorage] getItem error:', error);
      }
      return null;
    }

    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error('[SecureStore] getItem error:', error);
      return null;
    }
  },

  setItem: async (name, value) => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(name, value);
        }
      } catch (error) {
        console.error('[localStorage] setItem error:', error);
      }
      return;
    }

    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('[SecureStore] setItem error:', error);
    }
  },

  removeItem: async (name) => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(name);
        }
      } catch (error) {
        console.error('[localStorage] removeItem error:', error);
      }
      return;
    }

    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('[SecureStore] removeItem error:', error);
    }
  },
};

// ============================================================
// CONSTANTS
// ============================================================

const TOKEN_EXPIRY_BUFFER = 60 * 1000; // Refresh 1 minute before expiry
const REQUEST_TIMEOUT = 30000; // Increased to 30s
const MAX_RETRIES = 3;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`[FETCH TIMEOUT] Request aborted (Timeout: ${timeout}ms) for URL: ${url}`);
      throw new Error('Request timed out. Please check your connection and try again.');
    } else {
      throw error;
    }
  } finally {
    clearTimeout(timeoutId);
  }
};

// Helper to handle retries automatically
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

// Check if token is expired (with buffer)
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;
    return Date.now() >= expiryTime - TOKEN_EXPIRY_BUFFER;
  } catch (error) {
    console.error('Token decode error:', error);
    return true;
  }
};

// Get token expiry time
const getTokenExpiry = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000;
  } catch {
    return 0;
  }
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 500);
};

// Sanitize email
const sanitizeEmail = (email) => {
  return sanitizeInput(email).toLowerCase();
};

// Generic error messages
const getGenericError = (error) => {
  const message = error?.message?.toLowerCase() || '';

  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Please check your connection.';
  }
  if (message.includes('timeout') || message.includes('aborted')) {
    return 'Request timed out. The server took too long to respond.';
  }
  if (message.includes('401') || message.includes('unauthorized')) {
    return 'Session expired. Please log in again.';
  }

  return error?.message || 'An error occurred. Please try again.';
};

// ============================================================
// ZUSTAND STORE
// ============================================================

export const useAuthUserStore = create(
  persist(
    (set, get) => ({
      token: null,
      tokenExpiry: null,
      user: null,
      isLoading: false,
      loadingType: null, // ✅ ADDED: Tracks which specific action is loading ('email', 'google', 'register')
      error: null,
      _hasHydrated: false,

      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated });
      },

      isAuthenticated: () => {
        const { token, user } = get();
        return !!token && !!user && !isTokenExpired(token);
      },

      clearAuth: () => {
        set({ token: null, tokenExpiry: null, user: null, error: null, loadingType: null });
      },

      setAuth: (token, user) => {
        set({
          token,
          tokenExpiry: getTokenExpiry(token),
          user,
          error: null,
          loadingType: null, // Clear loading on success
        });
      },

      isTokenValid: () => {
        const { token } = get();
        return !isTokenExpired(token);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage), 
      partialize: (state) => ({
        token: state.token,
        tokenExpiry: state.tokenExpiry,
        user: state.user,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[HYDRATION ERROR]:', error);
        } else {
          if (state?.token && isTokenExpired(state.token)) {
            console.warn('Token expired during hydration. Clearing auth...');
            state.clearAuth();
          }
          state.setHasHydrated(true);
        }
      },
    }
  )
);

// ============================================================
// AUTH ACTIONS
// ============================================================

let isProcessingAuth = false;

export const register = async (username, email, password) => {
  if (isProcessingAuth) return;
  isProcessingAuth = true;

  // ✅ Set loadingType to 'register'
  useAuthUserStore.setState({ isLoading: true, loadingType: 'register', error: null });

  try {
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeEmail(email);

    if (!sanitizedUsername || !sanitizedEmail || !password) {
      throw new Error('All fields are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const response = await fetchWithRetries(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: sanitizedUsername,
        email: sanitizedEmail,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    if (!data.token || !data.user) {
      throw new Error('Invalid server response');
    }

    useAuthUserStore.getState().setAuth(data.token, data.user);
    useAuthUserStore.setState({ isLoading: false, loadingType: null });

    return { success: true };

  } catch (error) {
    console.error('[register] error:', error.message);
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

  // ✅ Set loadingType to 'email'
  useAuthUserStore.setState({ isLoading: true, loadingType: 'email', error: null });

  try {
    const sanitizedEmail = sanitizeEmail(email);

    if (!sanitizedEmail || !password) {
      throw new Error('Email and password are required');
    }

    console.log(`[LOGIN START] Attempting login for: ${sanitizedEmail} to the Api`);

    const response = await fetchWithRetries(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: sanitizedEmail,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (!data.token || !data.user) {
      throw new Error('Invalid server response');
    }

    useAuthUserStore.getState().setAuth(data.token, data.user);
    useAuthUserStore.setState({ isLoading: false, loadingType: null });

    return { success: true };

  } catch (error) {
    console.error('[login] error:', error.message);
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
      fetchWithTimeout(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }, 5000).catch(() => {});
    }
  } finally {
    await secureStorage.removeItem('auth-storage');
    useAuthUserStore.getState().clearAuth();
  }
};

export const updateUser = async (updatedData) => {
  const { token, user } = useAuthUserStore.getState();

  if (!token || !user) {
    return { success: false, error: 'User not authenticated' };
  }

  if (isTokenExpired(token)) {
    await logout();
    return { success: false, error: 'Session expired. Please log in again.' };
  }

  useAuthUserStore.setState({ isLoading: true, loadingType: 'update', error: null });

  try {
    const sanitizedData = {};
    if (updatedData.username) {
      sanitizedData.username = sanitizeInput(updatedData.username);
    }
    if (updatedData.profilePicture) {
      sanitizedData.profilePicture = sanitizeInput(updatedData.profilePicture);
    }

    if (Object.keys(sanitizedData).length === 0) {
      throw new Error('No valid update data provided');
    }

    const response = await fetchWithRetries(`${API_URL}/api/auth/user/profile`, {
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
    console.error('[updateUser] error:', error.message);
    const errorMessage = getGenericError(error);
    useAuthUserStore.setState({ error: errorMessage, isLoading: false, loadingType: null });
    return { success: false, error: errorMessage };
  }
};

export const fetchProtected = async (path, options = {}, retries = MAX_RETRIES) => {
  const { token } = useAuthUserStore.getState();

  if (!token) {
    throw new Error('No token available');
  }

  if (isTokenExpired(token)) {
    await logout();
    throw new Error('Session expired. Please log in again.');
  }

  try {
    const response = await fetchWithRetries(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    }, retries);

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        await logout();
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(data.message || 'Request failed');
    }

    return data;

  } catch (error) {
    if (error.message.includes('expired') || error.message.includes('401')) {
      await logout();
    }
    throw error;
  }
};

export const refreshUser = async () => {
  const { token } = useAuthUserStore.getState();

  if (!token || isTokenExpired(token)) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const data = await fetchProtected('/api/auth/me');
    useAuthUserStore.setState({ user: data.user });
    return { success: true, user: data.user };
  } catch (error) {
    console.error('[refreshUser] error:', error.message);
    return { success: false, error: error.message };
  }
};

export const checkUser = async () => {
  useAuthUserStore.setState({ isLoading: true, error: null });

  try {
    const { token, user } = useAuthUserStore.getState();

    if (!token) {
      useAuthUserStore.setState({ isLoading: false });
      return { success: false, error: 'No token' };
    }

    if (isTokenExpired(token)) {
      console.log('[checkUser] Token expired, clearing auth');
      useAuthUserStore.getState().clearAuth();
      useAuthUserStore.setState({ isLoading: false });
      return { success: false, error: 'Token expired' };
    }

    if (user) {
      useAuthUserStore.setState({ isLoading: false });
      return { success: true, user };
    }

    const response = await fetchWithTimeout(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify user');
    }

    useAuthUserStore.setState({
      user: data.user,
      isLoading: false,
    });

    return { success: true, user: data.user };

  } catch (error) {
    console.error('[checkUser] error:', error.message);
    useAuthUserStore.getState().clearAuth();
    useAuthUserStore.setState({ isLoading: false });
    return { success: false, error: error.message };
  }
};

export const checkUserWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await checkUser();

      if (result.success) {
        return result;
      }

      if (result.error === 'No token' || result.error === 'Token expired') {
        return result;
      }

      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
      }

    } catch (err) {
      console.error(`[checkUserWithRetry] Attempt ${i + 1} failed:`, err.message);

      if (i === retries - 1) {
        return { success: false, error: err.message };
      }

      await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
    }
  }

  return { success: false, error: 'Max retries reached' };
};

// ============================================================
// CONFIGURE GOOGLE SIGN IN
// ============================================================
export const googleLogin = async (firebaseToken) => {
  if (isProcessingAuth) return;
  isProcessingAuth = true;

  // ✅ Set loadingType to 'google'
  useAuthUserStore.setState({ isLoading: true, loadingType: 'google', error: null });

  try {
    // Send Firebase Token to your backend
    const response = await fetchWithRetries(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: firebaseToken }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Google login failed');

    useAuthUserStore.getState().setAuth(data.token, data.user);
    useAuthUserStore.setState({ isLoading: false, loadingType: null });

    return { success: true };
  } catch (error) {
    console.error('[googleLogin] error:', error);
    useAuthUserStore.setState({ error: error.message, isLoading: false, loadingType: null });
    return { success: false, error: error.message };
  } finally {
    isProcessingAuth = false;
  }
};