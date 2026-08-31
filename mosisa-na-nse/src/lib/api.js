import { API_URL } from '../constants/api';
import { useAuthUserStore } from '../library/authUserStore';

/**
 * A robust, authenticated fetch wrapper with timeouts and detailed error handling.
 */
export const fetchProtected = async (path, options = {}) => {
  const { token } = useAuthUserStore.getState();
  if (!token) {
    throw new Error('Missing auth token');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

  const url = path.startsWith('http') ? path : `${API_URL}${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId); // Clear timeout on successful response

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      let data = {};
      try {
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          data = await res.text();
        }
      } catch {
        // Ignore parsing errors on failed responses
      }
      const message =
        typeof data === 'string'
          ? data
          : data?.message || data?.error || `Unknown error (${res.status})`;
      throw new Error(`Request failed (${res.status}): ${message}`);
    }

    if (!contentType.includes('application/json')) {
      throw new Error(`Expected JSON but received: ${contentType}`);
    }

    try {
      return await res.json();
    } catch (error) {
      console.error('❌ Failed to parse JSON:', error);
      throw new Error('Failed to parse JSON from server');
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Network request timed out');
    }
    // Re-throw other errors to be caught by the caller
    throw error;
  } finally {
    // Ensure timeout is always cleared
    clearTimeout(timeoutId);
  }
};