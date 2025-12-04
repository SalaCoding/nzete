import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getRatingMessage } from '../lib/message';
import { useAuthUserStore, fetchProtected } from '../library/authUserStore';
import { normalizeSlug } from '../app/story/[slug]';
import { API_URL } from '../constants/api';

export function useRating({ storyId, lang = 'en' }) {
  const { slug: slugParam } = useLocalSearchParams();
  const apiSlug = normalizeSlug(slugParam);
  const token = useAuthUserStore(state => state.token);

  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [message, setMessage] = useState('');
  const [key, setKey] = useState(0);

  const isReady = !!storyId && !!apiSlug && !!token;

  useEffect(() => {
    if (!isReady) return;

    const hydrate = async () => {
      try {
        const data = await fetchProtected(`${API_URL}/api/blog/story/${storyId}/rate/${apiSlug}`, token);
        const score = data?.userRating?.score ?? data?.rating?.score ?? data?.score ?? 0;

        setRating(score);
        setHasRated(score > 0);
        setMessage(getRatingMessage(score, { lang, tense: 'past' }));
        setKey(prev => prev + 1);
      } catch (err) {
        console.warn('Rating hydration failed:', err);
        setMessage(getRatingMessage(null, {
          lang,
          tense: 'past',
          fallback: 'Tokóki kozwa eyano te na tango oyo.',
        }));
      }
    };

    hydrate();
  }, [isReady, storyId, apiSlug, token, lang]);

  return {
    rating,
    hasRated,
    message,
    key,
    isReady,
    apiSlug,
  };
}
