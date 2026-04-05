import { useState, useEffect, useCallback } from 'react';
import useHydrated from './useHydrated';
import { API_URL } from '../constants/api';

// Fetch rating from the server
const fetchRatingFromServer = async (storyId, slug, token) => {
  const res = await fetch(
    `${API_URL}/api/blog/check?storyId=${storyId}&slug=${encodeURIComponent(slug)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    }
  );

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const raw = await res.text();
    console.error('[fetchRatingFromServer] Non‑JSON response:', raw.slice(0, 200));
    throw new Error(`Expected JSON but got: ${contentType}`);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    const message = data?.message || data?.error || `Unknown error (${res.status})`;
    throw new Error(`Fetch rating failed: ${message}`);
  }

  return data;
};

// Submit a new rating to the server
async function submitRatingToServer(storyId, slug, score, token) {
  if (!storyId || !slug || typeof score !== 'number') return score;

  try {
    const res = await fetch(`${API_URL}/api/blog/story/${storyId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ score }),
    });

    const json = await res.json();
    console.log('[submitRatingToServer] Response:', json);

    return typeof json?.score === 'number' ? json.score : score;
  } catch (err) {
    console.error('[submitRatingToServer] Failed to submit rating:', err);
    return score;
  }
}

// Main hook
export default function useHydratedRating(storyId, slug, token, initialRating = 0) {
  const isHydrated = useHydrated();
  const [rating, setRating] = useState(initialRating);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendHasRated = rating > 0;
  const backendMessage = error ? 'Rating failed' : 'Rating loaded';
  const ratingKey = `${storyId ?? 'unknown'}-${rating}`;

  const loadRating = useCallback(async () => {
    if (!storyId || !slug || !token) return;
    setLoading(true);
    setError(null);
    try {
      const srvRating = await fetchRatingFromServer(storyId, slug, token);
      console.log('[useHydratedRating] Loaded rating:', srvRating);
      setRating(srvRating);
    } catch (err) {
      console.error('[useHydratedRating] loadRating error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [storyId, slug, token]);

  const updateRating = useCallback(async (newRating) => {
    if (!isHydrated || !storyId || !slug || !token) return;
    setLoading(true);
    setError(null);
    try {
      const saved = await submitRatingToServer(storyId, slug, newRating, token);
      console.log('[useHydratedRating] Updated rating:', saved);
      setRating(saved);
    } catch (err) {
      console.error('[useHydratedRating] updateRating error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [storyId, slug, token, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      console.log('[useHydratedRating] Hydration complete, loading rating...');
      loadRating();
    }
  }, [isHydrated, loadRating]);

  return {
    rating,
    loading,
    error,
    updateRating,
    isHydrated,
    backendHasRated,
    backendMessage,
    ratingKey,
  };
}
