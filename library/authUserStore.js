import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/api';
import { jwtDecode } from 'jwt-decode';

// ============================================================
// SECURE STORAGE ADAPTER (expo-secure-store)
// ============================================================

const secureStorage = {
  getItem: async (name) => {
    try {
      return await SecureStore. getItemAsync(name);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await SecureStore. setItemAsync(name, value);
    } catch (error) {
      console. error('SecureStore setItem error:', error);
    }
  },
  removeItem: async (name) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
    }
  },
};

// ============================================================
// CONSTANTS
// ============================================================

const TOKEN_EXPIRY_BUFFER = 60 * 1000; // Refresh 1 minute before expiry
const REQUEST_TIMEOUT = 15000; // 15 seconds
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
      ... options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Check if token is expired (with buffer)
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000; // Convert to milliseconds
    return Date. now() >= expiryTime - TOKEN_EXPIRY_BUFFER;
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
  return input. trim().slice(0, 500); // Limit length
};

// Sanitize email
const sanitizeEmail = (email) => {
  return sanitizeInput(email). toLowerCase();
};

// Generic error messages (don't expose internals)
const getGenericError = (error) => {
  const message = error?. message?. toLowerCase() || '';

  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Please check your connection. ';
  }
  if (message. includes('timeout') || message.includes('aborted')) {
    return 'Request timed out. Please try again.';
  }
  if (message.includes('401') || message.includes('unauthorized')) {
    return 'Session expired. Please log in again.';
  }

  // Return server message for auth errors, generic for others
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
      error: null,
      _hasHydrated: false,

      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated });
      },

      isAuthenticated: () => {
        const { token, user } = get();
        return !!token && !!user && !isTokenExpired(token);
      },

      // Clear auth state
      clearAuth: () => {
        set({ token: null, tokenExpiry: null, user: null, error: null });
      },

      // Set auth state
      setAuth: (token, user) => {
        set({
          token,
          tokenExpiry: getTokenExpiry(token),
          user,
          error: null,
        });
      },

      // Check token validity
      isTokenValid: () => {
        const { token } = get();
        return ! isTokenExpired(token);
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
          console.error('Hydration error:', error);
        }
        if (state) {
          // Check if token is expired on hydration
          if (state.token && isTokenExpired(state.token)) {
            console. log('Token expired on hydration, clearing auth');
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

export const register = async (username, email, password) => {
  useAuthUserStore.setState({ isLoading: true, error: null });

  try {
    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeEmail(email);

    // Basic client-side validation
    if (!sanitizedUsername || !sanitizedEmail || !password) {
      throw new Error('All fields are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const response = await fetchWithTimeout(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: sanitizedUsername,
        email: sanitizedEmail,
        password,
      }),
    });

    const data = await response.json();

    if (! response.ok) {
      throw new Error(data. message || 'Registration failed');
    }

    if (! data.token || !data.user) {
      throw new Error('Invalid server response');
    }

    // Use server-provided user data (not decoded JWT)
    useAuthUserStore.getState().setAuth(data.token, data.user);
    useAuthUserStore.setState({ isLoading: false });

    return { success: true };

  } catch (error) {
    console.error('[register] error:', error.message);
    const errorMessage = getGenericError(error);
    useAuthUserStore.setState({ error: errorMessage, isLoading: false });
    return { success: false, error: errorMessage };
  }
};

export const login = async (email, password) => {
  useAuthUserStore.setState({ isLoading: true, error: null });

  try {
    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(email);

    if (!sanitizedEmail || !password) {
      throw new Error('Email and password are required');
    }

    const response = await fetchWithTimeout(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: sanitizedEmail,
        password,
      }),
    });

    const data = await response. json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (!data. token || !data. user) {
      throw new Error('Invalid server response');
    }

    // Trust server-provided user data, not JWT decode
    useAuthUserStore.getState(). setAuth(data. token, data.user);
    useAuthUserStore.setState({ isLoading: false });

    return { success: true };

  } catch (error) {
    console.error('[login] error:', error. message);
    const errorMessage = getGenericError(error);
    useAuthUserStore.setState({ error: errorMessage, isLoading: false });
    return { success: false, error: errorMessage };
  }
};

export const logout = async () => {
  try {
    // Optionally notify server of logout (for token blacklisting)
    const { token } = useAuthUserStore.getState();
    if (token) {
      // Fire and forget - don't block logout on server response
      fetchWithTimeout(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }). catch(() => {});
    }
  } finally {
    // Always clear local state
    useAuthUserStore.getState().clearAuth();
    // Clear secure storage
    await secureStorage.removeItem('auth-storage');
  }
};

export const updateUser = async (updatedData) => {
  const { token, user } = useAuthUserStore.getState();

  if (!token || !user) {
    return { success: false, error: 'User not authenticated' };
  }

  // Check token expiry before making request
  if (isTokenExpired(token)) {
    await logout();
    return { success: false, error: 'Session expired. Please log in again.' };
  }

  useAuthUserStore.setState({ isLoading: true, error: null });

  try {
    // Sanitize updateable fields
    const sanitizedData = {};
    if (updatedData. username) {
      sanitizedData.username = sanitizeInput(updatedData.username);
    }
    if (updatedData.profilePicture) {
      sanitizedData.profilePicture = sanitizeInput(updatedData.profilePicture);
    }

    if (Object.keys(sanitizedData).length === 0) {
      throw new Error('No valid update data provided');
    }

    const response = await fetchWithTimeout(`${API_URL}/api/auth/user/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sanitizedData),
    });

    const data = await response. json();

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
    });

    return { success: true, user: data.user };

  } catch (error) {
    console. error('[updateUser] error:', error.message);
    const errorMessage = getGenericError(error);
    useAuthUserStore.setState({ error: errorMessage, isLoading: false });
    return { success: false, error: errorMessage };
  }
};

export const fetchProtected = async (path, options = {}, retries = MAX_RETRIES) => {
  const { token } = useAuthUserStore.getState();

  if (! token) {
    throw new Error('No token available');
  }

  // Check token expiry
  if (isTokenExpired(token)) {
    await logout();
    throw new Error('Session expired.  Please log in again.');
  }

  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetchWithTimeout(`${API_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options. headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response. status === 401) {
          await logout();
          throw new Error('Session expired.  Please log in again.');
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;

    } catch (error) {
      lastError = error;

      // Don't retry auth errors
      if (error. message. includes('expired') || error.message.includes('401')) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
};

// ============================================================
// REFRESH USER DATA FROM SERVER
// ============================================================

export const refreshUser = async () => {
  const { token } = useAuthUserStore.getState();

  if (! token || isTokenExpired(token)) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const data = await fetchProtected('/api/auth/me');
    useAuthUserStore.setState({ user: data.user });
    return { success: true, user: data.user };
  } catch (error) {
    console. error('[refreshUser] error:', error. message);
    return { success: false, error: error.message };
  }
};

// ============================================================
// CHECK USER (for app initialization / hydration)
// ============================================================

export const checkUser = async () => {
  useAuthUserStore.setState({ isLoading: true, error: null });

  try {
    const { token, user } = useAuthUserStore.getState();

    // If no token, user is not authenticated
    if (!token) {
      useAuthUserStore.setState({ isLoading: false });
      return { success: false, error: 'No token' };
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      console.log('[checkUser] Token expired, clearing auth');
      useAuthUserStore.getState().clearAuth();
      useAuthUserStore.setState({ isLoading: false });
      return { success: false, error: 'Token expired' };
    }

    // If we have a valid token and user in store, we're good
    if (user) {
      useAuthUserStore.setState({ isLoading: false });
      return { success: true, user };
    }

    // Otherwise, fetch user from server
    const response = await fetchWithTimeout(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response. json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify user');
    }

    useAuthUserStore.setState({
      user: data.user,
      isLoading: false,
    });

    return { success: true, user: data.user };

  } catch (error) {
    console. error('[checkUser] error:', error.message);
    useAuthUserStore.getState().clearAuth();
    useAuthUserStore.setState({ isLoading: false });
    return { success: false, error: error.message };
  }
};

// ============================================================
// CHECK USER WITH RETRY (for unreliable networks)
// ============================================================

export const checkUserWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await checkUser();

      if (result. success) {
        return result;
      }

      // Don't retry if it's an auth error (no token or expired)
      if (result.error === 'No token' || result. error === 'Token expired') {
        return result;
      }

      // Wait before retry (exponential backoff)
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
      }

    } catch (err) {
      console.error(`[checkUserWithRetry] Attempt ${i + 1} failed:`, err. message);

      if (i === retries - 1) {
        return { success: false, error: err.message };
      }

      await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
    }
  }

  return { success: false, error: 'Max retries reached' };
};